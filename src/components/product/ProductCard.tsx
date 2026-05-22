'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { type FC } from 'react';
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

const STOCK_BADGE: Record<string, { label: string; className: string }> = {
  low_stock: { label: 'Stok Terbatas', className: 'bg-amber-100 text-amber-700' },
  out_of_stock: { label: 'Habis', className: 'bg-red-100 text-red-700' },
};

const ProductCard: FC<Props> = ({ product, className }) => {
  const { addItem, openDrawer } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const discount = product.comparePrice
    ? getDiscountPercent(product.comparePrice, product.flashSalePrice ?? product.price)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stockStatus === 'out_of_stock') return;
    addItem({
      id: product.id,
      productId: product.id,
      variantId: 0,
      productName: product.name,
      productSlug: product.slug,
      variantName: 'Default',
      thumbnailUrl: product.thumbnailUrl,
      price: product.flashSalePrice ?? product.price,
      qty: 1,
      maxQty: 99,
    });
    openDrawer();
    toast.success(`${product.name} ditambahkan ke keranjang!`, { duration: 2000 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
    toast.success(
      wishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist',
      { duration: 1500 }
    );
  };

  return (
    <Link
      href={ROUTES.PRODUCT(product.slug)}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 hover:border-primary-200',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="badge bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
              New
            </span>
          )}
          {product.isFeatured && !product.isNew && (
            <span className="badge bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
              Best Seller
            </span>
          )}
          {product.flashSalePrice && (
            <span className="badge bg-gradient-to-r from-red-500 to-primary-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Zap className="h-2.5 w-2.5" />
              Flash Sale
            </span>
          )}
          {discount > 0 && !product.flashSalePrice && (
            <span className="badge bg-red-500 text-white text-[10px] font-black shadow-lg">
              -{discount}%
            </span>
          )}
        </div>

        {/* Stock badge */}
        {product.stockStatus !== 'in_stock' && STOCK_BADGE[product.stockStatus] && (
          <div className="absolute top-3 right-12 z-10">
            <span className={cn('badge text-[10px]', STOCK_BADGE[product.stockStatus].className)}>
              {STOCK_BADGE[product.stockStatus].label}
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm shadow-md transition-all hover:scale-110 active:scale-95',
            wishlisted
              ? 'bg-primary-500 text-white'
              : 'bg-white/90 text-gray-500 hover:bg-primary-50 hover:text-primary-500 opacity-0 group-hover:opacity-100'
          )}
          aria-label={wishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
        >
          <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
        </button>

        {/* Product Image */}
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Hover Action */}
        {product.stockStatus !== 'out_of_stock' && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-20">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/95 backdrop-blur-sm text-gray-900 font-semibold rounded-2xl shadow-lg hover:bg-gradient-primary hover:text-white transition-all duration-200 border-none text-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Tambah ke Keranjang
            </button>
          </div>
        )}

        {/* Out of stock overlay */}
        {product.stockStatus === 'out_of_stock' && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-gray-900/80 text-white text-sm font-bold px-4 py-2 rounded-full">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <p className="text-xs text-primary-500 font-semibold mb-1">{product.category.name}</p>

        {/* Name */}
        <h3 className="line-clamp-2 font-bold text-gray-900 text-sm leading-snug group-hover:text-primary-700 transition-colors font-heading mb-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < Math.floor(product.ratingAverage)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200 fill-gray-200'
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-500">
            ({product.totalReviews})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          {product.flashSalePrice ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-black text-red-600">
                {formatCurrency(product.flashSalePrice)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-black bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
