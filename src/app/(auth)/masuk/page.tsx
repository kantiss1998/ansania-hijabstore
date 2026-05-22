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
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link href={ROUTES.HOME} className="text-2xl font-black font-heading text-white">
            ansania
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary-300" />
            <span className="text-sm font-bold text-primary-100">Fashion Muslim Premium</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black font-heading text-white leading-tight">
            Selamat Datang<br />
            <span className="bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent">
              Kembali!
            </span>
          </h1>
          <p className="text-primary-200 text-lg leading-relaxed max-w-md">
            Masuk untuk menikmati pengalaman belanja fashion muslim premium yang lebih personal dan mudah.
          </p>
          <div className="flex gap-4 flex-wrap">
            {['10K+ Produk', '500K+ Pelanggan', 'Gratis Ongkir'].map((feat) => (
              <div key={feat} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-300" />
                <span className="text-sm text-primary-100 font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-primary-400 text-sm">
          © {new Date().getFullYear()} ansania
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link href={ROUTES.HOME} className="text-2xl font-black font-heading bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              ansania
            </Link>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-gray-900">
              Masuk ke Akun
            </h2>
            <p className="mt-2 text-gray-600">
              Belum punya akun?{' '}
              <Link href={ROUTES.AUTH.REGISTER} className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Daftar gratis
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2.5 py-3 px-4 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2.5 py-3 px-4 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
              <svg className="h-5 w-5 text-blue-600 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">atau masuk dengan email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="input pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link href={ROUTES.AUTH.FORGOT_PASSWORD} className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
                  className="input pl-11 pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-primary-600" />
              <label htmlFor="remember" className="text-sm text-gray-600">Ingat saya</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary rounded-2xl py-4 text-base flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Masuk
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link href={ROUTES.AUTH.REGISTER} className="text-primary-600 font-bold hover:text-primary-700 inline-flex items-center gap-1 transition-colors group">
              Daftar Sekarang
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
