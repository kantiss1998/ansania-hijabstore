'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2, Tag, Loader2, X, Save, Image as ImageIcon } from 'lucide-react';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/services/api/admin';
import type { Category } from '@/types/product.types';
import toast from 'react-hot-toast';

interface AdminCategory extends Category {
  is_active?: number;
  sort_order?: number;
}

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminCategories();
      setCategories(data || []);
    } catch {
      toast.error('Gagal memuat kategori');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setSelectedCategory(null);
    setName('');
    setSlug('');
    setParentId('');
    setDescription('');
    setSortOrder('0');
    setIsActive(true);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: AdminCategory) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setParentId(cat.parentId ? String(cat.parentId) : '');
    setDescription(cat.description || '');
    setSortOrder(String(cat.sort_order ?? 0));
    setIsActive(cat.is_active === 1);
    setImageFile(null);
    setImagePreview(cat.imageUrl || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran gambar maksimal 2MB');
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
    if (!name) {
      toast.error('Nama kategori wajib diisi');
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    if (parentId) formData.append('parent_id', parentId);
    formData.append('description', description);
    formData.append('sort_order', sortOrder);
    formData.append('is_active', isActive ? '1' : '0');
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, formData);
        toast.success('Kategori berhasil diperbarui');
      } else {
        await createCategory(formData);
        toast.success('Kategori berhasil dibuat');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Gagal menyimpan kategori');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    try {
      await deleteCategory(id);
      toast.success('Kategori berhasil dihapus');
      fetchCategories();
    } catch {
      toast.error('Gagal menghapus kategori');
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Kategori Produk</h1>
          <p className="text-gray-500 mt-1">Kelola daftar kategori untuk mempermudah pencarian.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm rounded-xl font-bold"
        >
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </button>
      </div>

      <div className="card border border-gray-100 bg-white rounded-2xl shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama kategori..."
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
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-body text-sm">
            Tidak ada kategori ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold w-12">No</th>
                  <th className="px-6 py-4 font-semibold">Nama Kategori</th>
                  <th className="px-6 py-4 font-semibold">Slug</th>
                  <th className="px-6 py-4 font-semibold">Urutan</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCategories.map((cat, index) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-50 border border-primary-100 overflow-hidden flex items-center justify-center">
                          {cat.imageUrl ? (
                            <Image
                              src={cat.imageUrl.startsWith('http') ? cat.imageUrl : `http://localhost:3001${cat.imageUrl}`}
                              alt={cat.name}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <Tag className="h-4 w-4 text-primary-600" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{cat.name}</span>
                          {cat.parentId && (
                            <span className="text-[10px] text-gray-400 font-semibold block">Sub dari ID: {cat.parentId}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{cat.slug}</td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">{cat.sort_order ?? 0}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${cat.is_active === 1 ? 'badge-success' : 'badge-danger'}`}>
                        {cat.is_active === 1 ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
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
                {selectedCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Nama Kategori *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input py-2 text-sm"
                    placeholder="cth. Hijab Voal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Slug (Opsional)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="input py-2 text-sm font-mono"
                    placeholder="cth. hijab-voal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Kategori Induk</label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="input py-2 text-sm w-full"
                  >
                    <option value="">Tidak ada (Kategori Utama)</option>
                    {categories
                      .filter((c) => !selectedCategory || c.id !== selectedCategory.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
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
                <label className="text-xs font-bold text-gray-500">Deskripsi</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input py-2 text-sm font-body"
                  placeholder="Deskripsi singkat kategori..."
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Gambar Kategori</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-55 shrink-0">
                    {imagePreview ? (
                      <Image
                        src={imagePreview.startsWith('data:') || imagePreview.startsWith('blob:') ? imagePreview : (imagePreview.startsWith('http') ? imagePreview : `http://localhost:3001${imagePreview}`)}
                        alt="Preview"
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
                      className="btn btn-outline py-1.5 px-3 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
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
                    <p className="text-[10px] text-gray-400">Rekomendasi rasio 1:1, maks 2MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="cat-active" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                  Aktifkan kategori
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

