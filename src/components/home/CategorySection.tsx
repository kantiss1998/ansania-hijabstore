'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { type Category } from '@/types/product.types';
import { ROUTES } from '@/constants/routes';
import { motion } from 'framer-motion';

interface Props {
  categories: Category[];
}

const COLORS = [
  '#FF5C91', '#7C3AED', '#F59E0B', '#10B981',
  '#3B82F6', '#EF4444', '#EC4899', '#8B5CF6',
];

export function CategorySection({ categories }: Props) {
  const displayCategories = categories.slice(0, 12);

  return (
    <section className="py-10 sm:py-14">
      <div className="container-main">
        <div className="section-header mb-8">
          <div>
            <p className="section-label mb-1.5">Shop by vibe</p>
            <h2 className="section-title">
              Pilih <span className="text-gradient-brand">Kategori</span>
            </h2>
          </div>
          <Link href="/kategori" className="section-link group">
            Semua
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-hide -mx-5 sm:-mx-8 lg:-mx-12 px-5 sm:px-8 lg:px-12">
          <div className="flex gap-4 sm:gap-5 pb-2" style={{ width: 'max-content' }}>
            {displayCategories.map((cat, i) => {
              const color = COLORS[i % COLORS.length];
              const hasImage = !!cat.imageUrl;
              const initial = cat.name.charAt(0).toUpperCase();

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                >
                  <Link
                    href={ROUTES.CATEGORY(cat.slug)}
                    className="group flex w-[92px] sm:w-[112px] flex-col items-center gap-3 flex-shrink-0"
                  >
                    <div
                      className="relative h-[84px] w-[84px] sm:h-[104px] sm:w-[104px] overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary-400 group-hover:scale-[1.03] shadow-sm"
                      style={{
                        background: hasImage
                          ? undefined
                          : `linear-gradient(145deg, ${color}, ${color}99)`,
                      }}
                    >
                      {hasImage ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-display text-2xl font-black text-white">
                          {initial}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-center">
                      <span className="block text-[11px] sm:text-xs font-display font-bold text-dark group-hover:text-primary-600 transition-colors leading-tight">
                        {cat.name}
                      </span>
                      <span className="text-[9px] text-gray-400 font-body mt-0.5">
                        {cat.productCount} items
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
