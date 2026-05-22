import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Lupa Password | ansania',
  description: 'Atur ulang kata sandi akun ansania Anda.',
};

export default function LupaPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-6 shadow-sm">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black font-heading text-gray-900 mb-2">Lupa Kata Sandi?</h1>
        <p className="text-gray-500">
          Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
        </p>
      </div>

      <div className="card p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
        <form className="space-y-6" action="#">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="input pl-10 py-3 text-base w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3.5 rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
          >
            Kirim Tautan Reset
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-600">
        Ingat kata sandi Anda?{' '}
        <Link href={ROUTES.AUTH.LOGIN} className="font-bold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Login
        </Link>
      </p>
    </div>
  );
}
