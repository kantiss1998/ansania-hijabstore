'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Ticket } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminVoucherPage() {
  const [vouchers] = useState([
    { id: 1, code: 'DISKON10', type: 'percentage', value: 10, minPurchase: 100000, quota: 100, used: 45, status: 'active', expiredAt: '2023-12-31' },
    { id: 2, code: 'POTONGAN50', type: 'fixed', value: 50000, minPurchase: 200000, quota: 50, used: 50, status: 'depleted', expiredAt: '2023-11-30' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Voucher & Promo</h1>
          <p className="text-gray-500 mt-1">Buat dan kelola kode voucher diskon.</p>
        </div>
        <button className="btn-primary py-2 px-4 flex items-center gap-2 text-sm rounded-xl">
          <Plus className="h-4 w-4" />
          Buat Voucher
        </button>
      </div>

      <div className="card border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Cari kode voucher..." className="input pl-9 py-2 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Kode Voucher</th>
                <th className="px-6 py-4 font-semibold">Nilai Diskon</th>
                <th className="px-6 py-4 font-semibold">Min. Belanja</th>
                <th className="px-6 py-4 font-semibold">Kuota Terpakai</th>
                <th className="px-6 py-4 font-semibold">Berakhir Pada</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-primary-500" />
                      <span className="font-bold text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded">{voucher.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary-600">
                    {voucher.type === 'percentage' ? `${voucher.value}%` : formatCurrency(voucher.value)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatCurrency(voucher.minPurchase)}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className={voucher.used >= voucher.quota ? 'text-red-600 font-bold' : ''}>
                      {voucher.used} / {voucher.quota}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{voucher.expiredAt}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      voucher.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {voucher.status === 'active' ? 'Aktif' : 'Habis/Expired'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
