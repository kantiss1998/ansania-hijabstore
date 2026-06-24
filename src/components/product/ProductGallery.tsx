'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types/product.types';

interface ProductGalleryProps {
  images: ProductImage[];
  discount: number;
  flashSalePrice?: number;
  productName: string;
}

export function ProductGallery({ images, discount, flashSalePrice, productName }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  const validImages = (images || []).filter(img => img && img.url && img.url.trim() !== '');

  const displayImages = validImages.length > 0 
    ? validImages 
    : [{ id: 1, url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop', alt: productName } as ProductImage];

  useEffect(() => {
    const handleVariantChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ variantId: number }>;
      const variantId = customEvent.detail?.variantId;
      if (variantId) {
        // Find index of image that is assigned to this variant
        const idx = displayImages.findIndex(img => img.variant_id === variantId || img.variantId === variantId);
        if (idx !== -1) {
          setActiveImage(idx);
        }
      }
    };

    window.addEventListener('variant-changed', handleVariantChange);
    return () => {
      window.removeEventListener('variant-changed', handleVariantChange);
    };
  }, [displayImages]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] rounded-4xl overflow-hidden bg-primary-50/40 border border-primary-100/80 group shadow-[0_20px_60px_-32px_rgba(245,45,110,0.25)]">
        <Image
          src={displayImages[activeImage]?.url}
          alt={displayImages[activeImage]?.alt || productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          priority
        />
        {discount > 0 && (
          <div className="absolute top-4 left-4 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-display font-black uppercase tracking-wider bg-red-600 text-white shadow-sm">
            -{discount}%
          </div>
        )}
        {flashSalePrice && (
          <div className="absolute top-4 left-4 inline-flex items-center justify-center px-2.5 py-1 rounded text-[10px] font-display font-black uppercase tracking-wider bg-primary-600 text-white shadow-sm gap-1">
            <Zap className="h-3 w-3 fill-white" />
            Flash Sale
          </div>
        )}
        {/* Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveImage((i) => (i - 1 + displayImages.length) % displayImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-black/10 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveImage((i) => (i + 1) % displayImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-black/10 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
          {displayImages.map((img, i: number) => (
            <button
              key={img.id || i}
              onClick={() => setActiveImage(i)}
              className={cn(
                'flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border transition-all cursor-pointer',
                i === activeImage ? 'border-[#0A0A0A]' : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || productName}
                width={64}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
