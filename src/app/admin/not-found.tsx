'use client';

import Link from 'next/link';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6 py-16">
      <div className="text-center max-w-md">
        {/* 404 graphic */}
        <div className="inline-block mb-6">
          <div className="text-[100px] font-black leading-none text-gray-100 select-none">
            404
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Halaman Admin Tidak Ditemukan
        </h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Halaman yang Anda cari tidak ada di area admin. Periksa kembali URL atau kembali ke dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Ke Dashboard
          </Link>
          <button
            onClick={() => history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
