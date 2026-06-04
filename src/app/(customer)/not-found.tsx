import Link from 'next/link';
import { Home, Search, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function CustomerNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        {/* 404 graphic */}
        <div className="relative inline-block mb-8">
          <div className="text-[120px] sm:text-[160px] font-black font-heading leading-none bg-gradient-to-br from-primary-100 to-primary-200 bg-clip-text text-transparent select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="h-14 w-14 text-primary-400 animate-bounce" style={{ animationDuration: '2s' }} />
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
            className="btn-primary rounded-full px-8 py-3.5 text-base inline-flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Ke Beranda
          </Link>
          <Link
            href={ROUTES.PRODUCTS}
            className="btn-outline rounded-full px-8 py-3.5 text-base inline-flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
