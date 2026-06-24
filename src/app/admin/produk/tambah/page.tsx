'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import NextImage from 'next/image';
import { createProduct, addProductVariant, addProductImage, getAdminCategories, getAdminBrands } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface VariantInput {
  sku: string;
  name: string;
  price: number;
  stock: number;
  weight_gram: number;
}

export default function AdminTambahProdukPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [price, setPrice] = useState(0);
  const [comparePrice, setComparePrice] = useState(0);
  const [weightGram, setWeightGram] = useState(200);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Specifications state
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([
    { key: 'Bahan', value: '' },
    { key: 'Ukuran', value: '' }
  ]);
  
  // Variants state
  const [variants, setVariants] = useState<VariantInput[]>([
    { sku: '', name: 'Default', price: 0, stock: 10, weight_gram: 200 }
  ]);

  // Images state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catsData, brandsData] = await Promise.all([
          getAdminCategories(),
          getAdminBrands()
        ]);
        setCategories(catsData || []);
        setBrands(brandsData || []);
      } catch {
        toast.error('Gagal mengambil metadata kategori/brand');
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleAddVariant = () => {
    setVariants(prev => [
      ...prev,
      { sku: '', name: '', price: price, stock: 10, weight_gram: weightGram }
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length === 1) {
      toast.error('Minimal harus ada 1 variasi produk');
      return;
    }
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, key: keyof VariantInput, value: string | number) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [key]: value
      };
      return updated;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId) {
      toast.error('Nama produk dan kategori wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert specifications array to JSON object
      const specsObj = specifications.reduce((acc, curr) => {
        if (curr.key.trim()) {
          acc[curr.key.trim()] = curr.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);

      // 1. Create base product
      const productPayload = {
        name,
        description,
        category_id: parseInt(categoryId),
        brand_id: brandId ? parseInt(brandId) : null,
        price,
        compare_price: comparePrice || null,
        weight_gram: weightGram,
        is_active: isActive,
        is_featured: isFeatured,
        specifications: Object.keys(specsObj).length > 0 ? specsObj : null
      };

      const resProduct = await createProduct(productPayload);
      const newProduct = resProduct.data || resProduct;
      const productId = newProduct.id;

      // 2. Add variants
      for (const variant of variants) {
        await addProductVariant(productId, {
          sku: variant.sku || `${name.substring(0, 3).toUpperCase()}-${variant.name.toUpperCase()}-${Math.floor(Math.random()*1000)}`,
          name: variant.name || 'Default',
          price: variant.price || price,
          stock: variant.stock,
          weight_gram: variant.weight_gram || weightGram,
          is_active: true
        });
      }

      // 3. Add images
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append('image', selectedFiles[i]);
        formData.append('is_primary', i === 0 ? '1' : '0');
        formData.append('sort_order', String(i));
        await addProductImage(productId, formData);
      }

      toast.success('Produk berhasil ditambahkan');
      router.push('/admin/produk');
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Gagal menambahkan produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingMetadata) {
    return (
      <div className="py-20 text-center text-gray-400">
        Memuat metadata formulir...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/produk" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black font-heading text-gray-900">Tambah Produk</h1>
            <p className="text-gray-500 mt-0.5">Buat produk baru dengan variasi dan gambar.</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary py-2.5 px-5 flex items-center gap-2 text-sm rounded-xl font-bold shadow-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Simpan Produk
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: General Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="card border border-gray-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-2">Informasi Produk</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Nama Produk *</label>
              <input
                type="text"
                required
                placeholder="cth. Kerudung Voal Premium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input py-2 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Deskripsi Lengkap</label>
              <textarea
                rows={5}
                placeholder="Jelaskan detail produk, bahan, ukuran, dll..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Harga Jual Dasar (IDR) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  className="input py-2 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Harga Coret / Asli (IDR)</label>
                <input
                  type="number"
                  min={0}
                  value={comparePrice}
                  onChange={(e) => setComparePrice(parseInt(e.target.value) || 0)}
                  className="input py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Kategori *</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input py-2 text-sm"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Brand</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="input py-2 text-sm"
                >
                  <option value="">Pilih Brand (Opsional)</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Berat Pengiriman (Gram) *</label>
              <input
                type="number"
                required
                min={1}
                value={weightGram}
                onChange={(e) => setWeightGram(parseInt(e.target.value) || 0)}
                className="input py-2 text-sm"
              />
            </div>
          </div>

          {/* Specifications Panel */}
          <div className="card border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
              <h3 className="text-base font-bold text-gray-900">Spesifikasi Produk</h3>
              <button
                type="button"
                onClick={() => setSpecifications(prev => [...prev, { key: '', value: '' }])}
                className="btn btn-outline py-1 px-3 text-xs font-bold flex items-center gap-1.5 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Baris
              </button>
            </div>
            
            {specifications.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">Belum ada spesifikasi ditambahkan.</p>
            ) : (
              <div className="space-y-3">
                {specifications.map((spec, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Nama Atribut (cth: Bahan)"
                      value={spec.key}
                      onChange={(e) => {
                        const updated = [...specifications];
                        updated[idx].key = e.target.value;
                        setSpecifications(updated);
                      }}
                      className="input py-1.5 px-3 text-xs flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Nilai Atribut (cth: Voal Premium)"
                      value={spec.value}
                      onChange={(e) => {
                        const updated = [...specifications];
                        updated[idx].value = e.target.value;
                        setSpecifications(updated);
                      }}
                      className="input py-1.5 px-3 text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setSpecifications(prev => prev.filter((_, i) => i !== idx))}
                      className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variants Management */}
          <div className="card border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
              <h3 className="text-base font-bold text-gray-900">Variasi & Stok</h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="btn btn-outline py-1 px-3 text-xs font-bold flex items-center gap-1.5 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Variasi
              </button>
            </div>

            <div className="space-y-4 divide-y divide-gray-100">
              {variants.map((variant, index) => (
                <div key={index} className="pt-4 first:pt-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-primary-600">Varian #{index + 1}</span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">Nama Varian (cth. Merah / XL)</label>
                      <input
                        type="text"
                        placeholder="Nama Varian"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className="input py-1.5 px-3 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">SKU Varian</label>
                      <input
                        type="text"
                        placeholder="SKU"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        className="input py-1.5 px-3 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">Stok Awal</label>
                      <input
                        type="number"
                        min={0}
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                        className="input py-1.5 px-3 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">Harga Khusus (IDR)</label>
                      <input
                        type="number"
                        min={0}
                        value={variant.price || price}
                        onChange={(e) => handleVariantChange(index, 'price', parseInt(e.target.value) || 0)}
                        className="input py-1.5 px-3 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Images & Status */}
        <div className="space-y-6">
          {/* Status Settings */}
          <div className="card border border-gray-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-2">Status & Visibilitas</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-gray-800">Aktifkan Produk</label>
                <p className="text-xs text-gray-500">Tampilkan produk ke pembeli.</p>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-3">
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-gray-800">Produk Unggulan</label>
                <p className="text-xs text-gray-500">Tampilkan di halaman utama.</p>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
              />
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="card border border-gray-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-2">Galeri Foto</h3>
            
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary-300 transition-colors relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700">Pilih berkas foto</p>
              <p className="text-[10px] text-gray-400 mt-1">Mendukung format PNG, JPG, JPEG (Max. 2MB)</p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-100 aspect-square">
                    <NextImage src={preview} alt="Preview" className="w-full h-full object-cover" width={200} height={200} unoptimized />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 bg-white text-red-500 rounded-lg hover:scale-105 transition-transform"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] bg-primary-500 text-white font-bold px-1.5 py-0.5 rounded">
                        Utama
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
