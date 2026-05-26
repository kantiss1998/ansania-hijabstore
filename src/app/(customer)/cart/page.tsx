'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { ROUTES } from '@/constants/routes';

export default function CartPage() {
  const router = useRouter();
  const openDrawer = useCartStore((state) => state.openDrawer);

  useEffect(() => {
    openDrawer();
    router.replace(ROUTES.PRODUCTS);
  }, [openDrawer, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 border border-primary-100">
        <ShoppingBag className="h-7 w-7 text-primary-500 animate-pulse" />
      </div>
      <p className="text-sm font-display font-bold text-dark">Membuka keranjang...</p>
      <p className="text-xs text-gray-400 font-body">Sebentar ya ✨</p>
    </div>
  );
}
