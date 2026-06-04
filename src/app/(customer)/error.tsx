'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function CustomerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Customer Error]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        {/* Animated icon */}
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center shadow-xl shadow-red-100/50 animate-[pulse_3s_ease-in-out_infinite]">
            <AlertTriangle className="h-12 w-12 text-red-500" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">!</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-heading text-gray-900 mb-3">
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi atau kembali ke beranda.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="text-xs text-gray-400 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary rounded-full px-8 py-3.5 text-base inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Coba Lagi
          </button>
          <Link
            href={ROUTES.HOME}
            className="btn-outline rounded-full px-8 py-3.5 text-base inline-flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
