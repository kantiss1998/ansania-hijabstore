import type { Metadata } from 'next';
import { Lock, KeyRound } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reset Password | ansania',
  description: 'Buat kata sandi baru untuk akun Anda.',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0A0A0A] text-white mb-6">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-[#0A0A0A] mb-2">Buat Kata Sandi Baru</h1>
          <p className="text-xs text-gray-400 font-body leading-relaxed max-w-sm mx-auto">
            Silakan masukkan kata sandi baru Anda. Pastikan kata sandi kuat dan tidak mudah ditebak.
          </p>
        </div>

        <div className="border border-black/[0.06] bg-white rounded-2xl p-8">
          <form className="space-y-5" action="#">
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Kata Sandi Baru</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2.5 pl-11 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                  placeholder="Minimal 8 karakter"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2.5 pl-11 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                  placeholder="Ulangi kata sandi baru"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white font-display font-bold uppercase tracking-widest text-[11px] rounded-xl flex justify-center items-center gap-2 transition-all cursor-pointer mt-2"
            >
              Simpan Kata Sandi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
