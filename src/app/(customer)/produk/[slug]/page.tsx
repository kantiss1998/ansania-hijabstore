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
      <div className="border-b border-gray-100 py-3">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href={ROUTES.HOME} className="hover:text-primary-600 transition-colors">Beranda</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={ROUTES.PRODUCTS} className="hover:text-primary-600 transition-colors">Produk</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-main py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ─── Gallery ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 group">
              <img
                src={images[activeImage]?.url}
                alt={images[activeImage]?.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 badge bg-gradient-to-r from-red-500 to-primary-500 text-white font-black text-sm shadow-lg">
                  -{discount}%
                </div>
              )}
              {product.flashSalePrice && (
                <div className="absolute top-4 left-4 badge bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  Flash Sale
                </div>
              )}
              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {images.map((img: any, i: number) => (
                <button
                  key={img.id || i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                    i === activeImage ? 'border-primary-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
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
                className="badge-primary text-xs"
              >
                {product.category?.name || 'Uncategorized'}
              </Link>
              {product.isNew && <span className="badge bg-blue-100 text-blue-700 text-xs">New</span>}
              {product.isFeatured && <span className="badge bg-amber-100 text-amber-700 text-xs">Best Seller</span>}
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn('h-5 w-5', i < Math.floor(product.ratingAverage || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-900">{Number(product.ratingAverage || 0).toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({product.totalReviews || 0} ulasan)</span>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <BadgeCheck className="h-4 w-4" />
                <span className="font-medium">Terverifikasi</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-primary-600">
                {formatCurrency(product.flashSalePrice ?? price)}
              </span>
              {comparePrice && (
                <span className="text-lg text-gray-400 line-through">{formatCurrency(comparePrice)}</span>
              )}
              {discount > 0 && (
                <span className="badge bg-red-100 text-red-600 font-black">Hemat {discount}%</span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {stockStatus === 'out_of_stock' || stock < 1 ? (
                <span className="badge-danger">Stok Habis</span>
              ) : stockStatus === 'low_stock' ? (
                <span className="badge-warning">⚠️ Stok Terbatas — {stock} tersisa</span>
              ) : (
                <span className="badge-success">✓ Stok Tersedia ({stock} pcs)</span>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Pilih Varian:{' '}
                  <span className="text-primary-600">
                    {selectedVariant?.sku || 'Terpilih'}
                  </span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant: any) => {
                    const isOut = variant.stock < 1;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        disabled={isOut}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all',
                          selectedVariantId === variant.id
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300',
                          isOut && 'opacity-40 cursor-not-allowed line-through'
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
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Jumlah</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-all active:scale-90"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900 text-lg tabular-nums">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(stock, q + 1))}
                    disabled={qty >= stock}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">Maks. {stock} pcs</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={stockStatus === 'out_of_stock' || stock < 1}
                className="flex-1 btn-primary rounded-2xl py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                Tambah ke Keranjang
              </button>
              <button
                onClick={() => { toggle(product.id); toast.success(wishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist'); }}
                className={cn(
                  'w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all',
                  wishlisted ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-500'
                )}
                aria-label="Wishlist"
              >
                <Heart className={cn('h-5 w-5', wishlisted && 'fill-current')} />
              </button>
              <button className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-all" aria-label="Bagikan">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Buy Now */}
            {stockStatus !== 'out_of_stock' && stock > 0 && (
              <Link
                href={ROUTES.CHECKOUT}
                className="block w-full text-center py-4 rounded-2xl border-2 border-primary-500 text-primary-600 font-bold text-base hover:bg-primary-50 transition-all"
              >
                Beli Sekarang
              </Link>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, label: 'Garansi Ori' },
                { icon: Truck, label: 'Gratis Ongkir' },
                { icon: RefreshCw, label: 'Retur 30 Hari' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl text-center">
                  <Icon className="h-5 w-5 text-primary-600" />
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Tabs ─────────────────────────────────────────────────── */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200 mb-8">
            {([
              { key: 'desc', label: 'Deskripsi' },
              { key: 'spec', label: 'Spesifikasi' },
              { key: 'review', label: `Ulasan (${product.totalReviews || 0})` },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-6 py-3.5 text-sm font-semibold border-b-2 transition-all -mb-px',
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'desc' && (
            <div
              className="prose prose-gray max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: product.description || 'Tidak ada deskripsi.' }}
            />
          )}

          {activeTab === 'spec' && product.specifications && (
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val]: any, i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-semibold text-gray-700 w-48">{key}</td>
                      <td className="px-6 py-4 text-gray-600">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">{Number(product.ratingAverage || 0).toFixed(1)}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn('h-6 w-6', i < Math.floor(product.ratingAverage || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
                ))}
              </div>
              <p className="text-gray-500">dari {product.totalReviews || 0} ulasan</p>
              <p className="text-sm text-gray-400 mt-4">API Review belum terintegrasi secara penuh.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
