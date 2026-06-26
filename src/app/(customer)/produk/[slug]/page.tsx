import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { Shield, Truck, RefreshCw, ChevronRight, BadgeCheck, Star } from 'lucide-react';
import { cache } from 'react';
import { ROUTES } from '@/constants/routes';
import { formatCurrency, getDiscountPercent, cn } from '@/lib/utils';
import { getProductBySlug } from '@/services/api/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { AddToCartSection } from '@/components/product/AddToCartSection';
import { ProductTabs } from '@/components/product/ProductTabs';

const getCachedProduct = cache(async (slug: string) => {
  return getProductBySlug(slug);
});

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const product = await getCachedProduct(params.slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan | ansania',
    };
  }

  return {
    title: `${product.name} | ansania`,
    description: product.description?.replace(/<[^>]+>/g, '').substring(0, 160) || 'Beli produk ini di ansania.',
    openGraph: {
      title: product.name,
      description: product.description?.replace(/<[^>]+>/g, '').substring(0, 160),
      images: product.thumbnailUrl ? [product.thumbnailUrl] : [],
    },
  };
}

export default async function ProductDetailPage(props: Props) {
  const params = await props.params;
  const product = await getCachedProduct(params.slug);


  if (!product) {
    notFound();
  }

  const price = product.price;
  const comparePrice = product.comparePrice;
  const discount = comparePrice ? getDiscountPercent(comparePrice, price) : 0;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-primary-100/80 py-3.5 bg-white/80 backdrop-blur-sm">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs font-body text-gray-500">
            <Link href={ROUTES.HOME} className="hover:text-primary-600 transition-colors">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={ROUTES.PRODUCTS} className="hover:text-primary-600 transition-colors">Produk</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#0A0A0A] font-semibold line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-main py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* ─── Gallery ─────────────────────────────────────────────── */}
          <ProductGallery 
            images={product.images} 
            discount={discount} 
            flashSalePrice={product.flashSalePrice} 
            productName={product.name} 
          />

          {/* ─── Product Info ─────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Category + Brand */}
            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.CATEGORY(product.category?.slug || '')}
                className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-wider bg-black/[0.05] text-[#0A0A0A]"
              >
                {product.category?.name || 'Uncategorized'}
              </Link>
              {product.isNew && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-wider bg-[#F52D6E] text-white">
                  NEW
                </span>
              )}
              {product.isFeatured && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-wider bg-[#0A0A0A] text-white">
                  HOT
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-display font-black text-dark leading-[1.05] tracking-[-0.03em]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn('h-3.5 w-3.5', i < Math.floor(product.ratingAverage || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')}
                  />
                ))}
              </div>
              <span className="font-bold text-[#0A0A0A] text-sm font-body">{Number(product.ratingAverage || 0).toFixed(1)}</span>
              <span className="text-gray-450 text-xs font-body">({product.totalReviews || 0} ulasan)</span>
              <div className="flex items-center gap-1 text-green-600 text-xs font-body">
                <BadgeCheck className="h-3.5 w-3.5" />
                <span className="font-semibold">Terverifikasi</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 flex-wrap pt-1 border-t border-black/[0.06]">
              <span className="text-2xl font-display font-black tracking-tight text-[#0A0A0A]">
                {formatCurrency(product.flashSalePrice ?? price)}
              </span>
              {comparePrice && (
                <span className="text-xs text-gray-400 line-through font-body">{formatCurrency(comparePrice)}</span>
              )}
              {discount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-wider bg-[#F52D6E]/10 text-[#F52D6E]">
                  Hemat {discount}%
                </span>
              )}
            </div>

            {/* Interactive Add To Cart Section */}
            <AddToCartSection product={product} />

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2.5 pt-3">
              {[
                { icon: Shield, label: 'Garansi Ori' },
                { icon: Truck, label: 'Gratis Ongkir' },
                { icon: RefreshCw, label: 'Retur 30 Hari' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bento-card flex flex-col items-center gap-1.5 p-3 text-center !shadow-none">
                  <Icon className="h-4 w-4 text-[#0A0A0A]" />
                  <span className="text-[9px] font-display font-bold uppercase tracking-wider text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Tabs ─────────────────────────────────────────────────── */}
        <ProductTabs product={product} />
      </div>
    </div>
  );
}
