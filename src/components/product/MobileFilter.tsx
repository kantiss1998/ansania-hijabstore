'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/product.types';

interface MobileFilterProps {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
  query?: string;
}

export function MobileFilter({ categories, currentCategory, currentSort, query }: MobileFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="lg:hidden flex items-center justify-center gap-2 rounded-full border border-primary-200 py-2.5 px-5 text-xs font-display font-bold text-dark w-full sm:w-auto hover:bg-primary-50 transition-colors cursor-pointer"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filter
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display font-black text-lg text-dark">Filter</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-5 space-y-6 pb-20">
              {/* Kategori */}
              <div>
                <h3 className="section-label mb-3">Kategori</h3>
                <div className="space-y-1">
                  <Link
                    href={ROUTES.PRODUCTS}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-sm transition-colors",
                      !currentCategory ? "bg-primary-50 text-primary-600 font-display font-bold" : "text-gray-600 font-body hover:bg-gray-50 hover:text-dark"
                    )}
                  >
                    Semua Kategori
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`${ROUTES.PRODUCTS}?category=${cat.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-sm transition-colors",
                        currentCategory === cat.slug ? "bg-primary-50 text-primary-600 font-display font-bold" : "text-gray-600 font-body hover:bg-gray-50 hover:text-dark"
                      )}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Urutkan */}
              <div>
                <h3 className="section-label mb-3">Urutkan</h3>
                <div className="space-y-1">
                  {[
                    { value: 'newest', label: 'Terbaru' },
                    { value: 'price_asc', label: 'Harga ↑' },
                    { value: 'price_desc', label: 'Harga ↓' },
                  ].map((option) => (
                    <Link
                      key={option.value}
                      href={`${ROUTES.PRODUCTS}?${new URLSearchParams({
                        ...(currentCategory ? { category: currentCategory } : {}),
                        ...(query ? { q: query } : {}),
                        sort: option.value,
                      }).toString()}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-sm transition-colors",
                        currentSort === option.value ? "bg-primary-50 text-primary-600 font-display font-bold" : "text-gray-600 font-body hover:bg-gray-50 hover:text-dark"
                      )}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
