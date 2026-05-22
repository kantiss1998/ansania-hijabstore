'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { ROUTES } from '@/constants/routes';

export default function CartPage() {
  const router = useRouter();
  const openDrawer = useCartStore((state) => state.openDrawer);

  useEffect(() => {
    // Pada arsitektur aplikasi ini, Keranjang menggunakan sistem Drawer (Slide Over).
    // Jika user mengakses URL /cart secara langsung, kita akan membuka drawer dan meredirect ke background home/produk.
    openDrawer();
    router.replace(ROUTES.PRODUCTS);
  }, [openDrawer, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-gray-500 animate-pulse">Membuka keranjang Anda...</p>
    </div>
  );
}
