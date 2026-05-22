'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Sparkles, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

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
          <div className="lg:hidden text-center">
            <Link href={ROUTES.HOME} className="text-2xl font-black font-heading bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              ansania
            </Link>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-gray-900">
              Buat Akun Baru
            </h2>
            <p className="mt-2 text-gray-600">
              Sudah punya akun?{' '}
              <Link href={ROUTES.AUTH.LOGIN} className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Masuk di sini
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
              <span className="bg-white px-4 text-gray-500">atau daftar dengan email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nomor WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="input pl-11 pr-11"
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

            <p className="text-xs text-gray-500 py-1">
              Dengan mendaftar, Anda menyetujui <Link href="#" className="text-primary-600 hover:underline">Syarat & Ketentuan</Link> serta <Link href="#" className="text-primary-600 hover:underline">Kebijakan Privasi</Link> kami.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary rounded-2xl py-4 text-base flex justify-center items-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Daftar Sekarang
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary-50 to-primary-100 p-12 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary-200/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-300/30 rounded-full blur-3xl" />

        <div className="relative z-10 text-right">
          <Link href={ROUTES.HOME} className="text-2xl font-black font-heading text-primary-900">
            ansania
          </Link>
        </div>

        <div className="relative z-10">
          <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl max-w-sm ml-auto relative">
            <div className="absolute -top-6 -left-6 bg-gradient-primary text-white p-4 rounded-2xl shadow-lg transform -rotate-6">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Keuntungan Member</h3>
            <ul className="space-y-3 mt-4">
              {[
                'Voucher diskon khusus member baru',
                'Poin reward setiap transaksi',
                'Akses eksklusif koleksi terbaru',
                'Checkout lebih cepat'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 text-primary-600 text-sm font-medium">
          Bergabung dengan komunitas kami
        </div>
      </div>
    </div>
  );
}
