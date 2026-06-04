'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, Settings, ArrowRight, Loader2, Trash2 } from 'lucide-react';
import { syncJubelioInventory, syncJubelioProducts, getJubelioSyncLogs, resetJubelioSync } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface SyncLog {
  id: number;
  sync_type: string;
  status: string;
  items_processed: number;
  items_success: number;
  items_failed: number;
  log_details?: string | null;
  created_at: string;
}

export default function AdminJubelioPage() {
  const [isSyncingInventory, setIsSyncingInventory] = useState(false);
  const [isSyncingProducts, setIsSyncingProducts] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  
  // Toggle switches states (mocked visually)
  const [autoSyncProducts, setAutoSyncProducts] = useState(true);
  const [autoSyncOrders, setAutoSyncOrders] = useState(true);

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const data = await getJubelioSyncLogs();
      setLogs(data || []);
    } catch {
      toast.error('Gagal memuat log sinkronisasi');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSyncInventory = async () => {
    setIsSyncingInventory(true);
    toast.loading('Memulai sinkronisasi stok inventaris Jubelio...', { id: 'sync-inv' });
    try {
      const res = await syncJubelioInventory();
      toast.success(res.message || 'Sinkronisasi stok selesai!', { id: 'sync-inv' });
      fetchLogs();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Gagal sinkronisasi stok', { id: 'sync-inv' });
    } finally {
      setIsSyncingInventory(false);
    }
  };

  const handleSyncProducts = async () => {
    if (!confirm('Peringatan: Sinkronisasi produk penuh memerlukan waktu lebih lama karena memuat semua variant produk dan memperbarui database. Lanjutkan?')) return;
    
    setIsSyncingProducts(true);
    toast.loading('Sinkronisasi penuh produk Jubelio sedang berjalan...', { id: 'sync-prod', duration: 10000 });
    try {
      const result = await syncJubelioProducts();
      toast.success(result.message || 'Sinkronisasi produk selesai!', { id: 'sync-prod' });
      fetchLogs();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Gagal sinkronisasi produk', { id: 'sync-prod' });
    } finally {
      setIsSyncingProducts(false);
    }
  };

  const handleResetSync = async () => {
    if (!confirm('Peringatan: Tindakan ini akan menghapus semua produk, varian, riwayat mutasi stok, transaksi simulasi kosong terkait, dan log sinkronisasi yang berasal dari Jubelio. Data manual Anda tidak akan tersentuh. Lanjutkan?')) return;
    
    setIsResetting(true);
    toast.loading('Mereset data sinkronisasi Jubelio...', { id: 'reset-sync' });
    try {
      const res = await resetJubelioSync();
      toast.success(res.message || 'Data sinkronisasi berhasil direset!', { id: 'reset-sync' });
      fetchLogs();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Gagal mereset data sinkronisasi', { id: 'reset-sync' });
    } finally {
      setIsResetting(false);
    }
  };

  const getLastSyncTime = () => {
    if (logs.length === 0) return 'Belum pernah';
    const lastSuccess = logs.find((l) => l.status === 'success');
    if (!lastSuccess) return 'Belum pernah sukses';
    return new Date(lastSuccess.created_at).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-body">
      <div>
        <h1 className="text-2xl font-black font-heading text-gray-900">Sinkronisasi Jubelio</h1>
        <p className="text-gray-500 mt-1">Integrasi inventaris dan pesanan Omnichannel dengan Jubelio.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sync Controls Panel */}
        <div className="card p-6 border border-gray-100 bg-white rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <RefreshCw className={`h-6 w-6 ${(isSyncingInventory || isSyncingProducts) ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Sinkronisasi Manual</h2>
                <p className="text-xs text-gray-400 font-semibold">Hubungkan stok & produk dengan server Jubelio.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold">Status Koneksi</span>
                <span className="text-green-600 font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5"/> Terhubung
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-gray-200/50 pt-2">
                <span className="text-gray-400 font-bold">Sinkronisasi Terakhir</span>
                <span className="font-bold text-gray-700">{getLastSyncTime()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleSyncInventory}
              disabled={isSyncingInventory || isSyncingProducts}
              className="w-full btn btn-primary py-2.5 rounded-xl shadow-md flex justify-center items-center gap-2 text-xs font-bold"
            >
              {isSyncingInventory ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Menghubungkan...
                </>
              ) : (
                <>
                  Sinkronkan Stok Inventaris <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <button 
              onClick={handleSyncProducts}
              disabled={isSyncingInventory || isSyncingProducts || isResetting}
              className="w-full btn btn-outline border-gray-200 hover:bg-gray-50 py-2.5 rounded-xl flex justify-center items-center gap-2 text-xs font-bold text-gray-700"
            >
              {isSyncingProducts ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Menarik Katalog...
                </>
              ) : (
                <>
                  Sinkronkan Penuh Produk <RefreshCw className="h-3.5 w-3.5" />
                </>
              )}
            </button>

            <button 
              onClick={handleResetSync}
              disabled={isSyncingInventory || isSyncingProducts || isResetting}
              className="w-full btn bg-red-50 hover:bg-red-100 border border-red-200 py-2.5 rounded-xl flex justify-center items-center gap-2 text-xs font-bold text-red-700 cursor-pointer transition-colors"
            >
              {isResetting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" /> Mereset Data...
                </>
              ) : (
                <>
                  Hapus Data Sinkronisasi <Trash2 className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Configurations Panel */}
        <div className="space-y-6">
          <div className="card p-6 border border-gray-100 bg-white rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm border-b border-gray-50 pb-2">
              <Settings className="w-4 h-4 text-gray-400" /> Konfigurasi Auto-Sync
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setAutoSyncProducts(!autoSyncProducts)}>
                <div>
                  <p className="font-bold text-gray-800 text-xs">Sync Produk & Stok Otomatis</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Otomatis update setiap 15 menit</p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSyncProducts ? 'bg-primary-600' : 'bg-gray-200'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${autoSyncProducts ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </div>
              <div className="flex items-center justify-between cursor-pointer border-t border-gray-50 pt-3" onClick={() => setAutoSyncOrders(!autoSyncOrders)}>
                <div>
                  <p className="font-bold text-gray-800 text-xs">Sync Pesanan Masuk Otomatis</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Kirim data transaksi baru langsung ke Jubelio</p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSyncOrders ? 'bg-primary-600' : 'bg-gray-200'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${autoSyncOrders ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex gap-3 text-orange-850 text-xs">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-orange-500" />
            <div>
              <p className="font-bold mb-0.5">Catatan Penting Pemetaan SKU</p>
              <p className="text-gray-600 font-semibold">
                Pastikan pemetaan SKU produk di sistem web sama persis dengan SKU yang ada di dashboard Jubelio agar stok terhubung secara otomatis dan sinkron tanpa kesalahan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Logs Table */}
      <div className="card border border-gray-100 bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <h2 className="font-bold text-gray-900 text-sm">Riwayat Log Sinkronisasi</h2>
          <button 
            onClick={fetchLogs} 
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title="Refresh Logs"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {isLoadingLogs ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs font-semibold">
            Belum ada riwayat log sinkronisasi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-bold">Waktu</th>
                  <th className="px-4 py-3 font-bold">Tipe Sync</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold text-center">Total Item</th>
                  <th className="px-4 py-3 font-bold text-center text-green-600">Sukses</th>
                  <th className="px-4 py-3 font-bold text-center text-red-600">Gagal</th>
                  <th className="px-4 py-3 font-bold">Detail Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 font-bold capitalize text-gray-700">
                      {log.sync_type === 'full' ? 'Produk Penuh' : 'Stok Inventaris'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${log.status === 'success' ? 'badge-success' : 'badge-danger'}`}>
                        {log.status === 'success' ? 'Berhasil' : 'Gagal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-gray-600">{log.items_processed}</td>
                    <td className="px-4 py-3 text-center font-bold text-green-600">{log.items_success}</td>
                    <td className="px-4 py-3 text-center font-bold text-red-600">{log.items_failed}</td>
                    <td className="px-4 py-3 text-gray-600 font-semibold max-w-xs truncate" title={log.log_details || ''}>
                      {log.log_details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
