'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, ArrowLeftRight, Loader2, X, Save } from 'lucide-react';
import { getRedirects, createRedirect, updateRedirect, deleteRedirect } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface RedirectRoute {
  id: number;
  from_path: string;
  to_path: string;
  status_code: number;
  is_active: number;
}

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<RedirectRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRedirect, setSelectedRedirect] = useState<RedirectRoute | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [fromPath, setFromPath] = useState('');
  const [toPath, setToPath] = useState('');
  const [statusCode, setStatusCode] = useState(301);
  const [isActive, setIsActive] = useState(true);

  const fetchRedirects = async () => {
    setIsLoading(true);
    try {
      const data = await getRedirects();
      setRedirects(data || []);
    } catch {
      toast.error('Gagal memuat daftar redirects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const openCreateModal = () => {
    setSelectedRedirect(null);
    setFromPath('');
    setToPath('');
    setStatusCode(301);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (route: RedirectRoute) => {
    setSelectedRedirect(route);
    setFromPath(route.from_path);
    setToPath(route.to_path);
    setStatusCode(route.status_code);
    setIsActive(route.is_active === 1);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromPath || !toPath) {
      toast.error('Path asal dan path tujuan wajib diisi');
      return;
    }

    setIsSaving(true);
    const payload = {
      from_path: fromPath,
      to_path: toPath,
      status_code: statusCode,
      is_active: isActive ? 1 : 0,
    };

    try {
      if (selectedRedirect) {
        await updateRedirect(selectedRedirect.id, payload);
        toast.success('Redirect berhasil diperbarui');
      } else {
        await createRedirect(payload);
        toast.success('Redirect berhasil dibuat');
      }
      setIsModalOpen(false);
      fetchRedirects();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Gagal menyimpan redirect');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus redirect ini?')) return;
    try {
      await deleteRedirect(id);
      toast.success('Redirect berhasil dihapus');
      fetchRedirects();
    } catch {
      toast.error('Gagal menghapus redirect');
    }
  };

  const filteredRedirects = redirects.filter(
    (r) =>
      r.from_path.toLowerCase().includes(search.toLowerCase()) ||
      r.to_path.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary-600 mb-1">
            <Link href="/admin/cms" className="hover:underline">CMS</Link> &gt; <span>Redirects</span>
          </div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Manajemen URL Redirects</h1>
          <p className="text-gray-500 mt-1">Kelola URL redirects (301/302) untuk performa SEO toko.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary py-2 px-4 flex items-center gap-2 text-sm rounded-xl font-bold"
        >
          <Plus className="h-4 w-4" /> Tambah Redirect
        </button>
      </div>

      {/* Main Card */}
      <div className="card border border-gray-100 bg-white rounded-2xl shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari path asal atau tujuan..."
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
        ) : filteredRedirects.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-body text-sm">
            Tidak ada URL redirect ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Path Asal (From)</th>
                  <th className="px-6 py-4 font-semibold">Path Tujuan (To)</th>
                  <th className="px-6 py-4 font-semibold">Status Code</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRedirects.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{route.from_path}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">
                      <div className="flex items-center gap-1">
                        <ArrowLeftRight className="h-3.5 w-3.5 text-gray-400" />
                        {route.to_path}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono">{route.status_code}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${route.is_active === 1 ? 'badge-success' : 'badge-danger'}`}>
                        {route.is_active === 1 ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(route)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
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
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-lg font-black font-heading text-gray-900">
                {selectedRedirect ? 'Edit Redirect' : 'Tambah Redirect Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Path Asal (From Path) *</label>
                <input
                  type="text"
                  required
                  value={fromPath}
                  onChange={(e) => setFromPath(e.target.value)}
                  className="input py-2 text-sm font-mono"
                  placeholder="/produk-lama"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Path Tujuan (To Path) *</label>
                <input
                  type="text"
                  required
                  value={toPath}
                  onChange={(e) => setToPath(e.target.value)}
                  className="input py-2 text-sm font-mono"
                  placeholder="/produk-baru"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Tipe Redirect (HTTP Status Code) *</label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value))}
                  className="input py-2 text-sm"
                >
                  <option value={301}>301 (Permanent Redirect)</option>
                  <option value={302}>302 (Found / Temporary Redirect)</option>
                  <option value={307}>307 (Temporary Redirect)</option>
                  <option value={308}>308 (Permanent Redirect)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="redirect-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="redirect-active" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                  Aktifkan URL redirect ini
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
