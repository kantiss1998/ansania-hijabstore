import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Reset Password | ansania',
  description: 'Buat kata sandi baru untuk akun Anda.',
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-6 shadow-sm">
          <KeyRound className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black font-heading text-gray-900 mb-2">Buat Kata Sandi Baru</h1>
        <p className="text-gray-500">
          Silakan masukkan kata sandi baru Anda. Pastikan kata sandi kuat dan tidak mudah ditebak.
        </p>
      </div>

      <div className="card p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
        <form className="space-y-6" action="#">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Kata Sandi Baru</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                className="input pl-10 py-3 text-base w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                placeholder="Minimal 8 karakter"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Konfirmasi Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                className="input pl-10 py-3 text-base w-full bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                placeholder="Ulangi kata sandi baru"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3.5 rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
          >
            Simpan Kata Sandi
          </button>
        </form>
      </div>
    </div>
  );
}
