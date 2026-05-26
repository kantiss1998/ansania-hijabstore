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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0A0A0A] text-white mb-6">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-[#0A0A0A] mb-2">Lupa Kata Sandi?</h1>
          <p className="text-xs text-gray-400 font-body leading-relaxed max-w-sm mx-auto">
            Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
          </p>
        </div>

        <div className="border border-black/[0.06] bg-white rounded-2xl p-8">
          <form className="space-y-5" action="#">
            <div>
              <label htmlFor="email" className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-2.5 pl-11 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white font-display font-bold uppercase tracking-widest text-[11px] rounded-xl flex justify-center items-center gap-2 transition-all cursor-pointer"
            >
              Kirim Tautan Reset
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 font-body">
          Ingat kata sandi Anda?{' '}
          <Link href={ROUTES.AUTH.LOGIN} className="text-[#F52D6E] font-display font-bold uppercase tracking-wider hover:text-primary-600 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  );
}
