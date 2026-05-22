import type { Metadata } from 'next';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { getCategories } from '@/services/api/categories';

export const metadata: Metadata = {
  title: 'Semua Kategori | benangbaju',
  description: 'Jelajahi berbagai kategori produk fashion muslim di benangbaju.',
};

export default async function KategoriPage() {
  const categories = await getCategories();

  return (
    <div className="container-main py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black font-heading text-gray-900">Kategori Produk</h1>
        <p className="text-gray-500 mt-2">Temukan koleksi sesuai dengan kategori favorit Anda.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((category: any) => (
          <Link
            key={category.id}
            href={`${ROUTES.PRODUCTS}?category=${category.slug}`}
            className="group flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-3xl hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
              <Tag className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors text-center">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-xs text-gray-500 text-center mt-2 line-clamp-2">{category.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
