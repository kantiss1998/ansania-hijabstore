import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

/** Banner pemisah antara Produk Unggulan dan New Arrival */
export function MidHeroBanner() {
  return (
    <section className="py-8 sm:py-10 bg-white/80">
      <div className="container-main">
        <div className="relative overflow-hidden rounded-xl h-[200px] sm:h-[240px] md:h-[280px] bg-dark">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1594912959827-020abcb01b05?q=80&w=1600&auto=format&fit=crop)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/70 to-dark/40" />

          <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-10 md:px-14 max-w-xl">
            <p className="text-[10px] font-display font-black uppercase tracking-[0.18em] text-primary-400 mb-2">
              Koleksi spesial
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-[-0.03em] leading-tight">
              Modest look untuk setiap momen
            </h2>
            <p className="mt-2 text-sm text-white/60 font-body leading-relaxed max-w-md">
              Dari daily hijab sampai gamis special occasion — explore drop terbaru.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`${ROUTES.PRODUCTS}?sort=newest`}
                className="btn-pill-brand h-10 px-6 text-xs sm:text-sm"
              >
                Lihat New Arrival
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={ROUTES.FLASH_SALE}
                className="inline-flex h-10 items-center rounded-lg border border-white/25 bg-white/10 px-5 text-xs font-display font-bold text-white backdrop-blur-sm hover:bg-white/15 transition-colors"
              >
                Flash Sale
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
