'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

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
          <Link href={ROUTES.HOME} className="text-xl font-display font-black uppercase tracking-wider text-white">
            ansania
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
          <div className="lg:hidden text-center">
            <Link href={ROUTES.HOME} className="text-xl font-display font-black uppercase tracking-wider text-[#0A0A0A]">
              ansania
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
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2.5 py-3 px-4 border border-black/10 rounded-xl font-display font-bold uppercase text-[10px] tracking-wider text-gray-700 hover:border-black/20 hover:bg-gray-50 transition-all cursor-pointer">
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2.5 py-3 px-4 border border-black/10 rounded-xl font-display font-bold uppercase text-[10px] tracking-wider text-gray-700 hover:border-black/20 hover:bg-gray-50 transition-all cursor-pointer">
              <svg className="h-4.5 w-4.5 text-blue-650 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
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
