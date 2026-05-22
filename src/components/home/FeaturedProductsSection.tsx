import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { type ProductListItem } from '@/types/product.types';
import ProductCard from '@/components/product/ProductCard';
import { ROUTES } from '@/constants/routes';

interface Props {
  products: ProductListItem[];
}

export function FeaturedProductsSection({ products }: Props) {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-main">
        {/* Header */}
        <div className="mb-10 text-center space-y-4">
          <span className="section-label">
            <Sparkles className="h-3.5 w-3.5" />
            Koleksi Favorit
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent">
            Produk Unggulan
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Koleksi terpopuler dan paling banyak disukai oleh pelanggan kami.
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
            href={`${ROUTES.PRODUCTS}?isFeatured=true`}
            className="inline-flex items-center gap-2 btn-outline rounded-full px-8 py-3.5 group"
          >
            <span className="font-semibold">Lihat Semua Produk Unggulan</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
