'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Loader2, Star, Tag, RefreshCw } from 'lucide-react';
import { getAdminProducts, deleteProduct, getAdminCategories } from '@/services/api/admin';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface AdminProduct {
  id: number;
  name: string;
  category_id: number;
  category_name?: string;
  is_featured: number;
  is_active: number;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getAdminCategories();
      setCategories(data || []);
    } catch {
      console.error('Failed to fetch categories');
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // getAdminProducts accepts params: { limit, offset, is_active, ... }
      const offset = (page - 1) * limit;
      const response = await getAdminProducts({
        limit,
        offset,
        category_id: categoryFilter || undefined
      });
      
      const payload = response.data || response;
      setProducts(payload.items || payload || []);
      setTotal(response.meta?.total || payload.total || (payload.length ?? 0));
    } catch {
      toast.error('Gagal memuat katalog produk');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, categoryFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus/menonaktifkan produk ini?')) return;
    try {
      await deleteProduct(id);
      toast.success('Produk berhasil dinonaktifkan');
      fetchProducts();
    } catch {
      toast.error('Gagal menghapus produk');
    }
  };

  // Local filter for search (filtering by product name)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Katalog Produk</h1>
          <p className="text-gray-500 mt-1">Kelola data produk, harga, dan stok.</p>
        </div>
        <Link
          href="/admin/produk/tambah"
          className="btn btn-primary py-2.5 px-5 flex items-center gap-2 text-sm rounded-xl font-bold font-body"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Link>
      </div>

      <div className="card border border-gray-100 bg-white rounded-2xl shadow-sm">
        {/* Filters and search */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="input py-2 text-sm min-w-[150px] bg-white font-semibold text-gray-700 border-gray-200"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={fetchProducts}
              className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              title="Refresh Produk"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            Tidak ada produk ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Produk</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                          <Tag className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{product.name}</span>
                          <span className="text-[10px] text-gray-450 font-bold block">
                            Kategori ID: {product.category_id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.is_featured === 1 ? (
                        <span className="badge bg-purple-100 text-purple-750 font-bold flex items-center gap-1 w-fit">
                          <Star className="h-3 w-3 fill-current" /> Featured
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs font-semibold">Biasa</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${product.is_active === 1 ? 'badge-success' : 'badge-danger'}`}>
                        {product.is_active === 1 ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/produk/${product.id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Ubah Produk"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Produk"
                        >
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
        
        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <span className="text-gray-500 font-semibold">
              Halaman {page} dari {totalPages} (Total {total} Produk)
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn btn-outline py-1 px-2.5 font-bold rounded-lg text-gray-650 border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-[10px] sm:text-xs"
              >
                Sebelumnya
              </button>
              
              {(() => {
                const pages = [];
                const maxButtons = 5;
                let startPage = Math.max(1, page - 2);
                let endPage = Math.min(totalPages, startPage + maxButtons - 1);
                
                if (endPage - startPage + 1 < maxButtons) {
                  startPage = Math.max(1, endPage - maxButtons + 1);
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }

                return (
                  <div className="flex items-center gap-1">
                    {startPage > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPage(1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          1
                        </button>
                        {startPage > 2 && <span className="text-gray-400 px-0.5 font-bold">...</span>}
                      </>
                    )}
                    
                    {pages.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          page === p
                            ? 'bg-[#0A0A0A] text-white border border-[#0A0A0A]'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    {endPage < totalPages && (
                      <>
                        {endPage < totalPages - 1 && <span className="text-gray-400 px-0.5 font-bold">...</span>}
                        <button
                          type="button"
                          onClick={() => setPage(totalPages)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                );
              })()}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-outline py-1 px-2.5 font-bold rounded-lg text-gray-650 border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-[10px] sm:text-xs"
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
