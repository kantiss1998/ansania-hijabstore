import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { type ProductListItem } from '@/types/product.types';
import ProductCard from '@/components/product/ProductCard';
import { ROUTES } from '@/constants/routes';

interface Props {
  products: ProductListItem[];
}

export function NewArrivalsSection({ products }: Props) {
  return (
    <section className="py-12 sm:py-16 bg-gray-50/60">
      <div className="container-main">
        {/* Header */}
        <div className="mb-10 text-center space-y-4">
          <div className="inline-block px-4 py-1.5 bg-primary-50 rounded-full text-primary-600 text-xs font-black uppercase tracking-widest">
            Terbaru
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-gray-900 italic">
            Koleksi Teranyar
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto italic">
            Desain eksklusif terbaru yang memadukan tren kekinian dengan sentuhan klasik yang abadi.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href={`${ROUTES.PRODUCTS}?sort=newest`}
            className="inline-flex items-center gap-2 px-10 py-3.5 border-2 border-primary-100 hover:border-primary-500 rounded-full text-gray-900 font-bold hover:bg-primary-50 transition-all group"
          >
            Lihat Semua Koleksi Baru
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
