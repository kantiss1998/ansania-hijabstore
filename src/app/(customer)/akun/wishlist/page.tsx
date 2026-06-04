'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts } from '@/services/api/products';
import { ProductCard } from '@/components/shared/ProductCard';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Loader2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { AccountPageHeader } from '@/components/customer/AccountPageHeader';
import type { ProductListItem } from '@/types/product.types';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const productIds = useWishlistStore((state) => state.productIds);

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        const { data } = await getProducts({ limit: 100 });
        const items = data.filter((p) => productIds.has(p.id));
        setWishlist(items);
      } catch {
        toast.error('Gagal memuat wishlist');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWishlist();
  }, [productIds]);



  return (
    <div>
      <AccountPageHeader
        title="Wishlist"
        description="Produk favorit yang kamu simpan."
      />

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-primary-100 bg-primary-50/20 p-8">
          <Heart className="h-10 w-10 text-primary-300 mx-auto mb-4" />
          <h3 className="font-display font-black text-sm text-dark">Wishlist kosong</h3>
          <p className="text-xs text-gray-500 font-body mt-2 max-w-sm mx-auto">
            Simpan produk favorit kamu di sini.
          </p>
          <Link
            href="/produk"
            className="btn-pill-brand inline-flex mt-6 h-11 px-8 text-xs"
          >
            Eksplorasi Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {wishlist.map((item) => (
            // Asumsi item mengembalikan object yang didalamnya ada 'product'
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
