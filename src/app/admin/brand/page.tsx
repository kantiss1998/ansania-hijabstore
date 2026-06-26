'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2, Award, Loader2, X, Save, Image as ImageIcon } from 'lucide-react';
import { getAdminBrands, createBrand, updateBrand, deleteBrand } from '@/services/api/admin';
import toast from 'react-hot-toast';
import type { AdminBrand } from '@/types/product.types';
import { BACKEND_URL } from '@/lib/api';

export default function AdminBrandPage() {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<AdminBrand | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminBrands();
      setBrands(data || []);
    } catch {
      toast.error('Gagal memuat daftar brand');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openCreateModal = () => {
    setSelectedBrand(null);
    setName('');
    setSlug('');
    setDescription('');
    setSortOrder('0');
    setIsActive(true);
    setLogoFile(null);
    setLogoPreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (b: AdminBrand) => {
    setSelectedBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setDescription(b.description || '');
    setSortOrder(String(b.sort_order ?? 0));
    setIsActive(b.is_active === 1);
    setLogoFile(null);
    setLogoPreview(b.logo_url || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran logo maksimal 2MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Nama brand wajib diisi');
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    formData.append('description', description);
    formData.append('sort_order', sortOrder);
    formData.append('is_active', isActive ? '1' : '0');
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      if (selectedBrand) {
        await updateBrand(selectedBrand.id, formData);
        toast.success('Brand berhasil diperbarui');
      } else {
        await createBrand(formData);
        toast.success('Brand berhasil dibuat');
      }
      setIsModalOpen(false);
      fetchBrands();
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan brand';
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus brand ini?')) return;
    try {
      await deleteBrand(id);
      toast.success('Brand berhasil dihapus');
      fetchBrands();
    } catch {
      toast.error('Gagal menghapus brand');
    }
  };

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Manajemen Brand</h1>
          <p className="text-gray-500 mt-1">Kelola merk/brand produk yang dijual.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm rounded-xl font-bold"
        >
          <Plus className="h-4 w-4" />
          Tambah Brand
        </button>
      </div>

      <div className="card border border-gray-100 bg-white rounded-2xl shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-body text-sm">
            Tidak ada brand ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold w-12">No</th>
                  <th className="px-6 py-4 font-semibold">Brand</th>
                  <th className="px-6 py-4 font-semibold">Slug</th>
                  <th className="px-6 py-4 font-semibold">Urutan</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-body">
                {filteredBrands.map((brand, index) => (
                  <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 overflow-hidden flex items-center justify-center">
                          {brand.logo_url && typeof brand.logo_url === 'string' && brand.logo_url.trim() !== '' ? (
                            <Image
                              src={brand.logo_url.startsWith('http') ? brand.logo_url : `${BACKEND_URL}${brand.logo_url}`}
                              alt={brand.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <Award className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{brand.name}</span>
                          {brand.description && (
                            <span className="text-xs text-gray-400 line-clamp-1">{brand.description}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{brand.slug}</td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">{brand.sort_order ?? 0}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${brand.is_active === 1 ? 'badge-success' : 'badge-danger'}`}>
                        {brand.is_active === 1 ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(brand)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-lg font-black font-heading text-gray-900">
                {selectedBrand ? 'Edit Brand' : 'Tambah Brand Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm font-body">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Nama Brand *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input py-2 text-sm"
                    placeholder="cth. Ansania Premium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Slug (Opsional)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="input py-2 text-sm font-mono"
                    placeholder="cth. ansania-premium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 font-heading">Urutan Tampil</label>
                <input
                  type="number"
                  min={0}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="input py-2 text-sm w-full max-w-[200px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Deskripsi Brand</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="Deskripsi singkat brand..."
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Logo Brand</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                    {logoPreview && typeof logoPreview === 'string' && logoPreview.trim() !== '' ? (
                      <Image
                        src={
                          logoPreview.startsWith('data:') || logoPreview.startsWith('blob:')
                            ? logoPreview
                            : logoPreview.startsWith('http')
                            ? logoPreview
                            : `${BACKEND_URL}${logoPreview}`
                        }
                        alt="Logo Preview"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-outline py-1.5 px-3 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      Pilih Logo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-[10px] text-gray-400 font-semibold">Rekomendasi logo transparan/putih, maks 2MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="brand-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300 cursor-pointer"
                />
                <label htmlFor="brand-active" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                  Aktifkan Brand
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline py-2 px-4 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary py-2 px-5 flex items-center gap-2 text-xs font-bold rounded-xl shadow-md"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
