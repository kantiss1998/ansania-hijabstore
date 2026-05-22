import Link from 'next/link';
import { Home, Search, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 graphic */}
        <div className="relative inline-block mb-8">
          <div className="text-[150px] sm:text-[200px] font-black font-heading leading-none bg-gradient-to-br from-primary-100 to-primary-200 bg-clip-text text-transparent select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircle className="h-16 w-16 text-primary-400 animate-pulse" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-heading text-gray-900 mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan. Coba cari produk yang Anda inginkan atau kembali ke beranda.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={ROUTES.HOME}
            className="btn-primary rounded-full px-8 py-3.5 text-base"
          >
            <Home className="h-5 w-5" />
            Ke Beranda
          </Link>
          <Link
            href={ROUTES.PRODUCTS}
            className="btn-outline rounded-full px-8 py-3.5 text-base"
          >
            <Search className="h-5 w-5" />
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
