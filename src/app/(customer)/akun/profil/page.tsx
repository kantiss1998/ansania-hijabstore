'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { getUserProfile, updateUserProfile, deleteAccount, changePassword } from '@/services/api/users';
import { Loader2, Save, Award, ShoppingBag, Heart, Ticket, Calendar, Shirt, Trash2, AlertTriangle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { AccountPageHeader } from '@/components/customer/AccountPageHeader';
import type { User } from '@/types/user.types';

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'female' as 'female' | 'male' | 'other',
    birthDate: '',
    stylePreference: '',
    sizePreference: '',
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      toast.error('Semua kolom password harus diisi');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('Konfirmasi password baru tidak cocok');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });
      toast.success('Password berhasil diubah');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error: unknown) {
      const err = error as ApiErrorResponse;
      toast.error(err.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success('Akun Anda berhasil dihapus.');
      logout();
      router.push('/');
    } catch (error: unknown) {
      const err = error as ApiErrorResponse;
      toast.error(err.response?.data?.message || 'Gagal menghapus akun');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: (data.gender || 'female') as 'female' | 'male' | 'other',
          birthDate: data.birthDate || '',
          stylePreference: data.stylePreference || '',
          sizePreference: data.sizePreference || '',
        });
      } catch {
        // Fallback ke data user dari store jika API gagal
        if (user) {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            gender: (user.gender || 'female') as 'female' | 'male' | 'other',
            birthDate: user.birthDate || '',
            stylePreference: user.stylePreference || '',
            sizePreference: user.sizePreference || '',
          });
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        birthDate: formData.birthDate,
        stylePreference: formData.stylePreference,
        sizePreference: formData.sizePreference,
      });

      // Update Zustand store secara lokal agar reactive ke seluruh aplikasi (misal Sidebar)
      if (user) {
        const updatedUser: User = {
          ...user,
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          birthDate: formData.birthDate,
          stylePreference: formData.stylePreference,
          sizePreference: formData.sizePreference,
        };
        useAuthStore.setState({ user: updatedUser });
      }

      toast.success('Profil berhasil diperbarui');
    } catch (error: unknown) {
      const err = error as ApiErrorResponse;
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setIsLoading(false);
    }
  };

  const genders = [
    { value: 'female', label: 'Perempuan' },
    { value: 'male', label: 'Laki-Laki' },
    { value: 'other', label: 'Lainnya' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const styles = ['Hijab Syar\'i', 'Tunik Casual', 'Gamis Elegant', 'Modest Workwear', 'Minimalist Basic'];

  return (
    <div className="space-y-8">
      <AccountPageHeader
        title="Profil saya"
        description="Data diri, member card, dan preferensi gaya."
      />

      <div className="relative overflow-hidden bg-dark text-white rounded-3xl p-6 border border-primary-500/20 shadow-[0_24px_60px_-40px_rgba(245,45,110,0.55)] noise-overlay">
        {/* Background Decorative Patterns */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#F52D6E]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
          {/* Card Top */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] font-display font-bold uppercase tracking-[0.2em] text-[#F52D6E]">Ansania Digital Member Card</p>
              <h3 className="font-display font-black uppercase text-xl tracking-wider mt-1">{formData.name || 'Pengguna'}</h3>
            </div>
            <div className="rounded-full bg-accent-lime/90 px-3 py-1 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-dark" />
              <span className="text-[9px] font-display font-black uppercase tracking-wider text-dark">{user?.loyaltyTier ?? 'Member'}</span>
            </div>
          </div>

          {/* Card Middle & Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-end mb-1.5">
              <div>
                <p className="text-[9px] font-display font-bold uppercase tracking-wider text-gray-400">Total Poin Belanja</p>
                <p className="text-2xl font-display font-black tracking-wider text-white mt-0.5">
                  {user?.loyaltyPoints ?? 0}{' '}
                  <span className="text-xs font-bold font-body text-[#F52D6E]">PTS</span>
                </p>
              </div>
              <div className="text-right text-[9px] font-display font-bold uppercase tracking-wider text-gray-400">
                <span>250 PTS lagi menuju PLATINUM</span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/akun/pesanan"
          className="bento-card p-4 flex flex-col items-center justify-center text-center !shadow-none group"
        >
          <ShoppingBag className="h-5 w-5 text-gray-400 group-hover:text-[#0A0A0A] transition-colors mb-2" />
          <span className="text-lg font-display font-black text-[#0A0A0A]">{user?.orderCount ?? 0}</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-wider text-gray-400 mt-0.5">Total Pesanan</span>
        </Link>
        <Link
          href="/akun/wishlist"
          className="bento-card p-4 flex flex-col items-center justify-center text-center !shadow-none group"
        >
          <Heart className="h-5 w-5 text-gray-400 group-hover:text-[#F52D6E] transition-colors mb-2" />
          <span className="text-lg font-display font-black text-[#0A0A0A]">{user?.wishlistCount ?? 0}</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-wider text-gray-400 mt-0.5">Wishlist</span>
        </Link>
        <div className="bento-card p-4 flex flex-col items-center justify-center text-center !shadow-none">
          <Ticket className="h-5 w-5 text-[#F52D6E] mb-2 animate-pulse" />
          <span className="text-lg font-display font-black text-[#0A0A0A]">{user?.voucherCount ?? 0}</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-wider text-gray-400 mt-0.5">Voucher Aktif</span>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Info */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-black/[0.04] pb-2">
            <Calendar className="h-4 w-4 text-[#F52D6E]" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">Informasi Personal</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nomor WhatsApp</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Alamat Email</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/[0.04] bg-gray-50/50 text-gray-400 cursor-not-allowed"
                title="Email tidak dapat diubah"
              />
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Tanggal Lahir</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-2">Jenis Kelamin</label>
            <div className="flex gap-2.5">
              {genders.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g.value as 'female' | 'male' | 'other' })}
                  className={cn(
                    "flex-1 py-2.5 px-4 text-xs font-display font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer text-center active:scale-[0.98]",
                    formData.gender === g.value
                      ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                      : "border-black/10 text-gray-500 hover:border-black/20 bg-white"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Fashion Preferences */}
        <div className="space-y-5 pt-4">
          <div className="flex items-center gap-2 border-b border-black/[0.04] pb-2">
            <Shirt className="h-4 w-4 text-[#F52D6E]" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">Preferensi Fashion</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-2">Ukuran Pakaian</label>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, sizePreference: s })}
                    className={cn(
                      "py-2.5 rounded-xl border text-[10px] font-display font-bold uppercase transition-all cursor-pointer text-center active:scale-90",
                      formData.sizePreference === s
                        ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                        : "border-black/10 text-gray-500 hover:border-black/20 bg-white"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-2">Style Favorit</label>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFormData({ ...formData, stylePreference: style })}
                    className={cn(
                      "py-2 px-3.5 rounded-full border text-[9px] font-display font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95",
                      formData.stylePreference === style
                        ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                        : "border-black/10 text-gray-500 hover:border-black/25 bg-white"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-pill-brand h-12 px-8 gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* Section 3: Change Password */}
      <div className="pt-6 border-t border-black/[0.04] space-y-5">
        <div className="flex items-center gap-2 pb-2">
          <Lock className="h-4 w-4 text-[#F52D6E]" />
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">Ubah Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="grid sm:grid-cols-3 gap-5 items-end">
          <div>
            <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password Saat Ini</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password Baru</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div>
            <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Konfirmasi Password Baru</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                className="flex-1 px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                placeholder="Ulangi password baru"
              />
              <button
                type="submit"
                disabled={isChangingPassword}
                className="h-10 px-5 text-[10px] font-display font-bold uppercase tracking-wider bg-dark hover:bg-primary-600 text-white rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isChangingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Ganti'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="pt-8 border-t border-red-150 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-red-650">Danger Zone</h3>
        </div>
        
        <div className="bento-card border-red-150 bg-red-50/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 animate-slide-up">
          <div className="space-y-1 max-w-xl text-left">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">Hapus Akun Permanen</h4>
            <p className="text-[11px] text-gray-505 font-body leading-relaxed">
              Tindakan ini akan menganonimkan nama dan email Anda agar tidak dapat diidentifikasi secara personal, 
              namun tetap menjaga data transaksi masa lalu Anda demi kepentingan audit. Email Anda akan dilepaskan agar dapat didaftarkan kembali.
            </p>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-display font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-all active:scale-95"
          >
            <Trash2 className="h-4 w-4" />
            Hapus Akun
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-black/[0.05] animate-scale-up">
            <h3 className="font-display font-black uppercase text-sm tracking-wider text-[#0A0A0A] mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" /> Konfirmasi Hapus Akun
            </h3>
            <p className="text-xs text-gray-500 font-body mb-5 leading-relaxed">
              Apakah Anda benar-benar yakin ingin menghapus akun Anda? Seluruh token login Anda akan dicabut dan Anda akan segera dikeluarkan dari sistem. Tindakan ini permanen.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 h-10 rounded-xl text-[10px] font-display font-bold uppercase tracking-wider border border-black/10 text-gray-500 hover:border-black/20 cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-6 h-10 rounded-xl text-[10px] font-display font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="h-3 w-3 animate-spin" />}
                Ya, Hapus Akun Saya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
