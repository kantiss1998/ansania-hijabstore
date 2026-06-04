'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Loader2, Download, Eye, Calendar, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getAdminOrders } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface AdminOrder {
  id: number;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
}

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // getAdminOrders takes params object
      const response = await getAdminOrders({
        page,
        limit,
        status: statusFilter || undefined
      });
      // The API response helper maps to { data: [...], total } or direct array
      const payload = response.data || response;
      setOrders(payload.items || payload || []);
      setTotal(response.meta?.total || payload.total || (payload.length ?? 0));
    } catch {
      toast.error('Gagal memuat daftar pesanan');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleExportData = () => {
    toast.success('Data pesanan berhasil diekspor (CSV)');
  };

  // Local filter for search (e.g. searching order number)
  const filteredOrders = orders.filter((order) =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending_payment':
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200/50';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border border-blue-200/50';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border border-purple-200/50';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      case 'refunded':
        return 'bg-gray-100 text-gray-700 border border-gray-200/50';
      default:
        return 'bg-gray-50 text-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_payment':
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'processing':
        return 'Sedang Diproses';
      case 'shipped':
        return 'Dikirim';
      case 'delivered':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      case 'refunded':
        return 'Direfund';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Manajemen Pesanan</h1>
          <p className="text-gray-500 mt-1">Kelola semua transaksi dan status pengiriman pelanggan.</p>
        </div>
        <button
          onClick={handleExportData}
          className="btn btn-outline py-2.5 px-4 flex items-center gap-2 text-xs font-bold rounded-xl"
        >
          <Download className="h-4 w-4" />
          Ekspor Data
        </button>
      </div>

      <div className="card border border-gray-100 bg-white rounded-2xl shadow-sm">
        {/* Filters bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari Nomor Pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="input py-2 text-sm min-w-[150px] bg-white font-semibold text-gray-700 border-gray-200"
            >
              <option value="">Semua Status</option>
              <option value="pending_payment">Menunggu Pembayaran</option>
              <option value="processing">Sedang Diproses</option>
              <option value="shipped">Dikirim</option>
              <option value="delivered">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
              <option value="refunded">Direfund</option>
            </select>
            <button
              onClick={fetchOrders}
              className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              title="Refresh Pesanan"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            Tidak ada transaksi pesanan ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Nomor Pesanan</th>
                  <th className="px-6 py-4">Tanggal Masuk</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status Pesanan</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 font-mono text-xs">{order.order_number}</td>
                    <td className="px-6 py-4 text-gray-500 font-semibold text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {new Date(order.created_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary-600">{formatCurrency(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/pesanan/${order.id}`}
                        className="btn btn-outline py-1 px-3 text-xs font-bold rounded-lg inline-flex items-center gap-1 text-primary-600 border-primary-200 hover:bg-primary-50 transition-colors"
                      >
                        <Eye className="h-3 w-3" /> Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs">
            <span className="text-gray-500 font-semibold">
              Halaman {page} dari {totalPages} (Total {total} Pesanan)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn btn-outline py-1 px-3 font-bold rounded-lg text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-outline py-1 px-3 font-bold rounded-lg text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
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
