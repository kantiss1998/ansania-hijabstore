'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWishlist, toggleWishlist } from '@/services/api/users';
import { ProductCard } from '@/components/shared/ProductCard';
import { Loader2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (error) {
      toast.error('Gagal memuat wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div>
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold font-heading text-gray-900">Wishlist Saya</h2>
        <p className="text-sm text-gray-500 mt-1">Daftar produk yang Anda simpan untuk dibeli nanti.</p>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 text-lg">Wishlist Kosong</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
            Anda belum menambahkan produk apapun ke wishlist. Temukan produk favorit Anda sekarang!
          </p>
          <Link href="/produk" className="btn-primary mt-6">
            Eksplorasi Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {wishlist.map((item) => (
            // Asumsi item mengembalikan object yang didalamnya ada 'product'
            <ProductCard key={item.id} product={item.product || item} />
          ))}
        </div>
      )}
    </div>
  );
}
