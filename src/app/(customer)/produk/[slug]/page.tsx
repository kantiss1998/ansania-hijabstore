'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import {
  Star, Heart, ShoppingCart, Share2, Shield, Truck, RefreshCw,
  ChevronLeft, ChevronRight, Minus, Plus, Zap, BadgeCheck, Loader2
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { formatCurrency, getDiscountPercent, cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { getProductBySlug } from '@/services/api/products';
import toast from 'react-hot-toast';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage(props: Props) {
  const params = use(props.params);
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'review'>('desc');

  const { addItem, openDrawer } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductBySlug(params.slug);
        if (!data) {
          notFound();
        } else {
          setProduct(data);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariantId(data.variants[0].id);
          }
        }
      } catch (error) {
        toast.error('Gagal memuat produk');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!product) return notFound();

  const wishlisted = isWishlisted(product.id);

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId) ?? product.variants?.[0];
  const price = selectedVariant?.price ?? product.price;
  const comparePrice = selectedVariant?.comparePrice ?? product.comparePrice;
  const stock = selectedVariant?.stock ?? 0;
  const stockStatus = selectedVariant?.stockStatus ?? product.stockStatus;
  const discount = comparePrice ? getDiscountPercent(comparePrice, price) : 0;

  const handleAddToCart = () => {
    if (stockStatus === 'out_of_stock' || stock < 1) return;
    addItem({
      id: selectedVariant?.id ?? product.id,
      productId: product.id,
      variantId: selectedVariant?.id ?? 0,
      productName: product.name,
      productSlug: product.slug,
      variantName: selectedVariant?.sku ?? 'Default', // Bisa disesuaikan dengan response option name
      thumbnailUrl: product.thumbnailUrl,
      price,
      qty,
      maxQty: stock,
    });
    openDrawer();
    toast.success('Produk ditambahkan ke keranjang!');
  };

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ id: 1, url: product.thumbnailUrl || '/images/placeholder.jpg', alt: product.name }];

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
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-4xl overflow-hidden bg-primary-50/40 border border-primary-100/80 group shadow-[0_20px_60px_-32px_rgba(245,45,110,0.25)]">
              <img
                src={images[activeImage]?.url}
                alt={images[activeImage]?.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-display font-black uppercase tracking-wider bg-red-600 text-white shadow-sm">
                  -{discount}%
                </div>
              )}
              {product.flashSalePrice && (
                <div className="absolute top-4 left-4 inline-flex items-center justify-center px-2.5 py-1 rounded text-[10px] font-display font-black uppercase tracking-wider bg-primary-600 text-white shadow-sm gap-1">
                  <Zap className="h-3 w-3 fill-white" />
                  Flash Sale
                </div>
              )}
              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-black/10 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-black/10 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
              {images.map((img: any, i: number) => (
                <button
                  key={img.id || i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border transition-all',
                    i === activeImage ? 'border-[#0A0A0A]' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

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

            {/* Stock Status */}
            <div>
              {stockStatus === 'out_of_stock' || stock < 1 ? (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-display font-black uppercase bg-red-150 text-red-700">Stok Habis</span>
              ) : stockStatus === 'low_stock' ? (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-display font-black uppercase bg-amber-100 text-amber-700">⚠️ Stok Terbatas — {stock} Pcs</span>
              ) : (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-display font-black uppercase bg-green-100 text-green-700">✓ Stok Ready ({stock} Pcs)</span>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-2 border-t border-black/[0.06]">
                <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Pilih Varian:{' '}
                  <span className="text-[#F52D6E]">
                    {selectedVariant?.sku || 'Terpilih'}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => {
                    const isOut = variant.stock < 1;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        disabled={isOut}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-display font-bold uppercase tracking-wider transition-all cursor-pointer',
                          selectedVariantId === variant.id
                            ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white font-black'
                            : 'border-black/10 text-gray-700 hover:border-black/25',
                          isOut && 'opacity-30 cursor-not-allowed line-through'
                        )}
                      >
                        {variant.sku}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pt-2 border-t border-black/[0.06]">
              <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mb-3">Jumlah</p>
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
                <span className="text-xs text-gray-400 font-body">Maks. {stock} pcs</span>
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
                + Keranjang
              </button>
              <button
                onClick={() => { toggle(product.id); toast.success(wishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist'); }}
                className={cn(
                  'w-12 h-12 flex items-center justify-center rounded-xl border transition-all cursor-pointer',
                  wishlisted ? 'border-[#F52D6E] bg-[#F52D6E]/5 text-[#F52D6E]' : 'border-black/10 text-gray-500 hover:border-black/25 hover:text-[#F52D6E]'
                )}
                aria-label="Wishlist"
              >
                <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
              </button>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-black/10 text-gray-500 hover:border-black/25 transition-all cursor-pointer" aria-label="Bagikan">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Buy Now */}
            {stockStatus !== 'out_of_stock' && stock > 0 && (
              <Link
                href={ROUTES.CHECKOUT}
                className="flex w-full items-center justify-center h-12 rounded-full border-2 border-dark text-dark font-display font-bold text-sm hover:bg-dark hover:text-white transition-all duration-300"
              >
                Beli Sekarang
              </Link>
            )}

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
        <div className="mt-16">
          <div className="flex border-b border-black/[0.06] mb-8 overflow-x-auto scrollbar-hide">
            {([
              { key: 'desc', label: 'Deskripsi' },
              { key: 'spec', label: 'Spesifikasi' },
              { key: 'review', label: `Ulasan (${product.totalReviews || 0})` },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-6 py-3.5 text-xs font-display font-bold uppercase tracking-wider border-b-2 transition-all -mb-px whitespace-nowrap cursor-pointer',
                  activeTab === tab.key
                    ? 'border-[#0A0A0A] text-[#0A0A0A] font-black'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'desc' && (
            <div
              className="prose prose-gray max-w-none text-gray-700 font-body text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description || 'Tidak ada deskripsi.' }}
            />
          )}

          {activeTab === 'spec' && product.specifications && (
            <div className="overflow-hidden rounded-2xl border border-black/[0.06]">
              <table className="w-full text-xs font-body">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val]: any, i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                      <td className="px-6 py-4 font-semibold text-gray-700 w-48 border-r border-black/[0.03]">{key}</td>
                      <td className="px-6 py-4 text-gray-600">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="text-center py-16 bg-gray-50/30 border border-black/[0.05] rounded-2xl">
              <div className="text-6xl font-display font-black text-[#0A0A0A] mb-3 leading-none">{Number(product.ratingAverage || 0).toFixed(1)}</div>
              <div className="flex justify-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn('h-5 w-5', i < Math.floor(product.ratingAverage || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
                ))}
              </div>
              <p className="text-xs text-gray-400 font-body">dari {product.totalReviews || 0} ulasan terverifikasi</p>
              <p className="text-xs text-gray-300 font-body mt-4">API Review belum terintegrasi secara penuh.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
