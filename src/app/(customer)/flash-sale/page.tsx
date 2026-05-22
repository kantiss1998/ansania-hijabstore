import type { Metadata } from 'next';
import { getActiveFlashSale } from '@/services/api/flashSales';
import { ProductCard } from '@/components/shared/ProductCard';
import { Zap, Timer } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Flash Sale | benangbaju',
  description: 'Promo diskon besar-besaran dengan waktu terbatas.',
};

export default async function FlashSalePage() {
  const flashSaleData = await getActiveFlashSale();
  const flashSales = flashSaleData?.products?.map((p: any) => p.product) || [];

  return (
    <div className="container-main py-12">
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-8 sm:p-12 text-white mb-10 shadow-xl shadow-red-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/30">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-bold tracking-wider uppercase text-yellow-50">Sedang Berlangsung</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mb-2">Flash Sale</h1>
            <p className="text-red-100 text-lg">Diskon hingga 80% untuk produk terpilih!</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2 flex items-center gap-1"><Timer className="w-3 h-3"/> Berakhir Dalam</p>
            <div className="flex gap-2 text-2xl font-black font-heading">
              <div className="bg-white text-red-600 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner">02</div>
              <span className="text-white/50 self-center">:</span>
              <div className="bg-white text-red-600 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner">45</div>
              <span className="text-white/50 self-center">:</span>
              <div className="bg-white text-red-600 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner">30</div>
            </div>
          </div>
        </div>
      </div>

      {flashSales.length === 0 ? (
        <EmptyState 
          title="Flash Sale Belum Tersedia"
          description="Saat ini tidak ada flash sale yang sedang berlangsung. Silakan cek kembali nanti atau berlangganan newsletter kami."
          actionLabel="Lihat Semua Produk"
          actionHref={ROUTES.PRODUCTS}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {flashSales.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
