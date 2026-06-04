import { api } from '@/lib/api';
import type { Category } from '@/types/product.types';

interface BackendCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  imageUrl?: string;
  productCount?: number;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  const categories: BackendCategory[] = data.data || data;
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    imageUrl: cat.image_url || cat.imageUrl || '',
    productCount: cat.productCount || 0
  }));
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const { data } = await api.get(`/categories/${slug}`);
  const cat: BackendCategory = data.data || data;
  if (!cat) return null;
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    imageUrl: cat.image_url || cat.imageUrl || '',
    productCount: cat.productCount || 0
  };
};
