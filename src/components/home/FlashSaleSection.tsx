'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Zap, ChevronRight, Flame } from 'lucide-react';
import { type FlashSale } from '@/types/product.types';
import ProductCard from '@/components/product/ProductCard';
import { ROUTES } from '@/constants/routes';

interface Props {
  flashSale: FlashSale;
}

function useCountdown(endDateStr: string) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const end = new Date(endDateStr).getTime();
    const calc = () => {
      const diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(p => (p.h === h && p.m === m && p.s === s ? p : { h, m, s }));
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDateStr]);
  return timeLeft;
}

function Digit({ value }: { value: number }) {
  const str = String(value).padStart(2, '0');
  return (
    <div className="flex gap-0.5">
      {str.split('').map((d, i) => (
        <div
          key={i}
          className="w-7 h-8 sm:w-8 sm:h-9 bg-white/10 border border-white/10 text-white rounded-lg flex items-center justify-center font-display font-black text-base sm:text-lg tabular-nums backdrop-blur-sm"
        >
          {d}
        </div>
      ))}
    </div>
  );
}

function Sep() {
  return <span className="font-display font-black text-white/50 pb-2 text-lg leading-none">:</span>;
}

export function FlashSaleSection({ flashSale }: Props) {
  const { h, m, s } = useCountdown(flashSale.endDate);
  const products = flashSale.products.filter(p => p.product).slice(0, 4).map(p => p.product);
  if (!products.length) return null;

  return (
    <section className="py-0 bg-white">
      {/* ── Dark Header ── */}
      <div className="bg-dark relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-full bg-primary-600/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 w-48 h-24 bg-accent-lime/10 blur-2xl pointer-events-none" />

        <div className="container-main relative z-10 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Left: Branding + countdown */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              {/* Label */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 shadow-lg shadow-primary-600/30">
                  <Zap className="h-4 w-4 text-white fill-white" />
                </div>
                <div>
                  <p className="font-display font-black text-white text-base sm:text-lg leading-tight tracking-tight uppercase">
                    Flash Sale
                  </p>
                  <p className="text-[10px] text-white/40 font-body uppercase tracking-widest leading-none mt-0.5">
                    {flashSale.name}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-white/10" />

              {/* Countdown */}
              <div className="flex items-end gap-1.5">
                <span className="text-[10px] text-white/40 font-body uppercase tracking-widest pb-1.5 mr-1 hidden sm:block">
                  Berakhir dalam
                </span>
                <div className="flex items-end gap-1.5">
                  <div className="flex flex-col items-center gap-1">
                    <Digit value={h} />
                    <span className="text-[8px] text-white/30 uppercase tracking-widest font-body">Jam</span>
                  </div>
                  <Sep />
                  <div className="flex flex-col items-center gap-1">
                    <Digit value={m} />
                    <span className="text-[8px] text-white/30 uppercase tracking-widest font-body">Mnt</span>
                  </div>
                  <Sep />
                  <div className="flex flex-col items-center gap-1">
                    <Digit value={s} />
                    <span className="text-[8px] text-white/30 uppercase tracking-widest font-body">Dtk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: CTA */}
            <Link
              href={ROUTES.FLASH_SALE}
              className="group flex items-center gap-1.5 text-[11px] font-display font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors"
            >
              <Flame className="h-3.5 w-3.5 text-primary-500" />
              Lihat Semua
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="border-b border-black/[0.05]">
        <div className="container-main py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
