import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';
import { ROUTES } from '@/constants/routes';
import { getCategories } from '@/services/api/categories';

export const metadata: Metadata = {
  title: 'Semua Kategori | ansania',
  description: 'Jelajahi berbagai kategori produk fashion muslim di ansania.',
};

export default async function KategoriPage() {
  const categories = await getCategories();

  return (
    <div className="container-main py-10 sm:py-14">
      <div className="relative mb-10 overflow-hidden rounded-4xl border border-primary-100/70 bg-gradient-to-br from-primary-50/90 via-white to-violet-50/50 px-6 py-8 sm:px-10 sm:py-12">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-200/40 blur-2xl pointer-events-none" />
        <p className="section-label mb-2">Shop by mood</p>
        <h1 className="text-2xl sm:text-4xl font-display font-black tracking-[-0.04em] text-dark">
          Kategori <span className="text-gradient-brand">Produk</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-body mt-3 max-w-xl leading-relaxed">
          Daily essentials sampai special occasion — pilih vibe kamu hari ini.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`${ROUTES.PRODUCTS}?category=${category.slug}`}
            className="group bento-card flex flex-col items-center justify-center p-6 hover:-translate-y-1"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border border-black/[0.05] relative group-hover:scale-105 transition-all duration-500">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Tag className="h-6 w-6" />
                </div>
              )}
            </div>
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A] group-hover:text-[#F52D6E] transition-colors text-center">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-[10px] text-gray-400 font-body text-center mt-1 line-clamp-2 leading-relaxed">{category.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
