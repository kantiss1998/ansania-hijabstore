'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Zap, X, Save, Loader2, Package, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import {
  getAdminFlashSales,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
  addFlashSaleItem,
  deleteFlashSaleItem,
  getAdminProducts,
  getAdminProductDetail
} from '@/services/api/admin';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/lib/api';

interface FlashSaleItem {
  id: number;
  flash_sale_id: number;
  variant_id: number;
  original_price: number;
  sale_price: number;
  discount_percent: number;
  quota: number;
  sold_count: number;
  is_active: number;
  sku: string;
  variant_name: string;
  product_name: string;
  primary_image?: string | null;
}

interface AdminFlashSale {
  id: number;
  name: string;
  description?: string | null;
  banner_url?: string | null;
  starts_at: string;
  ends_at: string;
  is_active: number;
  items?: FlashSaleItem[];
}

interface CompactProduct {
  id: number;
  name: string;
  sku?: string;
  is_active?: number;
}

interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
}

export default function AdminFlashSalePage() {
  const [flashSales, setFlashSales] = useState<AdminFlashSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Flash Sale Modal States
  const [isFSModalOpen, setIsFSModalOpen] = useState(false);
  const [selectedFS, setSelectedFS] = useState<AdminFlashSale | null>(null);
  const [isSavingFS, setIsSavingFS] = useState(false);

  // Flash Sale Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Items Management States
  const [activeFSForItems, setActiveFSForItems] = useState<AdminFlashSale | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);

  // Item Form Fields
  const [productsList, setProductsList] = useState<CompactProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [variantsList, setVariantsList] = useState<ProductVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [quota, setQuota] = useState('10');
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);

  const fetchFlashSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminFlashSales();
      setFlashSales(data || []);
      // If we are managing items for a flash sale, update it from fresh data
      if (activeFSForItems) {
        const updated = data.find((fs: AdminFlashSale) => fs.id === activeFSForItems.id);
        if (updated) {
          setActiveFSForItems(updated);
        }
      }
    } catch {
      toast.error('Gagal memuat daftar flash sale');
    } finally {
      setIsLoading(false);
    }
  }, [activeFSForItems]);

  useEffect(() => {
    fetchFlashSales();
  }, [fetchFlashSales]);

  // Helper to format ISO dates to datetime-local
  const formatDateTimeLocal = (isoString?: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const getStatusLabel = (fs: AdminFlashSale) => {
    const now = new Date();
    const starts = new Date(fs.starts_at);
    const ends = new Date(fs.ends_at);

    if (fs.is_active !== 1) {
      return { label: 'Nonaktif', className: 'badge-danger' };
    }
    if (now < starts) {
      return { label: 'Akan Datang', className: 'bg-blue-100 text-blue-700' };
    }
    if (now >= starts && now <= ends) {
      return { label: 'Berlangsung', className: 'badge-success' };
    }
    return { label: 'Telah Berakhir', className: 'badge-gray' };
  };

  const openCreateFSModal = () => {
    setSelectedFS(null);
    setTitle('');
    setDescription('');
    setStartsAt('');
    setEndsAt('');
    setIsActive(true);
    setIsFSModalOpen(true);
  };

  const openEditFSModal = (fs: AdminFlashSale) => {
    setSelectedFS(fs);
    setTitle(fs.name);
    setDescription(fs.description || '');
    setStartsAt(formatDateTimeLocal(fs.starts_at));
    setEndsAt(formatDateTimeLocal(fs.ends_at));
    setIsActive(fs.is_active === 1);
    setIsFSModalOpen(true);
  };

  const handleSaveFS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startsAt || !endsAt) {
      toast.error('Harap isi semua field wajib');
      return;
    }
    if (new Date(startsAt) >= new Date(endsAt)) {
      toast.error('Waktu mulai harus lebih awal dari waktu berakhir');
      return;
    }

    setIsSavingFS(true);
    const payload = {
      title,
      description: description || null,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      is_active: isActive
    };

    try {
      if (selectedFS) {
        await updateFlashSale(selectedFS.id, payload);
        toast.success('Event Flash Sale berhasil diperbarui');
      } else {
        await createFlashSale(payload);
        toast.success('Event Flash Sale berhasil dibuat');
      }
      setIsFSModalOpen(false);
      fetchFlashSales();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Gagal menyimpan flash sale');
    } finally {
      setIsSavingFS(false);
    }
  };

  const handleDeleteFS = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event flash sale ini?')) return;
    try {
      await deleteFlashSale(id);
      toast.success('Event Flash Sale berhasil dihapus');
      if (activeFSForItems?.id === id) {
        setActiveFSForItems(null);
      }
      fetchFlashSales();
    } catch {
      toast.error('Gagal menghapus event flash sale');
    }
  };

  // Items Management API Calls
  const handleOpenItemModal = async () => {
    setIsItemModalOpen(true);
    setSelectedProductId('');
    setSelectedVariantId('');
    setSalePrice('');
    setQuota('10');
    setVariantsList([]);
    setIsLoadingProducts(true);

    try {
      const res = await getAdminProducts({ limit: 100, is_active: 'true' });
      setProductsList(res.data || []);
    } catch {
      toast.error('Gagal memuat daftar produk');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleProductChange = async (productId: string) => {
    setSelectedProductId(productId);
    setSelectedVariantId('');
    setSalePrice('');
    setVariantsList([]);
    if (!productId) return;

    setIsLoadingVariants(true);
    try {
      const res = await getAdminProductDetail(Number(productId));
      setVariantsList(res.variants || []);
    } catch {
      toast.error('Gagal memuat detail varian produk');
    } finally {
      setIsLoadingVariants(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFSForItems) return;
    if (!selectedVariantId || !salePrice || !quota) {
      toast.error('Harap isi semua field item');
      return;
    }

    setIsSavingItem(true);
    const payload = {
      variant_id: Number(selectedVariantId),
      sale_price: Number(salePrice),
      quota: Number(quota)
    };

    try {
      await addFlashSaleItem(activeFSForItems.id, payload);
      toast.success('Item berhasil ditambahkan');
      setIsItemModalOpen(false);
      fetchFlashSales();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Gagal menambahkan item');
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!activeFSForItems) return;
    if (!confirm('Apakah Anda yakin ingin menghapus item ini dari flash sale?')) return;
    try {
      await deleteFlashSaleItem(activeFSForItems.id, itemId);
      toast.success('Item berhasil dihapus');
      fetchFlashSales();
    } catch {
      toast.error('Gagal menghapus item');
    }
  };

  const filteredSales = flashSales.filter(
    (fs) =>
      fs.name.toLowerCase().includes(search.toLowerCase()) ||
      (fs.description && fs.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Manajemen Flash Sale</h1>
          <p className="text-gray-500 mt-1">Buat, jadwalkan, dan kelola event diskon kilat.</p>
        </div>
        <button
          onClick={openCreateFSModal}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm rounded-xl font-bold"
        >
          <Plus className="h-4 w-4" />
          Buat Flash Sale
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Side: Events List */}
        <div className={`${activeFSForItems ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
          <div className="card border border-gray-100 bg-white rounded-2xl shadow-sm">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari event flash sale..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-9 py-2 text-sm"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-16 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                Tidak ada event flash sale ditemukan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50 text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Nama Event</th>
                      <th className="px-6 py-4 font-semibold">Jadwal</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSales.map((fs) => {
                      const status = getStatusLabel(fs);
                      const isSelected = activeFSForItems?.id === fs.id;
                      return (
                        <tr
                          key={fs.id}
                          className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-primary-50/30' : ''
                          }`}
                          onClick={() => setActiveFSForItems(fs)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Zap className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary-600 animate-pulse' : 'text-orange-500'}`} />
                              <div>
                                <span className="font-bold text-gray-900 block">{fs.name}</span>
                                <span className="text-[10px] text-gray-400 font-bold block">{fs.items?.length || 0} Produk Varian</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-0.5 text-xs text-gray-600 font-semibold">
                              <div>Mulai: {new Date(fs.starts_at).toLocaleString('id-ID')}</div>
                              <div>Selesai: {new Date(fs.ends_at).toLocaleString('id-ID')}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`badge ${status.className}`}>{status.label}</span>
                          </td>
                          <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => openEditFSModal(fs)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                title="Edit Event"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFS(fs.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Hapus Event"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setActiveFSForItems(fs)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                title="Kelola Item"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Items Manager for Active Event */}
        {activeFSForItems && (
          <div className="lg:col-span-6 space-y-4">
            <div className="card border border-primary-100 bg-white rounded-2xl shadow-md p-6 space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-primary-100 text-primary-700 font-bold px-2 py-0.5 rounded-full uppercase">
                      Event Item Manager
                    </span>
                  </div>
                  <h2 className="text-lg font-black font-heading text-gray-900 mt-1">{activeFSForItems.name}</h2>
                  <p className="text-xs text-gray-400 font-semibold">
                    Atur varian produk diskon kilat dalam event ini.
                  </p>
                </div>
                <button
                  onClick={() => setActiveFSForItems(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex justify-between items-center gap-4">
                <span className="text-xs text-gray-500 font-bold">
                  Daftar Varian ({activeFSForItems.items?.length || 0})
                </span>
                <button
                  onClick={handleOpenItemModal}
                  className="btn btn-primary py-1.5 px-3 flex items-center gap-1 text-xs font-bold rounded-lg"
                >
                  <Plus className="h-3.5 w-3.5" /> Tambah Varian
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {!activeFSForItems.items || activeFSForItems.items.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl text-xs">
                    Belum ada varian produk yang dimasukkan ke flash sale ini.
                  </div>
                ) : (
                  activeFSForItems.items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-100 rounded-xl p-3 flex justify-between items-center gap-3 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-100 bg-white overflow-hidden flex items-center justify-center shrink-0">
                          {item.primary_image ? (
                            <Image
                              src={
                                item.primary_image.startsWith('http')
                                  ? item.primary_image
                                  : `${BACKEND_URL}${item.primary_image}`
                              }
                              alt={item.product_name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-xs block line-clamp-1">
                            {item.product_name}
                          </span>
                          <span className="text-[10px] text-gray-500 block font-semibold">
                            SKU: {item.sku} - {item.variant_name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-red-500 line-through">
                              {formatCurrency(item.original_price)}
                            </span>
                            <span className="text-xs font-bold text-primary-600">
                              {formatCurrency(item.sale_price)}
                            </span>
                            <span className="text-[8px] font-black bg-red-100 text-red-700 px-1 rounded">
                              -{Math.round(item.discount_percent)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right text-xs">
                          <span className="text-gray-400 font-bold block text-[10px]">Kuota</span>
                          <span className="font-bold text-gray-900">
                            {item.sold_count} / {item.quota}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Flash Sale Create/Edit Modal */}
      {isFSModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-lg font-black font-heading text-gray-900">
                {selectedFS ? 'Edit Event Flash Sale' : 'Buat Event Flash Sale Baru'}
              </h2>
              <button onClick={() => setIsFSModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveFS} className="space-y-4 text-sm font-body">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Nama Event *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="cth. Flash Sale Gajian Merdeka"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Keterangan / Deskripsi</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="Deskripsi singkat event promo..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Jadwal Mulai *</label>
                <input
                  type="datetime-local"
                  required
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className="input py-2 text-sm font-semibold text-gray-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Jadwal Selesai *</label>
                <input
                  type="datetime-local"
                  required
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className="input py-2 text-sm font-semibold text-gray-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="fs-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300 cursor-pointer"
                />
                <label htmlFor="fs-active" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                  Aktifkan Event Ini
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFSModalOpen(false)}
                  className="btn btn-outline py-2 px-4 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingFS}
                  className="btn btn-primary py-2 px-5 flex items-center gap-2 text-xs font-bold rounded-xl shadow-md"
                >
                  {isSavingFS ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flash Sale Item Add Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-lg font-black font-heading text-gray-900">
                Tambah Varian Diskon Flash Sale
              </h2>
              <button onClick={() => setIsItemModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-sm font-body">
              {/* Product selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Pilih Produk induk *</label>
                {isLoadingProducts ? (
                  <div className="flex items-center gap-2 py-2 text-xs text-gray-400 font-semibold">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-500" /> Memuat produk...
                  </div>
                ) : (
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="input py-2 text-sm w-full"
                    required
                  >
                    <option value="">-- Pilih Produk --</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Variant selector */}
              {selectedProductId && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Pilih Varian *</label>
                  {isLoadingVariants ? (
                    <div className="flex items-center gap-2 py-2 text-xs text-gray-400 font-semibold">
                      <Loader2 className="h-4 w-4 animate-spin text-primary-500" /> Memuat varian...
                    </div>
                  ) : variantsList.length === 0 ? (
                    <div className="text-xs text-orange-600 font-bold py-1">
                      Produk ini tidak memiliki varian aktif.
                    </div>
                  ) : (
                    <select
                      value={selectedVariantId}
                      onChange={(e) => {
                        setSelectedVariantId(e.target.value);
                        const v = variantsList.find((x) => String(x.id) === e.target.value);
                        if (v) setSalePrice(String(v.price));
                      }}
                      className="input py-2 text-sm w-full font-mono"
                      required
                    >
                      <option value="">-- Pilih Varian --</option>
                      {variantsList.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.sku} - {v.name} ({formatCurrency(v.price)})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {selectedVariantId && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Harga Flash Sale *</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        className="input py-2 text-sm font-bold text-primary-600"
                        placeholder="Harga promo"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Kuota Promo *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={quota}
                        onChange={(e) => setQuota(e.target.value)}
                        className="input py-2 text-sm font-semibold"
                        placeholder="Batas kuota"
                      />
                    </div>
                  </div>

                  {variantsList.find((v) => String(v.id) === selectedVariantId) && (
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Harga Asli:</span>
                        <span className="font-semibold text-gray-700">
                          {formatCurrency(variantsList.find((v) => String(v.id) === selectedVariantId)!.price)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Potongan Harga:</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(
                            variantsList.find((v) => String(v.id) === selectedVariantId)!.price - Number(salePrice)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200/50 pt-1 mt-1 font-bold">
                        <span className="text-gray-500">Diskon Persen:</span>
                        <span className="text-primary-600">
                          {Math.round(
                            ((variantsList.find((v) => String(v.id) === selectedVariantId)!.price - Number(salePrice)) /
                              variantsList.find((v) => String(v.id) === selectedVariantId)!.price) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="btn btn-outline py-2 px-4 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingItem || !selectedVariantId}
                  className="btn btn-primary py-2 px-5 flex items-center gap-2 text-xs font-bold rounded-xl shadow-md"
                >
                  {isSavingItem ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Tambahkan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
