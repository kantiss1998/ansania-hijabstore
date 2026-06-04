'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, LayoutDashboard } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6 py-16">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-900/10 to-red-800/20 flex items-center justify-center">
            <AlertOctagon className="h-10 w-10 text-red-500" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-500 text-sm mb-2 leading-relaxed">
          Terjadi kesalahan saat memuat halaman admin ini.
        </p>

        {/* Error details (always shown in admin for debugging) */}
        <div className="mb-6 text-left">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-mono text-red-700 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-400 mt-1 font-mono">
                Digest: {error.digest}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Coba Lagi
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
