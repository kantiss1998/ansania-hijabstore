'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { getUserProfile, updateUserProfile } from '@/services/api/users';
import { Loader2, Save, Award, ShoppingBag, Heart, Ticket, Calendar, Shirt, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { AccountPageHeader } from '@/components/customer/AccountPageHeader';

export default function ProfilePage() {
  const { user, checkAuth } = useAuthStore();
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
      } catch (error) {
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
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        birthDate: formData.birthDate,
        stylePreference: formData.stylePreference,
        sizePreference: formData.sizePreference,
      };
      useAuthStore.setState({ user: updatedUser as any });

      toast.success('Profil berhasil diperbarui');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
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
              <span className="text-[9px] font-display font-black uppercase tracking-wider text-dark">{user?.loyaltyTier || 'Gold'}</span>
            </div>
          </div>

          {/* Card Middle & Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-end mb-1.5">
              <div>
                <p className="text-[9px] font-display font-bold uppercase tracking-wider text-gray-400">Total Poin Belanja</p>
                <p className="text-2xl font-display font-black tracking-wider text-white mt-0.5">
                  {user?.loyaltyPoints || '1,250'}{' '}
                  <span className="text-xs font-bold font-body text-[#F52D6E]">PTS</span>
                </p>
              </div>
              <div className="text-right text-[9px] font-display font-bold uppercase tracking-wider text-gray-400">
                <span>250 PTS lagi menuju PLATINUM</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#F52D6E] to-pink-400 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/akun/pesanan"
          className="bento-card p-4 flex flex-col items-center justify-center text-center !shadow-none group"
        >
          <ShoppingBag className="h-5 w-5 text-gray-400 group-hover:text-[#0A0A0A] transition-colors mb-2" />
          <span className="text-lg font-display font-black text-[#0A0A0A]">{user?.orderCount || '12'}</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-wider text-gray-400 mt-0.5">Total Pesanan</span>
        </Link>
        <Link
          href="/akun/wishlist"
          className="bento-card p-4 flex flex-col items-center justify-center text-center !shadow-none group"
        >
          <Heart className="h-5 w-5 text-gray-400 group-hover:text-[#F52D6E] transition-colors mb-2" />
          <span className="text-lg font-display font-black text-[#0A0A0A]">{user?.wishlistCount || '3'}</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-wider text-gray-400 mt-0.5">Wishlist</span>
        </Link>
        <div className="bento-card p-4 flex flex-col items-center justify-center text-center !shadow-none">
          <Ticket className="h-5 w-5 text-[#F52D6E] mb-2 animate-pulse" />
          <span className="text-lg font-display font-black text-[#0A0A0A]">{user?.voucherCount || '4'}</span>
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
                  onClick={() => setFormData({ ...formData, gender: g.value as any })}
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
    </div>
  );
}
