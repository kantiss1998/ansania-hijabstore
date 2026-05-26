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
      imageUrl: 'https://images.unsplash.com/photo-1515347619362-e64e9e42d765?q=80&w=800&auto=format&fit=crop',
      productCount: 42,
    },
    {
      id: 2,
      name: 'Tunik',
      slug: 'tunik',
      description: 'Atasan tunik elegan',
      imageUrl: 'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?q=80&w=800&auto=format&fit=crop',
      productCount: 28,
    },
    {
      id: 3,
      name: 'Hijab',
      slug: 'hijab',
      description: 'Koleksi hijab premium',
      imageUrl: 'https://images.unsplash.com/photo-1589810635656-3c28549aa669?q=80&w=800&auto=format&fit=crop',
      productCount: 56,
    },
    {
      id: 4,
      name: 'Setelan',
      slug: 'setelan',
      description: 'Set pakaian wanita',
      imageUrl: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
      productCount: 19,
    },
    {
      id: 5,
      name: 'Aksesoris',
      slug: 'aksesoris',
      description: 'Bros dan aksesoris lainnya',
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      productCount: 34,
    },
  ];
};
