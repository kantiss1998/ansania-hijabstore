'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, FileCode, Loader2, X, Save } from 'lucide-react';
import { getNotificationTemplates, createNotificationTemplate } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface NotificationTemplate {
  id: number;
  key: string;
  subject: string | null;
  body_email: string | null;
  body_push: string | null;
  variables: string | null;
}

export default function AdminNotificationTemplatesPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [key, setKey] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyEmail, setBodyEmail] = useState('');
  const [bodyPush, setBodyPush] = useState('');
  const [variables, setVariables] = useState('');

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await getNotificationTemplates();
      setTemplates(data || []);
    } catch {
      toast.error('Gagal memuat template notifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openCreateModal = () => {
    setKey('');
    setSubject('');
    setBodyEmail('');
    setBodyPush('');
    setVariables('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key) {
      toast.error('Key template wajib diisi');
      return;
    }

    setIsSaving(true);
    const parsedVariables = variables
      ? variables.split(',').map((v) => v.trim())
      : [];

    const payload = {
      key,
      subject: subject || null,
      body_email: bodyEmail || null,
      body_push: bodyPush || null,
      variables: parsedVariables,
    };

    try {
      await createNotificationTemplate(payload);
      toast.success('Template notifikasi berhasil dibuat');
      setIsModalOpen(false);
      fetchTemplates();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Gagal membuat template');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTemplates = templates.filter((t) =>
    t.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary-600 mb-1">
            <Link href="/admin/cms" className="hover:underline">CMS</Link> &gt; <span>Templates</span>
          </div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Template Notifikasi</h1>
          <p className="text-gray-500 mt-1">Kelola email dan push message templates untuk otomasi transaksi.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary py-2 px-4 flex items-center gap-2 text-sm rounded-xl font-bold"
        >
          <Plus className="h-4 w-4" /> Tambah Template
        </button>
      </div>

      {/* Main Card */}
      <div className="card border border-gray-100 bg-white rounded-2xl shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari key template..."
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
        ) : filteredTemplates.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-body text-sm">
            Tidak ada template notifikasi ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Key</th>
                  <th className="px-6 py-4 font-semibold">Subjek Email</th>
                  <th className="px-6 py-4 font-semibold">Push Body</th>
                  <th className="px-6 py-4 font-semibold">Variabel Pendukung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTemplates.map((template) => {
                  let formattedVars = '-';
                  try {
                    if (template.variables) {
                      const parsed = typeof template.variables === 'string' ? JSON.parse(template.variables) : template.variables;
                      if (Array.isArray(parsed)) {
                        formattedVars = parsed.map(v => `{{${v}}}`).join(', ');
                      }
                    }
                  } catch {}

                  return (
                    <tr key={template.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          <FileCode className="h-4 w-4 text-primary-500" />
                          {template.key}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]" title={template.subject || ''}>
                        {template.subject || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]" title={template.body_push || ''}>
                        {template.body_push || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">{formattedVars}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-lg font-black font-heading text-gray-900">Tambah Template Notifikasi</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Key Template *</label>
                <input
                  type="text"
                  required
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="input py-2 text-sm font-mono"
                  placeholder="order_paid"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Subjek Email</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="Pembayaran Berhasil untuk Order {{order_number}}"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Isi Email (HTML)</label>
                <textarea
                  rows={4}
                  value={bodyEmail}
                  onChange={(e) => setBodyEmail(e.target.value)}
                  className="input py-2 text-sm font-mono"
                  placeholder="<p>Halo {{name}}, pembayaran order {{order_number}} telah kami terima...</p>"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Isi Pesan Push (Push Notification / WA)</label>
                <textarea
                  rows={2}
                  value={bodyPush}
                  onChange={(e) => setBodyPush(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="Halo {{name}}, pembayaran untuk pesanan {{order_number}} berhasil!"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Variabel Pendukung (pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={variables}
                  onChange={(e) => setVariables(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="name, order_number, total_amount"
                />
                <p className="text-[10px] text-gray-400">Variabel ini dapat digunakan di subjek dan isi notifikasi menggunakan format double curly braces, cth: {"{{name}}"}</p>
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
