'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shield, Clock, User, Cpu, RefreshCw } from 'lucide-react';
import { getActivityLogs } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface ActivityLog {
  id: number;
  admin_id: number;
  admin_name: string;
  admin_email: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'SYNC' | string;
  entity_type: string;
  entity_id: number | string | null;
  description: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [entityFilter, setEntityFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getActivityLogs({
        page,
        limit,
        entity_type: entityFilter,
        action: actionFilter
      });
      
      const payload = data.data || data;
      setLogs(payload.items || (Array.isArray(payload) ? payload : []));
      setTotal(data.meta?.total || payload.total || 0);
    } catch (error) {
      console.error('Gagal memuat log aktivitas:', error);
      toast.error('Gagal memuat log audit aktivitas');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, entityFilter, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Log Aktivitas</h1>
          <p className="text-gray-500 mt-1">Audit log historis dari semua tindakan administratif di sistem.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="btn btn-outline py-2 px-4 text-xs font-bold flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card border border-gray-100 p-4 flex flex-wrap gap-4 bg-gray-50/30">
        <div className="flex-1 min-w-[200px] space-y-1.5">
          <label className="text-xs font-bold text-gray-500">Filter Entitas</label>
          <select
            value={entityFilter}
            onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
            className="input py-2 text-sm bg-white"
          >
            <option value="">Semua Entitas</option>
            <option value="product">Produk (Product)</option>
            <option value="category">Kategori (Category)</option>
            <option value="brand">Brand</option>
            <option value="voucher">Voucher</option>
            <option value="flash_sale">Flash Sale</option>
            <option value="order">Pesanan (Order)</option>
            <option value="setting">Pengaturan (Setting)</option>
            <option value="banner">Banner</option>
            <option value="cms_page">Halaman CMS</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px] space-y-1.5">
          <label className="text-xs font-bold text-gray-500">Filter Tindakan</label>
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="input py-2 text-sm bg-white"
          >
            <option value="">Semua Tindakan</option>
            <option value="CREATE">CREATE (Tambah)</option>
            <option value="UPDATE">UPDATE (Ubah)</option>
            <option value="DELETE">DELETE (Hapus)</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="card border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Tindakan</th>
                <th className="px-6 py-4">Entitas</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4">IP & Sistem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    Memuat log aktivitas...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    Tidak ada catatan aktivitas audit.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 flex items-center gap-1.5 mt-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(log.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-[10px]">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-xs">{log.admin_name || 'System'}</p>
                          <p className="text-[10px] text-gray-500">{log.admin_email || 'cron@system'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        log.action === 'CREATE' ? 'badge-success' :
                        log.action === 'UPDATE' ? 'badge-primary' :
                        log.action === 'DELETE' ? 'badge-danger' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-xs text-gray-700">
                      {log.entity_type.toUpperCase()} {log.entity_id ? `#${log.entity_id}` : ''}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 max-w-xs break-words">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1 text-[10px] text-gray-500">
                        <p className="flex items-center gap-1 font-bold"><Shield className="w-3 h-3 text-gray-400" /> {log.ip_address || 'Local'}</p>
                        <p className="truncate max-w-[150px] flex items-center gap-1" title={log.user_agent || ''}>
                          <Cpu className="w-3 h-3 text-gray-400" /> {log.user_agent || 'Unknown Agent'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Halaman {page} dari {totalPages} ({total} baris)</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="btn btn-outline py-1 px-3 text-xs"
              >
                Sebelumnya
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="btn btn-outline py-1 px-3 text-xs"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
