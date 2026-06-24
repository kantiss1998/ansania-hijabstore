'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Mail, Phone, ShoppingBag, Eye, Ban, CheckCircle, X, Calendar, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getAdminCustomers, getAdminCustomerDetail, toggleCustomerStatus, updateCustomerLoyalty } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface Address {
  id: number;
  label: string;
  recipient_name: string;
  phone: string;
  province_name: string;
  city_name: string;
  district: string;
  postal_code: string;
  full_address: string;
  is_default: boolean;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  addresses?: Address[];
  totalOrders?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  loyaltyTier?: string;
}

export default function AdminPelangganPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Detail Modal state
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customerDetail, setCustomerDetail] = useState<Customer | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  
  // Loyalty edit states
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loyaltyTier, setLoyaltyTier] = useState('BRONZE');
  const [isSavingLoyalty, setIsSavingLoyalty] = useState(false);

  useEffect(() => {
    if (customerDetail) {
      setLoyaltyPoints(customerDetail.loyaltyPoints || 0);
      setLoyaltyTier(customerDetail.loyaltyTier || 'BRONZE');
    }
  }, [customerDetail]);
  
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminCustomers({ page, limit, search, sort: sortBy });
      const payload = data.data || data;
      setCustomers(payload.items || []);
      setTotal(payload.total || 0);
    } catch (error) {
      console.error('Gagal memuat pelanggan:', error);
      toast.error('Gagal memuat daftar pelanggan');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, sortBy]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleToggleStatus = async (id: number, currentActive: boolean) => {
    const actionText = currentActive ? 'menonaktifkan' : 'mengaktifkan';
    if (!confirm(`Apakah Anda yakin ingin ${actionText} pelanggan ini?`)) return;

    try {
      await toggleCustomerStatus(id, !currentActive);
      toast.success(`Berhasil ${actionText} akun pelanggan`);
      fetchCustomers();
      if (customerDetail && customerDetail.id === id) {
        handleViewDetail(id); // Refresh detail modal
      }
    } catch {
      toast.error(`Gagal ${actionText} akun pelanggan`);
    }
  };

  const handleViewDetail = async (id: number) => {
    setSelectedCustomerId(id);
    setIsDetailLoading(true);
    try {
      const detail = await getAdminCustomerDetail(id);
      setCustomerDetail(detail);
    } catch {
      toast.error('Gagal memuat detail pelanggan');
      setSelectedCustomerId(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

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
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input py-2 text-sm min-w-[150px]"
            >
              <option value="">Urutkan: Terbaru</option>
              <option value="name">Nama (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Pelanggan</th>
                <th className="px-6 py-4 font-semibold">Kontak</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Bergabung Pada</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    Memuat data pelanggan...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    Tidak ada pelanggan terdaftar.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">ID: {customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-gray-600 flex items-center gap-2 text-xs">
                          <Mail className="w-3.5 h-3.5" /> {customer.email}
                        </p>
                        {customer.phone && (
                          <p className="text-gray-600 flex items-center gap-2 text-xs">
                            <Phone className="w-3.5 h-3.5" /> {customer.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${customer.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {customer.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDetail(customer.id)}
                        className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors font-semibold inline-flex items-center gap-1 text-xs"
                      >
                        <Eye className="h-4 w-4" /> Detail
                      </button>
                      <button
                        onClick={() => handleToggleStatus(customer.id, customer.isActive)}
                        className={`p-1.5 rounded-lg transition-colors font-semibold inline-flex items-center gap-1 text-xs ${
                          customer.isActive 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {customer.isActive ? (
                          <>
                            <Ban className="h-4 w-4" /> Suspend
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" /> Aktifkan
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <span className="text-gray-500 font-semibold">
              Halaman {page} dari {totalPages} (Total {total} Pelanggan)
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

      {/* Detail Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black font-heading text-gray-900">Detail Pelanggan</h3>
                <button
                  onClick={() => setSelectedCustomerId(null)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {isDetailLoading ? (
                <p className="text-center text-gray-400 py-10">Memuat detail...</p>
              ) : customerDetail ? (
                <div className="space-y-6">
                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-2xl shadow-md">
                      {customerDetail.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {customerDetail.name}
                        <span className="text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                          {customerDetail.loyaltyTier || 'BRONZE'}
                        </span>
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">ID Pelanggan: {customerDetail.id}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Bergabung: {customerDetail.createdAt ? new Date(customerDetail.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="divider"></div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500">Total Transaksi</p>
                      <p className="text-lg font-black font-heading text-gray-900 mt-1 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-primary-500" />
                        {customerDetail.totalOrders} Pesanan
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500">Total Belanja</p>
                      <p className="text-lg font-black font-heading text-green-600 mt-1">
                        {formatCurrency(customerDetail.totalSpent || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Loyalty Program Editor */}
                  <div className="space-y-3 bg-primary-50/10 p-4 rounded-xl border border-primary-100/65">
                    <h5 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      ⭐ Loyalty Program
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Poin</label>
                        <input
                          type="number"
                          min={0}
                          value={loyaltyPoints}
                          onChange={(e) => setLoyaltyPoints(Number(e.target.value))}
                          className="input w-full py-1.5 px-3 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Tier</label>
                        <select
                          value={loyaltyTier}
                          onChange={(e) => setLoyaltyTier(e.target.value)}
                          className="input w-full py-1.5 px-3 text-xs font-bold"
                        >
                          <option value="BRONZE">BRONZE</option>
                          <option value="SILVER">SILVER</option>
                          <option value="GOLD">GOLD</option>
                          <option value="PLATINUM">PLATINUM</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isSavingLoyalty}
                      onClick={async () => {
                        setIsSavingLoyalty(true);
                        try {
                          await updateCustomerLoyalty(customerDetail.id, loyaltyPoints, loyaltyTier);
                          toast.success('Loyalty points & tier berhasil disimpan');
                          handleViewDetail(customerDetail.id);
                          fetchCustomers();
                        } catch {
                          toast.error('Gagal memperbarui loyalty program');
                        } finally {
                          setIsSavingLoyalty(false);
                        }
                      }}
                      className="w-full btn-primary !py-2 text-xs font-bold rounded-lg shadow-sm"
                    >
                      {isSavingLoyalty ? 'Menyimpan...' : 'Simpan Loyalty'}
                    </button>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-gray-900 text-sm">Informasi Kontak</h5>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" /> {customerDetail.email}
                      </p>
                      {customerDetail.phone && (
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" /> {customerDetail.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-gray-900 text-sm">Daftar Alamat</h5>
                    {customerDetail.addresses && customerDetail.addresses.length > 0 ? (
                      <div className="space-y-3">
                        {customerDetail.addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`p-4 rounded-xl border text-sm relative ${
                              address.is_default 
                                ? 'bg-primary-50/20 border-primary-100' 
                                : 'bg-white border-gray-100'
                            }`}
                          >
                            {address.is_default && (
                              <span className="absolute top-3 right-3 text-[10px] bg-primary-500 text-white font-bold px-2 py-0.5 rounded-full">
                                Utama
                              </span>
                            )}
                            <p className="font-bold text-gray-900 flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {address.label}
                            </p>
                            <p className="text-gray-500 text-xs mt-1.5">Penerima: {address.recipient_name} ({address.phone})</p>
                            <p className="text-gray-700 mt-2 text-xs leading-relaxed">{address.full_address}</p>
                            <p className="text-gray-500 text-[11px] mt-1.5">
                              {address.district}, {address.city_name}, {address.province_name} - {address.postal_code}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Pelanggan belum menambahkan alamat.</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Action status inside drawer */}
            {customerDetail && (
              <div className="pt-4 border-t border-gray-100 mt-6">
                <button
                  onClick={() => handleToggleStatus(customerDetail.id, customerDetail.isActive)}
                  className={`w-full btn py-3 text-sm flex items-center justify-center gap-2 ${
                    customerDetail.isActive 
                      ? 'btn-danger' 
                      : 'btn-primary'
                  }`}
                >
                  {customerDetail.isActive ? (
                    <>
                      <Ban className="w-4 h-4" /> Suspend Akun Pelanggan
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Aktifkan Akun Pelanggan
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
