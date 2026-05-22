'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Loader2, MoreVertical } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
// import { getAdminProducts, deleteProduct } from '@/services/api/admin'; // TODO

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Gamis Khadijah', sku: 'GM-KHD-01', price: 350000, stock: 124, category: 'Gamis', status: 'active' },
        { id: 2, name: 'Tunik Aisyah', sku: 'TN-ASY-02', price: 275000, stock: 45, category: 'Tunik', status: 'active' },
        { id: 3, name: 'Hijab Instan Bergo', sku: 'HJ-BRG-03', price: 85000, stock: 0, category: 'Hijab', status: 'out_of_stock' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Katalog Produk</h1>
          <p className="text-gray-500 mt-1">Kelola data produk, harga, dan stok.</p>
        </div>
        <button className="btn-primary py-2 px-4 flex items-center gap-2 text-sm rounded-xl">
          <Plus className="h-4 w-4" />
          Tambah Produk
        </button>
      </div>

      <div className="card border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama produk atau SKU..."
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="input py-2 text-sm min-w-[120px]">
              <option value="">Semua Kategori</option>
              <option value="gamis">Gamis</option>
              <option value="hijab">Hijab</option>
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
                  <th className="px-6 py-4 font-semibold w-12">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-4 font-semibold">Produk</th>
                  <th className="px-6 py-4 font-semibold">SKU</th>
                  <th className="px-6 py-4 font-semibold">Kategori</th>
                  <th className="px-6 py-4 font-semibold">Harga</th>
                  <th className="px-6 py-4 font-semibold">Stok</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={product.stock > 10 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.status === 'active' ? 'Aktif' : 'Habis'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Menampilkan 1-10 dari 450 produk</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">Sebelumnya</button>
            <button className="px-3 py-1 bg-primary-50 text-primary-700 font-bold rounded-lg border border-primary-100">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
}
