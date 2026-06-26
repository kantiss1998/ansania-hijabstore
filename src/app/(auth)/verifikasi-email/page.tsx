'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MailCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { resendVerificationEmail } from '@/services/api/auth';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

// Bug #3 fix: ubah jadi Client Component — tambah resend handler dengan cooldown timer
export default function VerifikasiEmailPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // detik cooldown anti-spam

  const handleResend = async () => {
    if (cooldown > 0 || isLoading) return;
    if (!user?.email) {
      toast.error('Email tidak ditemukan. Silakan login ulang.');
      return;
    }

    setIsLoading(true);
    try {
      await resendVerificationEmail(user.email);

      toast.success('Email verifikasi telah dikirim ulang!');
      // Cooldown 60 detik setelah berhasil kirim
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      const axiosErr = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(axiosErr.response?.data?.message || 'Gagal mengirim ulang email. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0A0A0A] text-white mb-6">
            <MailCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-[#0A0A0A] mb-3">
            Cek Email Anda
          </h1>
          <p className="text-xs text-gray-400 font-body leading-relaxed max-w-sm mx-auto">
            Kami telah mengirimkan tautan verifikasi ke email Anda. Silakan klik tautan tersebut untuk mengaktifkan akun ansania Anda.
          </p>
        </div>

        <div className="border border-black/[0.06] bg-white rounded-2xl p-6 text-center space-y-4">
          <p className="text-xs text-gray-400 font-body">Tidak menerima email?</p>
          <button
            onClick={handleResend}
            disabled={isLoading || cooldown > 0}
            className="w-full h-11 border border-black/10 text-[#0A0A0A] hover:bg-gray-50/50 font-display font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : cooldown > 0 ? (
              <><CheckCircle2 className="h-4 w-4 text-green-500" /> Kirim ulang dalam {cooldown}s</>
            ) : (
              'Kirim Ulang Email'
            )}
          </button>
          <p className="text-[10px] text-gray-300 font-body">
            Cek folder spam jika tidak ada di inbox.
          </p>
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
