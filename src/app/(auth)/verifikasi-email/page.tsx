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
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-6 shadow-sm border-8 border-white">
          <MailCheck className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black font-heading text-gray-900 mb-3">Cek Email Anda</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Kami telah mengirimkan tautan verifikasi ke email Anda. Silakan klik tautan tersebut untuk mengaktifkan akun ansania Anda.
        </p>
      </div>

      <div className="card p-6 shadow-xl shadow-gray-200/50 border border-gray-100 text-center">
        <p className="text-sm text-gray-600 mb-4">Tidak menerima email?</p>
        <button className="w-full btn-outline py-3 rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-all">
          Kirim Ulang Email
        </button>
      </div>

      <div className="text-center">
        <Link href={ROUTES.HOME} className="font-bold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1">
          Lanjut Jelajahi ansania <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
