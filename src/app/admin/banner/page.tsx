'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, X, Save, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { getAdminBanners, createBanner, updateBanner, deleteBanner } from '@/services/api/admin';
import toast from 'react-hot-toast';
import type { AdminBanner } from '@/types/product.types';
import { BACKEND_URL } from '@/lib/api';

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<AdminBanner | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [position, setPosition] = useState('homepage_hero');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminBanners();
      setBanners(data || []);
    } catch {
      toast.error('Gagal memuat daftar banner');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setSelectedBanner(null);
    setTitle('');
    setSubtitle('');
    setLinkUrl('');
    setPosition('homepage_hero');
    setSortOrder('0');
    setIsActive(true);
    setStartsAt('');
    setEndsAt('');
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (b: AdminBanner) => {
    setSelectedBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setLinkUrl(b.link_url || '');
    setPosition(b.position);
    setSortOrder(String(b.sort_order ?? 0));
    setIsActive(b.is_active === 1);
    setStartsAt(b.starts_at ? new Date(b.starts_at).toISOString().split('T')[0] : '');
    setEndsAt(b.ends_at ? new Date(b.ends_at).toISOString().split('T')[0] : '');
    setImageFile(null);
    setImagePreview(b.image_url || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran gambar maksimal 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Judul banner wajib diisi');
      return;
    }
    if (!selectedBanner && !imageFile) {
      toast.error('Gambar banner wajib diunggah untuk banner baru');
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('link_url', linkUrl);
    formData.append('position', position);
    formData.append('sort_order', sortOrder);
    formData.append('is_active', isActive ? '1' : '0');
    if (startsAt) formData.append('starts_at', new Date(startsAt).toISOString());
    if (endsAt) formData.append('ends_at', new Date(endsAt).toISOString());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (selectedBanner) {
        await updateBanner(selectedBanner.id, formData);
        toast.success('Banner berhasil diperbarui');
      } else {
        await createBanner(formData);
        toast.success('Banner berhasil dibuat');
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan banner';
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus banner ini?')) return;
    try {
      await deleteBanner(id);
      toast.success('Banner berhasil dihapus');
      fetchBanners();
    } catch {
      toast.error('Gagal menghapus banner');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Manajemen Banner</h1>
          <p className="text-gray-500 mt-1">Atur gambar banner/slider untuk promosi toko.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm rounded-xl font-bold font-body"
        >
          <Plus className="h-4 w-4" />
          Tambah Banner
        </button>
      </div>

      <div className="card border border-gray-100 p-6 bg-white rounded-2xl shadow-sm">
        {isLoading ? (
          <div className="py-16 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-body text-sm">
            Tidak ada banner yang terdaftar.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 font-body">
            {banners.map((banner) => (
              <div key={banner.id} className="border border-gray-100 rounded-2xl overflow-hidden group shadow-sm flex flex-col justify-between">
                <div className="aspect-[21/9] bg-gray-50 relative overflow-hidden">
                  {banner.image_url ? (
                    <Image
                      src={banner.image_url.startsWith('http') ? banner.image_url : `${BACKEND_URL}${banner.image_url}`}
                      alt={banner.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <ImageIcon className="h-8 w-8 opacity-55" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="p-2 bg-white rounded-xl shadow-md text-gray-600 hover:text-primary-600 hover:scale-105 transition-all"
                      title="Edit Banner"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 bg-white rounded-xl shadow-md text-gray-600 hover:text-red-600 hover:scale-105 transition-all"
                      title="Hapus Banner"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-white space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{banner.title}</h3>
                      <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full capitalize shrink-0">
                        {banner.position.replace('_', ' ')}
                      </span>
                    </div>
                    {banner.subtitle && (
                      <p className="text-xs text-gray-400 line-clamp-2">{banner.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
                    <span className={`badge ${banner.is_active === 1 ? 'badge-success' : 'badge-danger'}`}>
                      {banner.is_active === 1 ? 'Aktif' : 'Nonaktif'}
                    </span>
                    {banner.link_url && (
                      <a
                        href={banner.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-primary-600 hover:underline flex items-center gap-1 font-bold"
                      >
                        <LinkIcon className="h-3 w-3" /> Link
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-lg font-black font-heading text-gray-900">
                {selectedBanner ? 'Edit Banner' : 'Tambah Banner Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm font-body">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Judul Banner *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="cth. Promo Hijab Voal Terkini"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Subjudul / Deskripsi Banner</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="cth. Dapatkan diskon menarik s.d 40%"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Posisi Banner *</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="input py-2 text-sm w-full"
                  >
                    <option value="homepage_hero">Hero Utama Home</option>
                    <option value="homepage_middle">Tengah Home</option>
                    <option value="homepage_bottom">Bawah Home</option>
                    <option value="promo_page">Halaman Promo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Urutan Tampil</label>
                  <input
                    type="number"
                    min={0}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="input py-2 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Link Tujuan URL (Opsional)</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="cth. https://ansania.com/promo-voal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Tanggal Mulai (Opsional)</label>
                  <input
                    type="date"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="input py-2 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Tanggal Berakhir (Opsional)</label>
                  <input
                    type="date"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="input py-2 text-sm"
                  />
                </div>
              </div>

              {/* Banner Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Gambar Banner *</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-12 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                    {imagePreview ? (
                      <Image
                        src={
                          imagePreview.startsWith('data:') || imagePreview.startsWith('blob:')
                            ? imagePreview
                            : imagePreview.startsWith('http')
                            ? imagePreview
                            : `${BACKEND_URL}${imagePreview}`
                        }
                        alt="Preview"
                        width={96}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-outline py-1.5 px-3 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      Pilih Gambar
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-[10px] text-gray-400">Rekomendasi rasio 21:9 atau 16:9, maks 5MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="banner-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300 cursor-pointer"
                />
                <label htmlFor="banner-active" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                  Tampilkan Banner Ini
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
