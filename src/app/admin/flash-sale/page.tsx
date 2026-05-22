'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Zap, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminFlashSalePage() {
  const [flashSales] = useState([
    { id: 1, name: 'Flash Sale 10.10', productsCount: 15, startTime: '2023-10-10 00:00', endTime: '2023-10-10 23:59', status: 'ended' },
    { id: 2, name: 'Weekend Deals', productsCount: 8, startTime: '2023-10-21 09:00', endTime: '2023-10-22 21:00', status: 'active' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Flash Sale</h1>
          <p className="text-gray-500 mt-1">Atur jadwal diskon waktu terbatas.</p>
        </div>
        <button className="btn-primary py-2 px-4 flex items-center gap-2 text-sm rounded-xl">
          <Plus className="h-4 w-4" />
          Buat Flash Sale
        </button>
      </div>

      <div className="card border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Cari nama event flash sale..." className="input pl-9 py-2 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Event Promo</th>
                <th className="px-6 py-4 font-semibold">Waktu Pelaksanaan</th>
                <th className="px-6 py-4 font-semibold">Total Produk</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {flashSales.map((fs) => (
                <tr key={fs.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="font-bold text-gray-900">{fs.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs">{fs.startTime} s/d {fs.endTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-semibold">{fs.productsCount} Item</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      fs.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {fs.status === 'active' ? 'Berlangsung' : 'Selesai'}
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
