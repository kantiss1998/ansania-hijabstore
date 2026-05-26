import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FlashSaleSection } from '@/components/home/FlashSaleSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { MidHeroBanner } from '@/components/home/MidHeroBanner';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { ValuePropsSection } from '@/components/home/ValuePropsSection';
// import { SocialSection } from '@/components/home/SocialSection';
import { TrendingMarquee } from '@/components/home/TrendingMarquee';
import { getBanners } from '@/services/api/banners';
import { getCategories } from '@/services/api/categories';
import { getProducts } from '@/services/api/products';
import { getActiveFlashSale } from '@/services/api/flashSales';

export const metadata: Metadata = {
  title: 'ansania — Fashion Muslim Premium Indonesia',
  description:
    'Temukan koleksi hijab, gamis, mukena, dan fashion muslim premium terbaik. Kualitas terjamin, pengiriman cepat ke seluruh Indonesia.',
};

export default async function HomePage() {
  const [
    banners,
    categories,
    flashSale,
    featuredProductsRes,
    newArrivalsRes,
  ] = await Promise.allSettled([
    getBanners(),
    getCategories(),
    getActiveFlashSale(),
    getProducts({ isFeatured: true, limit: 8 }),
    getProducts({ sort: 'newest', limit: 8 }),
  ]);

  const resolvedBanners = banners.status === 'fulfilled' && banners.value ? banners.value : [];
  const resolvedCategories = categories.status === 'fulfilled' && categories.value ? categories.value : [];
  const resolvedFlashSale = flashSale.status === 'fulfilled' ? flashSale.value : null;
  const resolvedFeatured =
    featuredProductsRes.status === 'fulfilled' && featuredProductsRes.value?.data
      ? featuredProductsRes.value.data
      : [];
  const resolvedNewArrivals =
    newArrivalsRes.status === 'fulfilled' && newArrivalsRes.value?.data
      ? newArrivalsRes.value.data
      : [];

  const hasFeatured = resolvedFeatured.length > 0;
  const hasNewArrivals = resolvedNewArrivals.length > 0;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="relative z-10">
        {resolvedBanners.length > 0 && <HeroSection banners={resolvedBanners} />}

        <TrendingMarquee />
        <ValuePropsSection />

        {resolvedFlashSale && <FlashSaleSection flashSale={resolvedFlashSale} />}
        {resolvedCategories.length > 0 && <CategorySection categories={resolvedCategories} />}
        {hasFeatured && <FeaturedProductsSection products={resolvedFeatured} />}

        {(hasFeatured || hasNewArrivals) && <MidHeroBanner />}

        {hasNewArrivals && <NewArrivalsSection products={resolvedNewArrivals} />}

        {/* Join the squad — dinonaktifkan sementara */}
        {/* <SocialSection /> */}
      </div>
    </div>
  );
}
