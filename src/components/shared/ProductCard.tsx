'use client';

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { formatCurrency, getDiscountPercent } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openDrawer } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const price = product.price;
  const comparePrice = product.comparePrice;
  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stock < 1;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    
    addItem({
      id: product.variants?.[0]?.id || product.id,
      productId: product.id,
      variantId: product.variants?.[0]?.id || 0,
      productName: product.name,
      productSlug: product.slug,
      variantName: product.variants?.[0]?.sku || 'Default',
      thumbnailUrl: product.thumbnailUrl,
      price: product.flashSalePrice || price,
      qty: 1,
      maxQty: product.stock,
    });
    openDrawer();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
    toast.success(wishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
  };

  return (
    <Link href={ROUTES.PRODUCT(product.slug)} className="group block relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 mb-3">
        <img
          src={product.thumbnailUrl || '/images/placeholder.jpg'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {comparePrice && comparePrice > price && (
            <span className="badge bg-red-500 text-white font-black">
              -{getDiscountPercent(comparePrice, price)}%
            </span>
          )}
          {product.isNew && (
            <span className="badge bg-blue-500 text-white font-bold">Baru</span>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-gray-900 text-white font-bold px-4 py-2 rounded-full text-sm">
              Stok Habis
            </span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center gap-2">
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 bg-white/90 backdrop-blur text-primary-600 font-bold py-2.5 px-4 rounded-xl shadow-lg hover:bg-primary-600 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm">Beli</span>
          </button>
          <button 
            onClick={handleWishlist}
            className={`w-11 h-11 bg-white/90 backdrop-blur rounded-xl shadow-lg flex items-center justify-center transition-colors ${wishlisted ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:text-primary-600'}`}
          >
            <Heart className={`h-5 w-5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{product.category?.name || 'Kategori'}</p>
        <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-black text-primary-600">{formatCurrency(product.flashSalePrice || price)}</span>
          {comparePrice && (
            <span className="text-xs text-gray-400 line-through">{formatCurrency(comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
