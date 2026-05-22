import type { Metadata } from 'next';
import Link from 'next/link';
import { Filter, Search, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { ROUTES } from '@/constants/routes';
import { getProducts } from '@/services/api/products';
import { getCategories } from '@/services/api/categories';
import type { ProductFilter } from '@/types/product.types';

const SORT_OPTIONS: NonNullable<ProductFilter['sort']>[] = [
  'newest',
  'price_asc',
  'price_desc',
  'popular',
  'best_rating',
];

function parseSort(value: string | undefined): ProductFilter['sort'] {
  if (value && SORT_OPTIONS.includes(value as NonNullable<ProductFilter['sort']>)) {
    return value as NonNullable<ProductFilter['sort']>;
  }
  return undefined;
}

export const metadata: Metadata = {
  title: 'Koleksi Produk | ansania',
  description: 'Jelajahi koleksi terbaru dari ansania.',
};

export default async function ProductListingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? Number(resolvedSearchParams.page) : 1;
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
  const sort = parseSort(
    typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : undefined,
  );
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;

  // Fetch data
  const [productsRes, categoriesRes] = await Promise.allSettled([
    getProducts({ page, limit: 12, category, sort, q: search }),
    getCategories()
  ]);

  const productsData = productsRes.status === 'fulfilled' && productsRes.value ? productsRes.value : { data: [], meta: { total: 0, lastPage: 1 } };
  const products = productsData.data || [];
  const meta = productsData.meta || { total: 0, lastPage: 1 };

  const categories = categoriesRes.status === 'fulfilled' && categoriesRes.value ? categoriesRes.value : [];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="h-4 w-4 text-primary-200" />
              <span className="text-sm font-semibold text-primary-50">Koleksi Terbaru</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-heading mb-3">
              {category ? `Kategori: ${category}` : search ? `Pencarian: ${search}` : 'Semua Produk'}
            </h1>
            <p className="text-primary-100 text-lg">
              Temukan gaya terbaik Anda dengan koleksi fashion premium kami yang dirancang khusus untuk Anda.
            </p>
          </div>
        </div>
      </div>

      <div className="container-main mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <Filter className="h-5 w-5 text-primary-600" />
                <h2 className="font-bold text-gray-900">Filter</h2>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">Kategori</h3>
                <div className="space-y-2">
                  <Link
                    href={ROUTES.PRODUCTS}
                    className={`block text-sm py-1.5 transition-colors ${!category ? 'text-primary-600 font-bold' : 'text-gray-600 hover:text-primary-600'}`}
                  >
                    Semua Kategori
                  </Link>
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`${ROUTES.PRODUCTS}?category=${cat.slug}`}
                      className={`block text-sm py-1.5 transition-colors ${category === cat.slug ? 'text-primary-600 font-bold' : 'text-gray-600 hover:text-primary-600'}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Urutkan */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">Urutkan</h3>
                <div className="space-y-2">
                  {[
                    { value: 'newest', label: 'Terbaru' },
                    { value: 'price_asc', label: 'Harga: Rendah ke Tinggi' },
                    { value: 'price_desc', label: 'Harga: Tinggi ke Rendah' },
                  ].map((option) => (
                    <Link
                      key={option.value}
                      href={`${ROUTES.PRODUCTS}?${new URLSearchParams({
                        ...(category ? { category } : {}),
                        ...(search ? { search } : {}),
                        sort: option.value,
                      }).toString()}`}
                      className={`block text-sm py-1.5 transition-colors ${sort === option.value ? 'text-primary-600 font-bold' : 'text-gray-600 hover:text-primary-600'}`}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <p className="text-gray-600 text-sm">
                Menampilkan <span className="font-bold text-gray-900">{products.length}</span> dari <span className="font-bold text-gray-900">{meta.total}</span> produk
              </p>

              {/* Mobile Filter Toggle */}
              <button className="lg:hidden flex items-center gap-2 btn-outline rounded-xl py-2 px-4 text-sm w-full sm:w-auto">
                <SlidersHorizontal className="h-4 w-4" />
                Filter & Urutkan
              </button>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {meta.lastPage > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={meta.lastPage}
                      baseUrl={ROUTES.PRODUCTS}
                      searchParams={{ category, sort, search }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 p-12">
                <EmptyState
                  title="Produk Tidak Ditemukan"
                  description="Maaf, tidak ada produk yang sesuai dengan filter pencarian Anda. Coba hapus filter atau gunakan kata kunci lain."
                  actionLabel="Hapus Semua Filter"
                  actionHref={ROUTES.PRODUCTS}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
