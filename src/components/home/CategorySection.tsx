'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Layers, Heart, ShoppingBag, Star, Gem, Shirt } from 'lucide-react';
import { type Category } from '@/types/product.types';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface Props {
  categories: Category[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  sparkles: Sparkles,
  layers: Layers,
  heart: Heart,
  'shopping-bag': ShoppingBag,
  star: Star,
  gem: Gem,
  shirt: Shirt,
};

const CARD_COLORS = [
  { bg: 'bg-rose-50/50', border: 'hover:border-rose-200', icon: 'text-rose-600', iconBg: 'bg-rose-100', shadow: 'hover:shadow-rose-100/50' },
  { bg: 'bg-blue-50/50', border: 'hover:border-blue-200', icon: 'text-blue-600', iconBg: 'bg-blue-100', shadow: 'hover:shadow-blue-100/50' },
  { bg: 'bg-amber-50/50', border: 'hover:border-amber-200', icon: 'text-amber-600', iconBg: 'bg-amber-100', shadow: 'hover:shadow-amber-100/50' },
  { bg: 'bg-emerald-50/50', border: 'hover:border-emerald-200', icon: 'text-emerald-600', iconBg: 'bg-emerald-100', shadow: 'hover:shadow-emerald-100/50' },
  { bg: 'bg-violet-50/50', border: 'hover:border-violet-200', icon: 'text-violet-600', iconBg: 'bg-violet-100', shadow: 'hover:shadow-violet-100/50' },
  { bg: 'bg-sky-50/50', border: 'hover:border-sky-200', icon: 'text-sky-600', iconBg: 'bg-sky-100', shadow: 'hover:shadow-sky-100/50' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const }
  }
};

export function CategorySection({ categories }: Props) {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50/80 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-50/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <div className="container-main relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full font-bold text-sm">
              <Sparkles className="h-4 w-4" />
              Kategori Pilihan
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-gray-900 tracking-tight">
              Jelajahi Koleksi Kami
            </h2>
            <p className="text-gray-500 max-w-lg text-lg">
              Temukan berbagai pilihan fashion muslim premium yang didesain khusus untuk melengkapi gaya elegan Anda sehari-hari.
            </p>
          </div>
          <Link
            href="/kategori"
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-50 hover:text-primary-600 transition-all shadow-sm group whitespace-nowrap"
          >
            Lihat Semua
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6"
        >
          {categories.map((cat, i) => {
            const colors = CARD_COLORS[i % CARD_COLORS.length];
            const Icon = ICON_MAP[cat.iconName ?? ''] ?? ShoppingBag;
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <Link
                  href={ROUTES.CATEGORY(cat.slug)}
                  className={cn(
                    'group flex flex-col items-center gap-5 p-6 rounded-[2rem] border-2 border-transparent bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl',
                    colors.border,
                    colors.shadow
                  )}
                >
                  <div
                    className={cn(
                      'w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-300',
                      colors.iconBg
                    )}
                  >
                    <Icon className={cn('h-10 w-10 drop-shadow-sm', colors.icon)} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 text-base sm:text-lg leading-tight group-hover:text-primary-600 transition-colors">{cat.name}</p>
                    <div className="mt-2 inline-flex items-center justify-center bg-gray-50 px-3 py-1 rounded-full text-xs font-semibold text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      {cat.productCount}+ Produk
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
