'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, KeyRound, Loader2, Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '@/services/api/auth';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

function ResetPasswordContent() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Jika tidak ada token di URL, redirect ke lupa-password
    if (!token) {
      toast.error('Token reset tidak valid. Silakan minta ulang.');
      router.replace(ROUTES.AUTH.FORGOT_PASSWORD ?? '/lupa-password');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Kata sandi minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (!token) return;

    setIsLoading(true);
    try {
      await resetPassword({ token, new_password: password });
      toast.success('Kata sandi berhasil diubah! Silakan masuk.');
      router.replace(ROUTES.AUTH.LOGIN);
    } catch (error: unknown) {
      const axiosErr = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(axiosErr.response?.data?.message || 'Gagal mengatur ulang kata sandi. Token mungkin sudah kedaluwarsa.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0A0A0A] text-white mb-6">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-[#0A0A0A] mb-2">
            Buat Kata Sandi Baru
          </h1>
          <p className="text-xs text-gray-400 font-body leading-relaxed max-w-sm mx-auto">
            Silakan masukkan kata sandi baru Anda. Pastikan kata sandi kuat dan tidak mudah ditebak.
          </p>
        </div>

        <div className="border border-black/[0.06] bg-white rounded-2xl p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pl-11 pr-11 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                  placeholder="Minimal 6 karakter"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 pl-11 pr-11 text-xs font-body rounded-xl border focus:outline-none transition-all placeholder:text-gray-300 ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-black/10 focus:border-[#F52D6E]'
                  }`}
                  placeholder="Ulangi kata sandi baru"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] text-red-500 mt-1 font-body">Kata sandi tidak cocok</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
              className="w-full h-12 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white font-display font-bold uppercase tracking-widest text-[11px] rounded-xl flex justify-center items-center gap-2 transition-all cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Kata Sandi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

