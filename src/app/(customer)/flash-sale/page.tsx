import type { Metadata } from 'next';
import { getActiveFlashSale } from '@/services/api/flashSales';
import { ProductCard } from '@/components/shared/ProductCard';

export const dynamic = 'force-dynamic';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHero } from '@/components/customer/PageHero';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Flash Sale | ansania',
  description: 'Promo diskon besar-besaran dengan waktu terbatas.',
};

export default async function FlashSalePage() {
  const flashSaleData = await getActiveFlashSale();
  const flashSales =
    flashSaleData?.products?.map((p: { product: Parameters<typeof ProductCard>[0]['product'] }) => p.product) ||
    [];

  return (
    <div className="min-h-screen">
      <PageHero
        badge="Live drop"
        eyebrow="Limited time"
        title={
          <>
            Flash <span className="text-primary-400">Sale</span>
          </>
        }
        description="Diskon besar untuk koleksi modest premium — buruan sebelum kehabisan."
      />

      <div className="container-main py-8 sm:py-10">
        {flashSales.length === 0 ? (
          <div className="rounded-3xl border border-primary-100/60 bg-white p-8 sm:p-12">
            <EmptyState
              title="Flash Sale Belum Tersedia"
              description="Belum ada flash sale aktif. Cek lagi nanti atau subscribe newsletter."
              actionLabel="Lihat Semua Produk"
              actionHref={ROUTES.PRODUCTS}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {flashSales.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
