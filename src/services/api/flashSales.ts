import { api } from '@/lib/api';
import type { FlashSale } from '@/types/product.types';

/* --- ORIGINAL API IMPLEMENTATION ---
export const getActiveFlashSale = async () => {
  try {
    const { data } = await api.get('/flash-sales/active');
    return data.data;
  } catch (error) {
    return null;
  }
};
------------------------------------- */

// Mock Implementation
export const getActiveFlashSale = async (): Promise<FlashSale | null> => {
  return {
    id: 1,
    name: 'Mega Flash Sale',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(), // +24 hours
    products: [
      {
        id: 1,
        originalPrice: 350000,
        flashSalePrice: 150000,
        maxQty: 100,
        soldQty: 50,
        product: {
          id: 101,
          name: 'Gamis Syari Khadijah',
          slug: 'gamis-syari-khadijah',
          price: 150000,
          comparePrice: 350000,
          thumbnailUrl:
            'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop',
          category: { id: 1, name: 'Gamis', slug: 'gamis' },
          stockStatus: 'in_stock',
          ratingAverage: 4.8,
          totalReviews: 120,
          isFeatured: true,
          isNew: false,
        },
      },
      {
        id: 2,
        originalPrice: 275000,
        flashSalePrice: 120000,
        maxQty: 50,
        soldQty: 30,
        product: {
          id: 102,
          name: 'Tunik Aisyah Modern',
          slug: 'tunik-aisyah-modern',
          price: 120000,
          comparePrice: 275000,
          thumbnailUrl:
            'https://images.unsplash.com/photo-1550614000-4b95dd2457bf?q=80&w=1974&auto=format&fit=crop',
          category: { id: 2, name: 'Tunik', slug: 'tunik' },
          stockStatus: 'low_stock',
          ratingAverage: 4.9,
          totalReviews: 85,
          isFeatured: false,
          isNew: true,
        },
      },
      {
        id: 3,
        originalPrice: 85000,
        flashSalePrice: 45000,
        maxQty: 200,
        soldQty: 100,
        product: {
          id: 103,
          name: 'Pashmina Ceruty Babydoll',
          slug: 'pashmina-ceruty-babydoll',
          price: 45000,
          comparePrice: 85000,
          thumbnailUrl:
            'https://images.unsplash.com/photo-1589810635656-3c28549aa669?q=80&w=1974&auto=format&fit=crop',
          category: { id: 3, name: 'Hijab', slug: 'hijab' },
          stockStatus: 'in_stock',
          ratingAverage: 4.7,
          totalReviews: 210,
          isFeatured: false,
          isNew: false,
        },
      },
    ],
  };
};
