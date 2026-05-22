'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Edit2, Eye, Loader2, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
// import { getAdminOrders } from '@/services/api/admin';

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setOrders([
        { id: 'ORD-1001', customer: 'Budi Santoso', date: '20 Okt 2023 14:30', total: 450000, status: 'pending', payment: 'BCA VA' },
        { id: 'ORD-1002', customer: 'Siti Aminah', date: '20 Okt 2023 10:15', total: 850000, status: 'processing', payment: 'OVO' },
        { id: 'ORD-1003', customer: 'Rudi Hermawan', date: '19 Okt 2023 09:00', total: 1250000, status: 'shipped', payment: 'Credit Card' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Manajemen Pesanan</h1>
          <p className="text-gray-500 mt-1">Kelola semua transaksi dan status pengiriman.</p>
        </div>
        <button className="btn-outline py-2 px-4 flex items-center gap-2 text-sm rounded-xl">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <div className="card border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari Order ID atau nama pelanggan..."
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="input py-2 text-sm min-w-[120px]">
              <option value="">Semua Status</option>
              <option value="pending">Menunggu Pembayaran</option>
              <option value="processing">Diproses</option>
              <option value="shipped">Dikirim</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Tanggal</th>
                  <th className="px-6 py-4 font-semibold">Pelanggan</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Pembayaran</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4 text-gray-600">{order.payment}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/pesanan/${order.id}`} className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors inline-block font-semibold">
                        Detail
                      </Link>
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
