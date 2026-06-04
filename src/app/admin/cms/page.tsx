'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, FileText, Loader2, Eye, X, Save } from 'lucide-react';
import { getLandingPages, createLandingPage, updateLandingPage, deleteLandingPage } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface LandingPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  is_active: number;
}

export default function AdminCmsPage() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const data = await getLandingPages();
      setPages(data || []);
    } catch {
      toast.error('Gagal memuat halaman CMS');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openCreateModal = () => {
    setSelectedPage(null);
    setTitle('');
    setSlug('');
    setContent('');
    setMetaTitle('');
    setMetaDescription('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (page: LandingPage) => {
    setSelectedPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setMetaTitle(page.meta_title || '');
    setMetaDescription(page.meta_description || '');
    setIsActive(page.is_active === 1);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      toast.error('Judul, slug, dan konten wajib diisi');
      return;
    }

    setIsSaving(true);
    const payload = {
      title,
      slug,
      content,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      is_active: isActive ? 1 : 0,
    };

    try {
      if (selectedPage) {
        await updateLandingPage(selectedPage.id, payload);
        toast.success('Landing page berhasil diperbarui');
      } else {
        await createLandingPage(payload);
        toast.success('Landing page berhasil dibuat');
      }
      setIsModalOpen(false);
      fetchPages();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Gagal menyimpan landing page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus landing page ini?')) return;
    try {
      await deleteLandingPage(id);
      toast.success('Landing page berhasil dihapus');
      fetchPages();
    } catch {
      toast.error('Gagal menghapus landing page');
    }
  };

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">CMS Landing Pages</h1>
          <p className="text-gray-500 mt-1">Kelola konten halaman statis dan promosi toko.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/cms/redirects" className="btn btn-outline py-2 px-4 text-xs font-bold rounded-xl">
            Atur Redirects
          </Link>
          <Link href="/admin/cms/templates" className="btn btn-outline py-2 px-4 text-xs font-bold rounded-xl">
            Template Notifikasi
          </Link>
          <button
            onClick={openCreateModal}
            className="btn-primary py-2 px-4 flex items-center gap-2 text-sm rounded-xl font-bold"
          >
            <Plus className="h-4 w-4" /> Tambah Halaman
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="card border border-gray-100 bg-white rounded-2xl shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul atau slug..."
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
        ) : filteredPages.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-body text-sm">
            Tidak ada landing page ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Judul Halaman</th>
                  <th className="px-6 py-4 font-semibold">Slug URL</th>
                  <th className="px-6 py-4 font-semibold">SEO Title</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary-500" />
                        {page.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">/{page.slug}</td>
                    <td className="px-6 py-4 text-gray-500">{page.meta_title || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${page.is_active === 1 ? 'badge-success' : 'badge-danger'}`}>
                        {page.is_active === 1 ? 'Aktif' : 'Draf'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/landing/${page.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(page)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-lg font-black font-heading text-gray-900">
                {selectedPage ? 'Edit Landing Page' : 'Buat Landing Page Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Judul Halaman *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input py-2 text-sm"
                    placeholder="Tentang Kami"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="input py-2 text-sm font-mono"
                    placeholder="tentang-kami"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Konten Halaman (HTML/Markdown) *</label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input py-2 text-sm font-mono"
                  placeholder="<p>Masukkan konten landing page di sini...</p>"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Meta Title SEO</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="input py-2 text-sm"
                    placeholder="Judul untuk mesin pencari"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Meta Description SEO</label>
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="input py-2 text-sm"
                    placeholder="Deskripsi singkat untuk Google"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="page-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="page-active" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                  Aktifkan halaman dan publikasikan ke pembeli
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
