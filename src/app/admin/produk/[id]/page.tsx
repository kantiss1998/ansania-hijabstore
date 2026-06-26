'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import {
  getAdminProductDetail,
  updateProduct,
  addProductVariant,
  updateProductVariant,
  adjustVariantStock,
  getProductStockMutations,
  addProductImage,
  deleteProductImage,
  updateProductImage,
  getAdminCategories,
  getAdminBrands
} from '@/services/api/admin';
import toast from 'react-hot-toast';
import type { AdminCategory as Category, AdminBrand as Brand, Variant, AdminProductImage as ProductImage } from '@/types/product.types';
import { BACKEND_URL } from '@/lib/api';

export default function AdminEditProdukPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product general states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [price, setPrice] = useState(0);
  const [comparePrice, setComparePrice] = useState(0);
  const [weightGram, setWeightGram] = useState(200);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Specifications management
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);

  // Variants management
  const [originalVariants, setOriginalVariants] = useState<Variant[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  // Images management
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Mutations management
  interface StockMutation {
    id: number;
    variant_id: number;
    variant_name: string;
    variant_sku: string;
    type: string;
    qty: number;
    qty_before: number;
    qty_after: number;
    note: string;
    creator_name: string | null;
    created_at: string;
  }

  const [mutations, setMutations] = useState<StockMutation[]>([]);
  const [mutationsTotal, setMutationsTotal] = useState(0);
  const [mutationsPage, setMutationsPage] = useState(1);
  const [isLoadingMutations, setIsLoadingMutations] = useState(false);

  // Manual adjustment form states
  const [adjustingVariantId, setAdjustingVariantId] = useState<number | ''>('');
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<'in' | 'out' | 'adjustment'>('adjustment');
  const [adjustNote, setAdjustNote] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const loadMutations = useCallback(async () => {
    setIsLoadingMutations(true);
    try {
      const response = await getProductStockMutations(productId, { page: mutationsPage, limit: 10 });
      setMutations(response.items || []);
      setMutationsTotal(response.total || 0);
    } catch (err) {
      console.error('Failed to load mutations:', err);
    } finally {
      setIsLoadingMutations(false);
    }
  }, [productId, mutationsPage]);

  useEffect(() => {
    if (productId) {
      loadMutations();
    }
  }, [productId, loadMutations]);

  const handleManualAdjustment = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!adjustingVariantId) {
      toast.error('Pilih varian yang akan disesuaikan');
      return;
    }
    if (adjustQty === 0) {
      toast.error('Jumlah perubahan tidak boleh 0');
      return;
    }

    setIsAdjusting(true);
    try {
      await adjustVariantStock(Number(adjustingVariantId), {
        qty: adjustQty,
        type: adjustType,
        note: adjustNote || 'Penyesuaian stok manual dari halaman edit produk'
      });
      toast.success('Stok berhasil disesuaikan!');
      
      // Reset form
      setAdjustQty(0);
      setAdjustNote('');
      
      // Reload mutations and product detail (to reflect new stock level)
      loadMutations();
      
      const productData = await getAdminProductDetail(productId);
      if (productData) {
        const loadedVariants = (productData.variants || []).map((v: Variant) => ({
          id: v.id,
          sku: v.sku,
          name: v.name,
          price: v.price,
          stock: v.stock,
          weight_gram: v.weight_gram,
          is_active: v.is_active === 1
        }));
        setOriginalVariants(JSON.parse(JSON.stringify(loadedVariants)));
        setVariants(loadedVariants);
      }
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyesuaikan stok';
      toast.error(errMsg);
    } finally {
      setIsAdjusting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsData, brandsData, productData] = await Promise.all([
          getAdminCategories(),
          getAdminBrands(),
          getAdminProductDetail(productId)
        ]);

        setCategories(catsData || []);
        setBrands(brandsData || []);

        // Populate form
        if (productData) {
          setName(productData.name || '');
          setDescription(productData.description || '');
          setCategoryId(String(productData.category_id || ''));
          setBrandId(String(productData.brand_id || ''));
          setPrice(productData.price || 0);
          setComparePrice(productData.compare_price || 0);
          setWeightGram(productData.weight_gram || 0);
          setIsActive(productData.is_active === 1);
          setIsFeatured(productData.is_featured === 1);
          setExistingImages(productData.images || []);

          // Format specifications
          if (productData.specifications) {
            let specsObj = productData.specifications;
            if (typeof specsObj === 'string') {
              try {
                specsObj = JSON.parse(specsObj);
              } catch {
                specsObj = {};
              }
            }
            const specsArray = Object.entries(specsObj).map(([key, val]) => ({
              key,
              value: String(val)
            }));
            setSpecifications(specsArray);
          } else {
            setSpecifications([]);
          }

          // Format original variants
          const loadedVariants = (productData.variants || []).map((v: Variant) => ({
            id: v.id,
            sku: v.sku,
            name: v.name,
            price: v.price,
            stock: v.stock,
            weight_gram: v.weight_gram,
            is_active: v.is_active === 1
          }));
          setOriginalVariants(JSON.parse(JSON.stringify(loadedVariants)));
          setVariants(loadedVariants);
        }
      } catch (error) {
        console.error(error);
        toast.error('Gagal memuat data produk');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadData();
    }
  }, [productId]);

  const handleAddVariant = () => {
    setVariants(prev => [
      ...prev,
      {
        sku: '',
        name: '',
        price: price,
        stock: 10,
        weight_gram: weightGram,
        is_active: true,
        isNew: true
      }
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    const variant = variants[index];
    if (variants.length === 1) {
      toast.error('Minimal harus ada 1 variasi produk');
      return;
    }

    if (!variant.isNew) {
      toast.error('Varian yang sudah tersimpan di database tidak dapat dihapus, silakan nonaktifkan statusnya.');
      return;
    }

    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, key: keyof Variant, value: string | number | boolean) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [key]: value
      } as Variant;
      return updated;
    });
  };

  // Immediate upload image handler (makes it easy to sync gallery)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setIsUploadingImage(true);
      try {
        for (const file of filesArray) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('is_primary', existingImages.length === 0 ? '1' : '0');
          formData.append('sort_order', String(existingImages.length));
          
          const response = await addProductImage(productId, formData);
          const newImg = response.data || response;
          setExistingImages(prev => [...prev, newImg]);
          toast.success(`Gambar ${file.name} berhasil diunggah`);
        }
      } catch (err: unknown) {
        const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal mengunggah gambar';
        toast.error(errMsg);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteProductImage(imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Gambar berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus gambar');
    }
  };

  const handleImageVariantChange = async (imageId: number, variantIdStr: string) => {
    const variantId = variantIdStr ? Number(variantIdStr) : null;
    try {
      await updateProductImage(imageId, { variant_id: variantId });
      setExistingImages(prev =>
        prev.map(img => img.id === imageId ? { ...img, variant_id: variantId } : img)
      );
      toast.success('Asosiasi varian gambar diperbarui');
    } catch {
      toast.error('Gagal memperbarui asosiasi varian');
    }
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

      // 1. Update general product info
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

      await updateProduct(productId, productPayload);

      // 2. Process variants
      for (const variant of variants) {
        if (variant.isNew) {
          // Add new variant
          await addProductVariant(productId, {
            sku: variant.sku || `${name.substring(0, 3).toUpperCase()}-${variant.name.toUpperCase()}-${Math.floor(Math.random()*1000)}`,
            name: variant.name || 'Default',
            price: variant.price || price,
            stock: variant.stock,
            weight_gram: variant.weight_gram || weightGram,
            is_active: !!variant.is_active
          });
        } else {
          // Find matching original variant
          const orig = originalVariants.find(o => o.id === variant.id);
          if (orig) {
            // Check if details changed
            const detailsChanged = 
              orig.sku !== variant.sku ||
              orig.name !== variant.name ||
              orig.price !== variant.price ||
              orig.weight_gram !== weightGram ||
              orig.is_active !== variant.is_active;
 
            if (detailsChanged) {
              await updateProductVariant(variant.id!, {
                sku: variant.sku,
                name: variant.name,
                price: variant.price,
                weight_gram: weightGram,
                is_active: !!variant.is_active
              });
            }

            // Check if stock changed
            if (orig.stock !== variant.stock) {
              const diff = variant.stock - orig.stock;
              await adjustVariantStock(variant.id!, {
                qty: diff,
                type: diff > 0 ? 'in' : 'out',
                note: 'Penyesuaian stok manual via admin edit produk'
              });
            }
          }
        }
      }

      toast.success('Produk berhasil diperbarui');
      router.push('/admin/produk');
    } catch (error: unknown) {
      console.error(error);
      const errMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal memperbarui produk';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-400 flex items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
        Memuat data produk...
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
            <h1 className="text-2xl font-black font-heading text-gray-900">Edit Produk</h1>
            <p className="text-gray-500 mt-0.5">Ubah informasi produk, variasi, dan galeri foto.</p>
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
              <Save className="w-4 h-4" /> Simpan Perubahan
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
                    <span className="text-xs font-bold text-primary-600">
                      Varian #{index + 1} {variant.id ? `(ID: ${variant.id})` : '(Baru)'}
                    </span>
                    {variant.isNew && (
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
                      <label className="text-[10px] font-bold text-gray-400">Stok</label>
                      <input
                        type="number"
                        min={0}
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                        className="input py-1.5 px-3 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">Harga (IDR)</label>
                      <input
                        type="number"
                        min={0}
                        value={variant.price || price}
                        onChange={(e) => handleVariantChange(index, 'price', parseInt(e.target.value) || 0)}
                        className="input py-1.5 px-3 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 items-center pt-2">
                    <div className="flex items-center gap-2 self-end pb-1.5">
                      <input
                        type="checkbox"
                        checked={!!variant.is_active}
                        onChange={(e) => handleVariantChange(index, 'is_active', e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                        id={`variant-active-${index}`}
                      />
                      <label htmlFor={`variant-active-${index}`} className="text-[11px] font-bold text-gray-600 cursor-pointer">
                        Varian Aktif
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Riwayat Mutasi & Penyesuaian Manual */}
          <div className="card border border-gray-100 p-6 space-y-6">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-2">Manajemen & Mutasi Stok</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form Penyesuaian Manual */}
              <div className="space-y-4 md:border-r md:border-gray-100 md:pr-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Penyesuaian Stok Manual</h4>
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400">Varian Produk</label>
                    <select
                      value={adjustingVariantId}
                      onChange={(e) => setAdjustingVariantId(e.target.value ? Number(e.target.value) : '')}
                      className="input py-1.5 px-3 text-xs w-full"
                    >
                      <option value="">Pilih Varian</option>
                      {variants.filter(v => v.id).map(v => (
                        <option key={v.id} value={v.id}>{v.name} ({v.sku}) - Stok saat ini: {v.stock}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">Tipe Perubahan</label>
                      <select
                        value={adjustType}
                        onChange={(e) => setAdjustType(e.target.value as 'in' | 'out' | 'adjustment')}
                        className="input py-1.5 px-3 text-xs w-full"
                      >
                        <option value="adjustment">Penyelarasan (+/-)</option>
                        <option value="in">Stok Masuk (+)</option>
                        <option value="out">Stok Keluar (-)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400">Jumlah (+ atau -)</label>
                      <input
                        type="number"
                        value={adjustQty}
                        onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                        placeholder="cth. 10 atau -5"
                        className="input py-1.5 px-3 text-xs w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400">Catatan</label>
                    <textarea
                      rows={2}
                      value={adjustNote}
                      onChange={(e) => setAdjustNote(e.target.value)}
                      placeholder="cth. Penyesuaian stok opname bulanan"
                      className="input py-1.5 px-3 text-xs w-full font-body"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleManualAdjustment()}
                    disabled={isAdjusting || !adjustingVariantId || adjustQty === 0}
                    className="w-full btn btn-primary py-2 text-xs font-bold rounded-lg flex justify-center items-center gap-1.5 cursor-pointer"
                  >
                    {isAdjusting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyesuaikan...
                      </>
                    ) : (
                      'Simpan Penyesuaian'
                    )}
                  </button>
                </div>
              </div>

              {/* Tabel Riwayat Mutasi */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Riwayat Mutasi</h4>
                
                {isLoadingMutations ? (
                  <div className="py-10 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                    Memuat riwayat mutasi...
                  </div>
                ) : mutations.length === 0 ? (
                  <div className="py-10 text-center text-xs text-gray-400">
                    Belum ada riwayat mutasi stok untuk produk ini.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400">
                            <th className="pb-2 font-bold">Waktu</th>
                            <th className="pb-2 font-bold">Varian</th>
                            <th className="pb-2 font-bold text-center">Tipe</th>
                            <th className="pb-2 font-bold text-center">Qty</th>
                            <th className="pb-2 font-bold text-center">Stok</th>
                            <th className="pb-2 font-bold">Catatan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {mutations.map((m) => (
                            <tr key={m.id} className="text-gray-600 hover:bg-gray-50/50">
                              <td className="py-2.5 pr-2 whitespace-nowrap text-gray-400">
                                {new Date(m.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                              </td>
                              <td className="py-2.5 pr-2">
                                <span className="font-bold">{m.variant_name || 'Default'}</span>
                                <span className="block text-[10px] text-gray-400">{m.variant_sku}</span>
                              </td>
                              <td className="py-2.5 text-center pr-2">
                                <span className={`inline-block px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase ${
                                  m.type === 'in' || m.type === 'released'
                                    ? 'bg-green-50 text-green-700 border border-green-150'
                                    : m.type === 'out' || m.type === 'reserved'
                                    ? 'bg-red-50 text-red-700 border border-red-150'
                                    : 'bg-blue-50 text-blue-700 border border-blue-150'
                                }`}>
                                  {m.type}
                                </span>
                              </td>
                              <td className="py-2.5 text-center font-mono font-bold pr-2">
                                {m.type === 'in' || m.type === 'released' ? '+' : '-'}{m.qty}
                              </td>
                              <td className="py-2.5 text-center text-gray-400 font-mono pr-2">
                                {m.qty_before} → {m.qty_after}
                              </td>
                              <td className="py-2.5 max-w-[120px] truncate text-gray-500 font-body" title={m.note}>
                                {m.note || '-'}
                                {m.creator_name && <span className="block text-[9px] text-gray-400 font-display">Oleh: {m.creator_name}</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {mutationsTotal > 10 && (
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-gray-50 text-[10px]">
                        <span className="text-gray-450 font-semibold">
                          Halaman {mutationsPage} dari {Math.ceil(mutationsTotal / 10)} (Total {mutationsTotal} riwayat)
                        </span>
                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            type="button"
                            disabled={mutationsPage === 1}
                            onClick={() => setMutationsPage((p) => p - 1)}
                            className="btn btn-outline py-0.5 px-2 rounded-lg disabled:opacity-50 cursor-pointer text-[9px]"
                          >
                            Sebelumnya
                          </button>
                          
                          {(() => {
                            const pages = [];
                            const tPages = Math.ceil(mutationsTotal / 10);
                            const maxButtons = 5;
                            let startPage = Math.max(1, mutationsPage - 2);
                            let endPage = Math.min(tPages, startPage + maxButtons - 1);
                            
                            if (endPage - startPage + 1 < maxButtons) {
                              startPage = Math.max(1, endPage - maxButtons + 1);
                            }

                            for (let i = startPage; i <= endPage; i++) {
                              pages.push(i);
                            }

                            return (
                              <div className="flex items-center gap-0.5">
                                {startPage > 1 && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => setMutationsPage(1)}
                                      className="w-5.5 h-5.5 flex items-center justify-center rounded border border-gray-200 text-gray-650 hover:bg-gray-50 font-bold"
                                    >
                                      1
                                    </button>
                                    {startPage > 2 && <span className="text-gray-400 px-0.5">...</span>}
                                  </>
                                )}
                                
                                {pages.map((p) => (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => setMutationsPage(p)}
                                    className={`w-5.5 h-5.5 flex items-center justify-center rounded font-bold transition-all ${
                                      mutationsPage === p
                                        ? 'bg-[#0A0A0A] text-white border border-[#0A0A0A]'
                                        : 'border border-gray-200 text-gray-650 hover:bg-gray-50'
                                    }`}
                                  >
                                    {p}
                                  </button>
                                ))}

                                {endPage < tPages && (
                                  <>
                                    {endPage < tPages - 1 && <span className="text-gray-400 px-0.5">...</span>}
                                    <button
                                      type="button"
                                      onClick={() => setMutationsPage(tPages)}
                                      className="w-5.5 h-5.5 flex items-center justify-center rounded border border-gray-200 text-gray-650 hover:bg-gray-50 font-bold"
                                    >
                                      {tPages}
                                    </button>
                                  </>
                                )}
                              </div>
                            );
                          })()}

                          <button
                            type="button"
                            disabled={mutationsPage * 10 >= mutationsTotal}
                            onClick={() => setMutationsPage((p) => p + 1)}
                            className="btn btn-outline py-0.5 px-2 rounded-lg disabled:opacity-50 cursor-pointer text-[9px]"
                          >
                            Berikutnya
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                disabled={isUploadingImage}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {isUploadingImage ? (
                <>
                  <Loader2 className="w-8 h-8 text-primary-500 mx-auto mb-2 animate-spin" />
                  <p className="text-xs font-bold text-primary-700">Mengunggah gambar...</p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700">Pilih berkas foto baru</p>
                  <p className="text-[10px] text-gray-400 mt-1">Mendukung format PNG, JPG, JPEG (Max. 2MB)</p>
                </>
              )}
            </div>

            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="flex flex-col border border-gray-150 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="relative aspect-square w-full">
                      <Image src={image.url && typeof image.url === 'string' && image.url.trim() !== '' ? (image.url.startsWith('http') ? image.url : `${BACKEND_URL}${image.url}`) : 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop'} alt="Product" width={150} height={150} className="w-full h-full object-cover" unoptimized />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image.id)}
                          className="p-1.5 bg-white text-red-500 rounded-lg hover:scale-105 transition-transform"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {image.is_primary === 1 && (
                        <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-primary-500 text-white font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Utama
                        </span>
                      )}
                    </div>
                    {/* Variant Select */}
                    <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                      <select
                        value={image.variant_id || ''}
                        onChange={(e) => handleImageVariantChange(image.id, e.target.value)}
                        className="w-full text-[10px] font-bold py-1 px-1.5 rounded border border-gray-200 bg-white font-body focus:outline-none"
                      >
                        <option value="">Semua Varian</option>
                        {variants.filter(v => v.id).map(v => (
                          <option key={v.id} value={v.id}>{v.sku || v.name}</option>
                        ))}
                      </select>
                    </div>
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
