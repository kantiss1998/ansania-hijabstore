'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Sparkles, Phone, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import GoogleSignInButton from '@/components/shared/GoogleSignInButton';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast.error('Semua kolom harus diisi');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    const success = await register(formData);
    if (success) {
      toast.success('Pendaftaran berhasil!');
      router.push(ROUTES.HOME); // Nanti ke dashboard user jika sudah ada
    }
  };





  return (
    <div className="min-h-screen flex">
      {/* Left side — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white order-2 lg:order-1">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center">
            <Link href={ROUTES.HOME}>
              <Image
                src="/Ansania.png"
                alt="Ansania Logo"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-[#0A0A0A]">
              Buat Akun Baru
            </h2>
            <p className="mt-2 text-xs text-gray-400 font-body">
              Sudah punya akun?{' '}
              <Link href={ROUTES.AUTH.LOGIN} className="text-[#F52D6E] font-display font-bold uppercase tracking-wider hover:text-[#0A0A0A] transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-3">
            <GoogleSignInButton label="Google" />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/[0.06]" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">atau daftar dengan email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-2.5 pl-11 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nomor WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-2.5 pl-11 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-2.5 pl-11 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-2.5 pl-11 pr-11 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 py-1 font-body">
              Dengan mendaftar, Anda menyetujui{' '}
              <Link href="#" className="text-[#F52D6E] font-display font-bold uppercase hover:underline">Syarat & Ketentuan</Link>
              {' '}serta{' '}
              <Link href="#" className="text-[#F52D6E] font-display font-bold uppercase hover:underline">Kebijakan Privasi</Link>
              {' '}kami.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white font-display font-bold uppercase tracking-widest text-[11px] rounded-xl flex justify-center items-center gap-2 mt-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Daftar Sekarang
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0A0A0A] p-12 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#F52D6E]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-right flex justify-end">
          <Link href={ROUTES.HOME}>
            <Image
              src="/Ansania.png"
              alt="Ansania Logo"
              width={120}
              height={32}
              className="h-8 w-auto object-contain brightness-0 invert"
              priority
            />
          </Link>
        </div>

        <div className="relative z-10">
          <div className="bg-white border border-black/[0.06] p-8 rounded-2xl max-w-sm ml-auto relative">
            <div className="absolute -top-5 -left-5 bg-[#F52D6E] text-white p-3.5 rounded-xl shadow-lg transform -rotate-6">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-display font-black uppercase text-xs tracking-wider text-gray-900 mb-4 pb-2 border-b border-black/[0.06]">Keuntungan Member</h3>
            <ul className="space-y-3 mt-4">
              {[
                'Voucher diskon khusus member baru',
                'Poin reward setiap transaksi',
                'Akses eksklusif koleksi terbaru',
                'Checkout lebih cepat'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600 font-body">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 text-gray-400 text-xs font-display font-bold uppercase tracking-wider">
          Bergabung dengan komunitas kami
        </div>
      </div>
    </div>
  );
}
