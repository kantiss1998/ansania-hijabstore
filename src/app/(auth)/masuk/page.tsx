'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import GoogleSignInButton from '@/components/shared/GoogleSignInButton';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Email dan password harus diisi');
      return;
    }

    const success = await login(formData);
    if (success) {
      toast.success('Login berhasil!');
      router.push(ROUTES.HOME); // Nanti ganti ke /akun/profil jika sudah siap
    }
  };





  return (
    <div className="min-h-screen flex">
      {/* Left side — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0A0A0A] p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F52D6E]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
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

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2">
            <Sparkles className="h-3.5 w-3.5 text-[#F52D6E]" />
            <span className="text-xs font-display font-bold uppercase tracking-wider text-white">Fashion Muslim Premium</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black uppercase tracking-[-0.04em] leading-[0.95] text-white">
            Selamat Datang<br />
            <span className="text-[#F52D6E]">Kembali!</span>
          </h1>
          <p className="text-gray-400 text-sm font-body leading-relaxed max-w-md">
            Masuk untuk menikmati pengalaman belanja fashion muslim premium yang lebih personal dan mudah.
          </p>
          <div className="flex gap-3 flex-wrap">
            {['10K+ Produk', '500K+ Pelanggan', 'Gratis Ongkir'].map((feat) => (
              <div key={feat} className="flex items-center gap-2 border border-white/10 rounded-xl px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F52D6E]" />
                <span className="text-xs text-white font-display font-bold uppercase tracking-wider">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-gray-500 text-xs font-display font-bold uppercase tracking-wider">
          © {new Date().getFullYear()} ansania
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
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
              Masuk ke Akun
            </h2>
            <p className="mt-2 text-xs text-gray-400 font-body">
              Belum punya akun?{' '}
              <Link href={ROUTES.AUTH.REGISTER} className="text-[#F52D6E] font-display font-bold uppercase tracking-wider hover:text-[#0A0A0A] transition-colors">
                Daftar gratis
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
              <span className="bg-white px-4 text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">atau masuk dengan email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-500">Password</label>
                <Link href={ROUTES.AUTH.FORGOT_PASSWORD} className="text-xs font-display font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#F52D6E] transition-colors">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-2.5 pl-11 pr-11 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                  autoComplete="current-password"
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

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-black/10 text-[#F52D6E] focus:ring-0" />
              <label htmlFor="remember" className="text-xs text-gray-400 font-body">Ingat saya</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white font-display font-bold uppercase tracking-widest text-[11px] rounded-xl flex justify-center items-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Masuk
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 font-body">
            Belum punya akun?{' '}
            <Link href={ROUTES.AUTH.REGISTER} className="text-[#F52D6E] font-display font-bold uppercase tracking-wider hover:text-primary-600 inline-flex items-center gap-1 transition-colors group">
              Daftar Sekarang
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
