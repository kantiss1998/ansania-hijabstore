'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { type FlashSale } from '@/types/product.types';
import ProductCard from '@/components/product/ProductCard';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface Props {
  flashSale: FlashSale;
}

function useCountdown(endDateStr: string) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const endDate = new Date(endDateStr).getTime();
    
    const calc = () => {
      const diff = Math.max(0, endDate - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      
      // Cegah state update jika nilai tidak berubah
      setTimeLeft(prev => {
        if (prev.h === h && prev.m === m && prev.s === s) return prev;
        return { h, m, s };
      });
    };
    
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDateStr]);

  return timeLeft;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-xl sm:text-2xl font-heading tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] text-gray-500 mt-1 font-medium">{label}</span>
    </div>
  );
}

export function FlashSaleSection({ flashSale }: Props) {
  const { h, m, s } = useCountdown(flashSale.endDate);

  const products = flashSale.products
    .filter((p) => p.product)
    .slice(0, 4)
    .map((p) => p.product);

  if (!products.length) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-primary-500 text-white px-4 py-2 rounded-xl">
              <Zap className="h-5 w-5 animate-pulse" />
              <span className="font-black text-lg font-heading">Flash Sale</span>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2">
              <TimeUnit value={h} label="Jam" />
              <span className="text-2xl font-black text-gray-400 pb-5">:</span>
              <TimeUnit value={m} label="Menit" />
              <span className="text-2xl font-black text-gray-400 pb-5">:</span>
              <TimeUnit value={s} label="Detik" />
            </div>
          </div>

          <Link
            href={ROUTES.FLASH_SALE}
            className="inline-flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700 text-sm transition-colors group"
          >
            Lihat Semua
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
