'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Ticket, Loader2, X, Save } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getAdminVouchers, createVoucher, updateVoucher, deleteVoucher } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface AdminVoucher {
  id: number;
  code: string;
  description?: string | null;
  discount_type: 'percentage' | 'fixed';
  value: number;
  max_discount?: number | null;
  min_purchase: number;
  used_count: number;
  usage_limit: number | null;
  usage_per_user: number;
  starts_at?: string | null;
  expires_at: string | null;
  is_active: number;
}

export default function AdminVoucherPage() {
  const [vouchers, setVouchers] = useState<AdminVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<AdminVoucher | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('0');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [minPurchase, setMinPurchase] = useState('0');
  const [usageLimit, setUsageLimit] = useState('');
  const [usagePerUser, setUsagePerUser] = useState('1');
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminVouchers();
      setVouchers(data || []);
    } catch {
      toast.error('Gagal memuat daftar voucher');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const openCreateModal = () => {
    setSelectedVoucher(null);
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setValue('0');
    setMaxDiscount('');
    setMinPurchase('0');
    setUsageLimit('');
    setUsagePerUser('1');
    setStartsAt('');
    setExpiresAt('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (v: AdminVoucher) => {
    setSelectedVoucher(v);
    setCode(v.code);
    setDescription(v.description || '');
    setDiscountType(v.discount_type);
    setValue(String(v.value));
    setMaxDiscount(v.max_discount ? String(v.max_discount) : '');
    setMinPurchase(String(v.min_purchase || 0));
    setUsageLimit(v.usage_limit ? String(v.usage_limit) : '');
    setUsagePerUser(String(v.usage_per_user || 1));
    setStartsAt(v.starts_at ? new Date(v.starts_at).toISOString().split('T')[0] : '');
    setExpiresAt(v.expires_at ? new Date(v.expires_at).toISOString().split('T')[0] : '');
    setIsActive(v.is_active === 1);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast.error('Kode voucher wajib diisi');
      return;
    }
    if (Number(value) <= 0) {
      toast.error('Nilai diskon harus lebih besar dari 0');
      return;
    }

    setIsSaving(true);
    const payload: Record<string, string | number | boolean | null> = {
      code: code.toUpperCase().trim(),
      description: description || null,
      discount_type: discountType,
      value: Number(value),
      max_discount: maxDiscount ? Number(maxDiscount) : null,
      min_purchase: Number(minPurchase),
      usage_limit: usageLimit ? Number(usageLimit) : null,
      usage_per_user: Number(usagePerUser),
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      is_active: isActive
    };

    try {
      if (selectedVoucher) {
        await updateVoucher(selectedVoucher.id, payload);
        toast.success('Voucher berhasil diperbarui');
      } else {
        await createVoucher(payload);
        toast.success('Voucher berhasil dibuat');
      }
      setIsModalOpen(false);
      fetchVouchers();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Gagal menyimpan voucher');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus voucher ini?')) return;
    try {
      await deleteVoucher(id);
      toast.success('Voucher berhasil dihapus');
      fetchVouchers();
    } catch {
      toast.error('Gagal menghapus voucher');
    }
  };

  const filteredVouchers = vouchers.filter((v) =>
    v.code.toLowerCase().includes(search.toLowerCase()) ||
    (v.description && v.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Voucher & Promo</h1>
          <p className="text-gray-500 mt-1">Buat dan kelola kode voucher diskon.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm rounded-xl font-bold"
        >
          <Plus className="h-4 w-4" />
          Buat Voucher
        </button>
      </div>

      <div className="card border border-gray-100 bg-white rounded-2xl shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kode voucher..."
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
        ) : filteredVouchers.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-body text-sm">
            Tidak ada voucher ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Kode Voucher</th>
                  <th className="px-6 py-4 font-semibold">Tipe Diskon</th>
                  <th className="px-6 py-4 font-semibold">Nilai Diskon</th>
                  <th className="px-6 py-4 font-semibold">Min. Belanja</th>
                  <th className="px-6 py-4 font-semibold">Kuota Terpakai</th>
                  <th className="px-6 py-4 font-semibold">Berakhir Pada</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-body">
                {filteredVouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary-500" />
                        <span className="font-bold text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {voucher.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-semibold text-xs capitalize">
                      {voucher.discount_type === 'percentage' ? 'Persentase' : 'Nominal Tetap'}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary-600">
                      {voucher.discount_type === 'percentage' ? `${voucher.value}%` : formatCurrency(voucher.value)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">{formatCurrency(voucher.min_purchase)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className={voucher.usage_limit && voucher.used_count >= voucher.usage_limit ? 'text-red-600 font-bold' : 'font-semibold'}>
                        {voucher.used_count} / {voucher.usage_limit || '∞'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">
                      {voucher.expires_at ? new Date(voucher.expires_at).toLocaleDateString('id-ID') : 'Selamanya'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${voucher.is_active === 1 ? 'badge-success' : 'badge-danger'}`}>
                        {voucher.is_active === 1 ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(voucher)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(voucher.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus"
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
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-lg font-black font-heading text-gray-900">
                {selectedVoucher ? 'Edit Voucher' : 'Buat Voucher Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm font-body">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Kode Voucher *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="input py-2 text-sm font-mono uppercase"
                    placeholder="cth. PROMO10"
                    disabled={!!selectedVoucher}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Tipe Diskon *</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="input py-2 text-sm w-full"
                  >
                    <option value="percentage">Persentase (%)</option>
                    <option value="fixed">Nominal Tetap (Rp)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">
                    {discountType === 'percentage' ? 'Persentase Diskon (%) *' : 'Nominal Diskon (Rp) *'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="input py-2 text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Maks. Diskon (Rp, Opsional)</label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="input py-2 text-sm font-semibold text-gray-700"
                    disabled={discountType !== 'percentage'}
                    placeholder={discountType !== 'percentage' ? 'Hanya untuk persentase' : 'cth. 50000'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Minimal Pembelian (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value)}
                    className="input py-2 text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Kuota Batas Penggunaan (Opsional)</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="input py-2 text-sm font-semibold"
                    placeholder="Kosongkan jika tak terbatas"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Maks. Penggunaan Per User</label>
                  <input
                    type="number"
                    min={1}
                    value={usagePerUser}
                    onChange={(e) => setUsagePerUser(e.target.value)}
                    className="input py-2 text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Status Aktif</label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="voucher-active"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300 cursor-pointer"
                    />
                    <label htmlFor="voucher-active" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                      Aktifkan Voucher
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Tanggal Mulai (Opsional)</label>
                  <input
                    type="date"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="input py-2 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Tanggal Berakhir (Opsional)</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="input py-2 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Deskripsi Voucher</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input py-2 text-sm font-body"
                  placeholder="Detail / deskripsi kegunaan voucher..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline py-2 px-4 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary py-2 px-5 flex items-center gap-2 text-xs font-bold rounded-xl shadow-md"
                >
                  {isSaving ? (
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
    </div>
  );
}
