import { api } from '@/lib/api';
import type { Banner } from '@/types/product.types';

/* --- ORIGINAL API IMPLEMENTATION ---
export const getBanners = async () => {
  const { data } = await api.get('/banners');
  return data.data;
};
------------------------------------- */

// Mock Implementation
export const getBanners = async (): Promise<Banner[]> => {
  return [
    {
      id: 1,
      title: 'Koleksi Lebaran',
      imageUrl:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
      linkUrl: '/produk',
      position: 'home_hero',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 2,
      title: 'Promo Kemerdekaan',
      imageUrl:
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop',
      linkUrl: '/flash-sale',
      position: 'home_hero',
      sortOrder: 2,
      isActive: true,
    },
  ];
};
