'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Zap, TrendingUp } from 'lucide-react';
import { FC, useState, useEffect } from 'react';
import { type ProductListItem } from '@/types/product.types';
import { ROUTES } from '@/constants/routes';
import { formatCurrency, getDiscountPercent, cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import toast from 'react-hot-toast';

interface Props {
  product: ProductListItem;
  className?: string;
  priority?: boolean;
}

const getAltImages = (id: number, primary: string, categorySlug: string) => {
  const gamisPhotos = [
    'photo-1515347619362-e64e9e42d765',
    'photo-1609357605129-26f69add5d6e',
    'photo-1567538096630-e0c55bd6374c',
    'photo-1573496359142-b8d87734a5a2',
  ];
  const hijabPhotos = [
    'photo-1589810635656-3c28549aa669',
    'photo-1583391733956-3750e0ff4e8b',
    'photo-1607990283143-e81e7a2c93ab',
    'photo-1535632066927-ab7c9ab60908',
  ];

  const pool = categorySlug.toLowerCase() === 'gamis' ? gamisPhotos : hijabPhotos;
  const p1 = pool[id % pool.length];
  const p2 = pool[(id + 1) % pool.length];

  return [
    primary,
    `https://images.unsplash.com/photo-${p1}?q=80&w=800&auto=format&fit=crop`,
    `https://images.unsplash.com/photo-${p2}?q=80&w=800&auto=format&fit=crop`,
  ].filter((val, index, self) => self.indexOf(val) === index).slice(0, 3);
};

const ProductCard: FC<Props> = ({ product, className }) => {
  const { addItem, openDrawer } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const images = getAltImages(product.id, product.thumbnailUrl, product.category.slug || '');
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const staggerDelay = (product.id % 4) * 800;
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(intervalId);
    }, staggerDelay);

    return () => clearTimeout(timeoutId);
  }, [images.length, product.id]);

  const discount = product.flashSalePrice
    ? Math.round(((product.price - product.flashSalePrice) / product.price) * 100)
    : product.comparePrice
    ? getDiscountPercent(product.comparePrice, product.price)
    : 0;

  const displayPrice = product.flashSalePrice ?? product.price;
  const originalPrice = product.flashSalePrice ? product.price : product.comparePrice;
  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const isLowStock = product.stockStatus === 'low_stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      productId: product.id,
      variantId: 0,
      productName: product.name,
      productSlug: product.slug,
      variantName: 'Default',
      thumbnailUrl: product.thumbnailUrl,
      price: displayPrice,
      qty: 1,
      maxQty: 99,
    });
    openDrawer();
    toast.success('Ditambahkan ke keranjang!', { duration: 1800 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    toast.success(wishlisted ? 'Dihapus dari wishlist' : 'Masuk wishlist ❤️', { duration: 1400 });
  };

  return (
    <Link
      href={ROUTES.PRODUCT(product.slug)}
      className={cn(
        'group relative flex flex-col bg-white overflow-hidden rounded-xl border border-primary-100/80 transition-all duration-300',
        'hover:shadow-[0_16px_48px_-16px_rgba(245,45,110,0.28)] hover:border-primary-200 hover:-translate-y-1.5',
        isOutOfStock && 'opacity-70',
        className
      )}
    >
      {/* ── Image Area ── */}
      <div className="relative overflow-hidden bg-[#F8F8F8]" style={{ aspectRatio: '3/4' }}>

        {/* Slideshow indicator lines at the top */}
        {images.length > 1 && (
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-25 flex gap-1 w-[80%] max-w-[64px]">
            {images.map((_, idx) => (
              <div
                key={idx}
                className="h-[2px] flex-1 rounded-full overflow-hidden bg-white/30"
              >
                <div
                  className={cn(
                    "h-full bg-white transition-all duration-300",
                    idx === imgIndex ? "w-full" : "w-0"
                  )}
                />
              </div>
            ))}
          </div>
        )}

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {discount > 0 && (
            <span className="discount-badge shadow-sm">-{discount}%</span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-display font-black uppercase tracking-wider bg-[#0A0A0A] text-white">
              New
            </span>
          )}
          {product.isFeatured && !product.isNew && !product.flashSalePrice && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-display font-black uppercase tracking-wider bg-amber-500 text-white">
              <TrendingUp className="h-2 w-2" />
              Hot
            </span>
          )}
          {product.flashSalePrice && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-display font-black uppercase tracking-wider bg-primary-600 text-white">
              <Zap className="h-2 w-2 fill-white" />
              Sale
            </span>
          )}
        </div>

        {/* Low stock */}
        {isLowStock && (
          <div className="absolute top-2.5 right-10 z-10">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-display font-black uppercase bg-amber-100 text-amber-700">
              Terbatas
            </span>
          </div>
        )}

        {/* Wishlist — always visible */}
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-150 shadow-sm',
            wishlisted
              ? 'bg-primary-600 text-white shadow-primary-200'
              : 'bg-white text-gray-400 hover:text-primary-500'
          )}
          aria-label={wishlisted ? 'Hapus wishlist' : 'Simpan ke wishlist'}
        >
          <Heart className={cn('h-3.5 w-3.5', wishlisted && 'fill-current')} />
        </button>

        {/* Product image */}
        <div className="absolute inset-0">
          <Image
            src={images[imgIndex]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        {/* Add to Cart — slides up from bottom */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-2 translate-y-0 lg:translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-20">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1.5 h-10 rounded-2xl bg-dark text-white text-[10px] font-display font-bold uppercase tracking-wider hover:bg-primary-600 transition-colors"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              + Keranjang
            </button>
          </div>
        )}

        {/* Out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-[#0A0A0A]/80 text-white text-[11px] font-display font-black uppercase tracking-wide px-3 py-1.5 rounded-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── Info Area ── */}
      <div className="flex flex-1 flex-col p-3 gap-1">
        {/* Category */}
        <p className="text-[10px] font-display font-bold uppercase tracking-[0.1em] text-gray-400 truncate">
          {product.category.name}
        </p>

        {/* Name */}
        <h3 className="text-xs sm:text-[13px] font-body font-semibold text-[#0A0A0A] line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating row */}
        {product.totalReviews > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-2.5 w-2.5',
                    i < Math.floor(product.ratingAverage)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200 fill-gray-200'
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-body">({product.totalReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-1.5 flex items-baseline gap-1.5 flex-wrap">
          <span className={cn(
            'text-sm sm:text-base font-display font-black tracking-tight',
            product.flashSalePrice ? 'text-primary-600' : 'text-[#0A0A0A]'
          )}>
            {formatCurrency(displayPrice)}
          </span>
          {originalPrice && (
            <span className="text-[11px] text-gray-400 line-through font-body">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
