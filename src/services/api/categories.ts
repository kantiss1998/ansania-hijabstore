import { api } from '@/lib/api';
import type { Category } from '@/types/product.types';

/* --- ORIGINAL API IMPLEMENTATION ---
export const getCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data;
};
------------------------------------- */

// Mock Implementation
export const getCategories = async (): Promise<Category[]> => {
  return [
    {
      id: 1,
      name: 'Gamis',
      slug: 'gamis',
      description: 'Koleksi busana muslim wanita terbaru',
      productCount: 42,
    },
    {
      id: 2,
      name: 'Tunik',
      slug: 'tunik',
      description: 'Atasan tunik elegan',
      productCount: 28,
    },
    {
      id: 3,
      name: 'Hijab',
      slug: 'hijab',
      description: 'Koleksi hijab premium',
      productCount: 56,
    },
    {
      id: 4,
      name: 'Setelan',
      slug: 'setelan',
      description: 'Set pakaian wanita',
      productCount: 19,
    },
    {
      id: 5,
      name: 'Aksesoris',
      slug: 'aksesoris',
      description: 'Bros dan aksesoris lainnya',
      productCount: 34,
    },
  ];
};
