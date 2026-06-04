import type { Metadata } from 'next';
import Link from 'next/link';
import { Filter } from 'lucide-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHero } from '@/components/customer/PageHero';
import { MobileFilter } from '@/components/product/MobileFilter';
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
  const q =
    typeof resolvedSearchParams.q === 'string'
      ? resolvedSearchParams.q
      : typeof resolvedSearchParams.search === 'string'
        ? resolvedSearchParams.search
        : undefined;

  const [productsRes, categoriesRes] = await Promise.allSettled([
    getProducts({ page, limit: 12, category, sort, q }),
    getCategories(),
  ]);

  const productsData =
    productsRes.status === 'fulfilled' && productsRes.value
      ? productsRes.value
      : { data: [], meta: { total: 0, lastPage: 1 } };
  const products = productsData.data || [];
  const meta = productsData.meta || { total: 0, lastPage: 1 };
  const categories = categoriesRes.status === 'fulfilled' && categoriesRes.value ? categoriesRes.value : [];

  const pageTitle = category
    ? `Kategori: ${category}`
    : q
      ? `Pencarian: ${q}`
      : 'Semua Produk';

  return (
    <div className="min-h-screen">
      <PageHero
        badge="Curated"
        eyebrow="Catalog · ansania"
        title={pageTitle}
        description="Temukan gaya modest modern — material premium, nyaman untuk aktivitas harian."
        size="compact"
      />

      <div className="container-main py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="rounded-3xl border border-primary-100/80 bg-white p-5 sm:p-6 sticky top-28 shadow-[0_20px_50px_-40px_rgba(245,45,110,0.35)]">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-primary-100/60">
                <Filter className="h-4 w-4 text-primary-500" />
                <h2 className="font-display font-bold text-xs text-dark uppercase tracking-wider">Filter</h2>
              </div>

              <div className="mb-6">
                <h3 className="section-label mb-3">Kategori</h3>
                <div className="space-y-1">
                  <Link
                    href={ROUTES.PRODUCTS}
                    className={`block rounded-xl px-3 py-2 text-xs transition-colors ${
                      !category
                        ? 'bg-primary-50 text-primary-600 font-display font-bold'
                        : 'text-gray-500 font-body hover:bg-gray-50 hover:text-dark'
                    }`}
                  >
                    Semua Kategori
                  </Link>
                  {categories.map((cat: { id: number; slug: string; name: string }) => (
                    <Link
                      key={cat.id}
                      href={`${ROUTES.PRODUCTS}?category=${cat.slug}`}
                      className={`block rounded-xl px-3 py-2 text-xs transition-colors ${
                        category === cat.slug
                          ? 'bg-primary-50 text-primary-600 font-display font-bold'
                          : 'text-gray-500 font-body hover:bg-gray-50 hover:text-dark'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

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
                        ...(category ? { category } : {}),
                        ...(q ? { q } : {}),
                        sort: option.value,
                      }).toString()}`}
                      className={`block rounded-xl px-3 py-2 text-xs transition-colors ${
                        sort === option.value
                          ? 'bg-primary-50 text-primary-600 font-display font-bold'
                          : 'text-gray-500 font-body hover:bg-gray-50 hover:text-dark'
                      }`}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
              <p className="text-xs font-body text-gray-500">
                <span className="font-display font-bold text-dark">{products.length}</span> dari{' '}
                <span className="font-display font-bold text-dark">{meta.total}</span> produk
              </p>
              <MobileFilter 
                categories={categories} 
                currentCategory={category} 
                currentSort={sort} 
                query={q} 
              />
            </div>

            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {meta.lastPage > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={meta.lastPage}
                      baseUrl={ROUTES.PRODUCTS}
                      searchParams={{ category, sort, q }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-3xl border border-primary-100/60 bg-white p-8 sm:p-12">
                <EmptyState
                  title="Produk Tidak Ditemukan"
                  description="Coba hapus filter atau gunakan kata kunci lain."
                  actionLabel="Lihat Semua Produk"
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
