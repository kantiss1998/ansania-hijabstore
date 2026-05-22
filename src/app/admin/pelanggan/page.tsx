'use client';

import { useState } from 'react';
import { Search, Mail, Phone, ShoppingBag, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminPelangganPage() {
  const [customers] = useState([
    { id: 'CUST-001', name: 'Budi Santoso', email: 'budi@example.com', phone: '081234567890', totalOrders: 5, totalSpent: 1250000, joined: '10 Jan 2023' },
    { id: 'CUST-002', name: 'Siti Aminah', email: 'siti.aminah@example.com', phone: '085678901234', totalOrders: 2, totalSpent: 450000, joined: '15 Mar 2023' },
    { id: 'CUST-003', name: 'Rudi Hermawan', email: 'rudi.h@example.com', phone: '089876543210', totalOrders: 12, totalSpent: 4500000, joined: '02 Feb 2022' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Pelanggan</h1>
          <p className="text-gray-500 mt-1">Kelola data pelanggan terdaftar dan riwayat transaksinya.</p>
        </div>
      </div>

      <div className="card border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Cari nama, email, atau telepon..." className="input pl-9 py-2 text-sm" />
          </div>
          <div className="flex gap-2">
            <select className="input py-2 text-sm min-w-[150px]">
              <option value="">Urutkan: Terbaru</option>
              <option value="orders">Pesanan Terbanyak</option>
              <option value="spent">Total Belanja (Tertinggi)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Pelanggan</th>
                <th className="px-6 py-4 font-semibold">Kontak</th>
                <th className="px-6 py-4 font-semibold">Statistik Belanja</th>
                <th className="px-6 py-4 font-semibold">Bergabung Pada</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-gray-600 flex items-center gap-2 text-xs"><Mail className="w-3 h-3"/> {customer.email}</p>
                      <p className="text-gray-600 flex items-center gap-2 text-xs"><Phone className="w-3 h-3"/> {customer.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-gray-900 font-semibold flex items-center gap-2 text-xs"><ShoppingBag className="w-3 h-3 text-primary-500"/> {customer.totalOrders} Pesanan</p>
                      <p className="text-green-600 font-bold text-xs">{formatCurrency(customer.totalSpent)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{customer.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors font-semibold inline-flex items-center gap-1 text-xs">
                      <Eye className="h-4 w-4" /> Detail
                    </button>
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
