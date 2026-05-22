import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FlashSaleSection } from '@/components/home/FlashSaleSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { ValuePropsSection } from '@/components/home/ValuePropsSection';
import { SocialSection } from '@/components/home/SocialSection';
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
  // Fetch data in parallel
  const [
    banners,
    categories,
    flashSale,
    featuredProductsRes,
    newArrivalsRes
  ] = await Promise.allSettled([
    getBanners(),
    getCategories(),
    getActiveFlashSale(),
    getProducts({ isFeatured: true, limit: 8 }),
    getProducts({ sort: 'newest', limit: 8 })
  ]);

  const resolvedBanners = banners.status === 'fulfilled' && banners.value ? banners.value : [];
  const resolvedCategories = categories.status === 'fulfilled' && categories.value ? categories.value : [];
  const resolvedFlashSale = flashSale.status === 'fulfilled' ? flashSale.value : null;
  const resolvedFeatured = featuredProductsRes.status === 'fulfilled' && featuredProductsRes.value?.data ? featuredProductsRes.value.data : [];
  const resolvedNewArrivals = newArrivalsRes.status === 'fulfilled' && newArrivalsRes.value?.data ? newArrivalsRes.value.data : [];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="fixed top-20 right-0 w-96 h-96 bg-primary-200/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div
        className="fixed top-1/2 left-0 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10">
        {/* Hero Banner Carousel */}
        {resolvedBanners.length > 0 && <HeroSection banners={resolvedBanners} />}

        {/* Value Props Strip */}
        <ValuePropsSection />

        {/* Flash Sale */}
        {resolvedFlashSale && <FlashSaleSection flashSale={resolvedFlashSale} />}

        {/* Category Grid */}
        {resolvedCategories.length > 0 && <CategorySection categories={resolvedCategories} />}

        {/* Featured Products */}
        {resolvedFeatured.length > 0 && <FeaturedProductsSection products={resolvedFeatured} />}

        {/* New Arrivals */}
        {resolvedNewArrivals.length > 0 && <NewArrivalsSection products={resolvedNewArrivals} />}

        {/* Social Media */}
        <SocialSection />
      </div>
    </div>
  );
}
