'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { type ProductListItem } from '@/types/product.types';
import ProductCard from '@/components/product/ProductCard';
import { ROUTES } from '@/constants/routes';

interface Props {
  products: ProductListItem[];
}

export function NewArrivalsSection({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-primary-50/25 border-b border-primary-100/50">
      <div className="container-main">
        {/* Header */}
        <div className="section-header mb-6">
          <div>
            <p className="section-label mb-1.5">Just Dropped</p>
            <h2 className="section-title">
              New <span className="text-gradient-brand">Arrival</span>
            </h2>
          </div>
          <Link href={`${ROUTES.PRODUCTS}?sort=newest`} className="section-link group">
            Lihat Semua
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Carousel Slider */}
        <div className="relative group/nav">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 hidden md:flex items-center justify-center rounded-full bg-white border border-black/10 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:bg-[#FAFAFA] active:scale-95 transition-all text-[#0A0A0A] opacity-0 group-hover/nav:opacity-100 duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 hidden md:flex items-center justify-center rounded-full bg-white border border-black/10 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:bg-[#FAFAFA] active:scale-95 transition-all text-[#0A0A0A] opacity-0 group-hover/nav:opacity-100 duration-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
          >
            {products.slice(0, 12).map((product) => (
              <div key={product.id} className="w-[170px] sm:w-[210px] md:w-[230px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href={`${ROUTES.PRODUCTS}?sort=newest`}
            className="group btn-pill-brand h-12 px-8 text-sm"
          >
            Lihat Koleksi Terbaru
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
