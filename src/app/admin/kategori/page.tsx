'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Tag } from 'lucide-react';

export default function AdminKategoriPage() {
  const [categories] = useState([
    { id: 1, name: 'Gamis', slug: 'gamis', products: 124, status: 'active' },
    { id: 2, name: 'Tunik', slug: 'tunik', products: 45, status: 'active' },
    { id: 3, name: 'Hijab Instan', slug: 'hijab-instan', products: 85, status: 'active' },
    { id: 4, name: 'Aksesoris', slug: 'aksesoris', products: 12, status: 'inactive' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Kategori Produk</h1>
          <p className="text-gray-500 mt-1">Kelola daftar kategori untuk mempermudah pencarian.</p>
        </div>
        <button className="btn-primary py-2 px-4 flex items-center gap-2 text-sm rounded-xl">
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </button>
      </div>

      <div className="card border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Cari nama kategori..." className="input pl-9 py-2 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold w-12">No</th>
                <th className="px-6 py-4 font-semibold">Nama Kategori</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Total Produk</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat, index) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Tag className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-gray-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{cat.slug}</td>
                  <td className="px-6 py-4 text-gray-600 font-semibold">{cat.products} Item</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${cat.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {cat.status === 'active' ? 'Aktif' : 'Nonaktif'}
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
