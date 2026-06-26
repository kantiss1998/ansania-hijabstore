'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import toast from 'react-hot-toast';
import type { ProductDetail } from '@/types/product.types';
import { useTranslation } from '@/contexts/LanguageContext';

interface AddToCartSectionProps {
  product: ProductDetail;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { locale, t } = useTranslation();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  const { addItem, openDrawer } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  useEffect(() => {
    if (product.variants && product.variants.length > 0 && selectedVariantId === null) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product.variants, selectedVariantId]);

  useEffect(() => {
    if (selectedVariantId !== null) {
      const event = new CustomEvent('variant-changed', { detail: { variantId: selectedVariantId } });
      window.dispatchEvent(event);
    }
  }, [selectedVariantId]);

  const wishlisted = isWishlisted(product.id);

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId) ?? product.variants?.[0];
  const price = selectedVariant?.price ?? product.price;
  const stock = selectedVariant?.stock ?? 0;
  const stockStatus = selectedVariant?.stockStatus ?? product.stockStatus;

  const handleAddToCart = () => {
    if (stockStatus === 'out_of_stock' || stock < 1) return;
    const variantName = selectedVariant?.options && selectedVariant.options.length > 0 
      ? selectedVariant.options.map(o => o.value).join(' - ') 
      : selectedVariant?.sku ?? 'Default';

    addItem({
      id: selectedVariant?.id ?? product.id,
      productId: product.id,
      variantId: selectedVariant?.id ?? 0,
      productName: product.name,
      productSlug: product.slug,
      variantName,
      thumbnailUrl: product.thumbnailUrl,
      price,
      qty,
      maxQty: stock,
    });
    openDrawer();
    toast.success(locale === 'id' ? 'Produk ditambahkan ke keranjang!' : 'Product added to cart!');
  };

  const handleBuyNow = () => {
    if (stockStatus === 'out_of_stock' || stock < 1) return;
    const variantName = selectedVariant?.options && selectedVariant.options.length > 0 
      ? selectedVariant.options.map(o => o.value).join(' - ') 
      : selectedVariant?.sku ?? 'Default';

    addItem({
      id: selectedVariant?.id ?? product.id,
      productId: product.id,
      variantId: selectedVariant?.id ?? 0,
      productName: product.name,
      productSlug: product.slug,
      variantName,
      thumbnailUrl: product.thumbnailUrl,
      price,
      qty,
      maxQty: stock,
    });
    router.push(ROUTES.CHECKOUT);
  };

  return (
    <div className="space-y-6">
      {/* Stock Status */}
      <div>
        {stockStatus === 'out_of_stock' || stock < 1 ? (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-display font-black uppercase bg-red-150 text-red-700">{t('stockOut')}</span>
        ) : stockStatus === 'low_stock' ? (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-display font-black uppercase bg-amber-100 text-amber-700">⚠️ {t('stockLimited')} — {stock} Pcs</span>
        ) : (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-display font-black uppercase bg-green-100 text-green-700">✓ {t('stockReady')} ({stock} Pcs)</span>
        )}
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="pt-2 border-t border-black/[0.06]">
          <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mb-3">
            {t('selectVariant')}:{' '}
            <span className="text-[#F52D6E]">
              {selectedVariant?.options && selectedVariant.options.length > 0 
                ? selectedVariant.options.map(o => o.value).join(' - ') 
                : selectedVariant?.sku || (locale === 'id' ? 'Terpilih' : 'Selected')}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const isOut = variant.stock < 1;
              return (
                <button
                   key={variant.id}
                   onClick={() => {
                     setSelectedVariantId(variant.id);
                     setQty(1); // reset qty on variant change
                   }}
                   disabled={isOut}
                   className={cn(
                     'flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-display font-bold uppercase tracking-wider transition-all cursor-pointer',
                     selectedVariantId === variant.id
                       ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white font-black'
                       : 'border-black/10 text-gray-700 hover:border-black/25',
                     isOut && 'opacity-30 cursor-not-allowed line-through'
                   )}
                >
                  {variant.options && variant.options.length > 0 
                    ? variant.options.map(o => o.value).join(' - ') 
                    : variant.sku}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="pt-2 border-t border-black/[0.06]">
        <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mb-3">{t('quantity')}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border border-black/[0.08] rounded-xl p-1 bg-white">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 transition-all active:scale-90 cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center font-display font-bold text-gray-900 text-sm tabular-nums">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(stock, q + 1))}
              disabled={qty >= stock}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-xs text-gray-400 font-body">{locale === 'id' ? 'Maks.' : 'Max.'} {stock} pcs</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-2.5 pt-4 border-t border-black/[0.06]">
        <button
          onClick={handleAddToCart}
          disabled={stockStatus === 'out_of_stock' || stock < 1}
          className="btn-pill-brand flex-1 h-12 disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          <ShoppingCart className="h-4 w-4" />
          {t('addToCart')}
        </button>
        <button
          onClick={() => {
            toggle(product.id);
            toast.success(
              wishlisted
                ? (locale === 'id' ? 'Dihapus dari wishlist' : 'Removed from wishlist')
                : (locale === 'id' ? 'Ditambahkan ke wishlist' : 'Added to wishlist')
            );
          }}
          className={cn(
            'w-12 h-12 flex items-center justify-center rounded-xl border transition-all cursor-pointer',
            wishlisted ? 'border-[#F52D6E] bg-[#F52D6E]/5 text-[#F52D6E]' : 'border-black/10 text-gray-500 hover:border-black/25 hover:text-[#F52D6E]'
          )}
          aria-label={locale === 'id' ? 'Wishlist' : 'Wishlist'}
        >
          <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-black/10 text-gray-500 hover:border-black/25 transition-all cursor-pointer" aria-label={locale === 'id' ? 'Bagikan' : 'Share'}>
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Buy Now */}
      {stockStatus !== 'out_of_stock' && stock > 0 && (
        <button
          onClick={handleBuyNow}
          className="flex w-full items-center justify-center h-12 rounded-full border-2 border-dark text-dark font-display font-bold text-sm hover:bg-dark hover:text-white transition-all duration-300 cursor-pointer"
        >
          {t('buyNow')}
        </button>
      )}
    </div>
  );
}
