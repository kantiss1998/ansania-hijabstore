import type { Metadata } from 'next';
import Link from 'next/link';
import { MailCheck, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Verifikasi Email | ansania',
  description: 'Verifikasi alamat email Anda untuk mengaktifkan akun ansania.',
};

export default function VerifikasiEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0A0A0A] text-white mb-6">
            <MailCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-[#0A0A0A] mb-3">Cek Email Anda</h1>
          <p className="text-xs text-gray-400 font-body leading-relaxed max-w-sm mx-auto">
            Kami telah mengirimkan tautan verifikasi ke email Anda. Silakan klik tautan tersebut untuk mengaktifkan akun ansania Anda.
          </p>
        </div>

        <div className="border border-black/[0.06] bg-white rounded-2xl p-6 text-center">
          <p className="text-xs text-gray-400 font-body mb-4">Tidak menerima email?</p>
          <button className="w-full h-11 border border-black/10 text-[#0A0A0A] hover:bg-gray-50/50 font-display font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer">
            Kirim Ulang Email
          </button>
        </div>

        <div className="text-center">
          <Link href={ROUTES.HOME} className="text-xs font-display font-bold uppercase tracking-wider text-[#F52D6E] hover:text-primary-600 transition-colors inline-flex items-center gap-1">
            Lanjut Jelajahi ansania <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
