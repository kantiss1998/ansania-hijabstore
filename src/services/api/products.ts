import { api } from '@/lib/api';
import type { ProductDetail, ProductFilter, ProductListItem } from '@/types/product.types';

interface BackendProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: number | boolean;
  sort_order: number;
}

interface BackendProductVariantAttr {
  attr_name: string;
  attr_value: string;
}

interface BackendProductVariant {
  id: number;
  sku: string;
  price: string | number;
  stock: number;
  attrs?: BackendProductVariantAttr[];
}

interface BackendProduct {
  id: number;
  name: string;
  slug: string;
  min_price?: number;
  price?: number;
  compare_price?: number;
  base_compare_price?: number;
  primary_image?: string;
  thumbnailUrl?: string;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  category?: { id: number; name: string; slug: string; description?: string; imageUrl?: string };
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  ratingAverage?: number;
  totalReviews?: number;
  is_featured?: number | boolean;
  isNew?: boolean;
  description?: string;
  images?: BackendProductImage[];
  variants?: BackendProductVariant[];
  rating_summary?: { rating_avg: number; total_reviews: number };
}

export const getProducts = async (params?: ProductFilter): Promise<{ data: ProductListItem[], meta: { total: number, lastPage: number } }> => {
  const { data } = await api.get('/products', { params });
  const list: BackendProduct[] = data.data || [];
  const meta = data.meta || { total: 0, totalPages: 1 };
  
  const formattedData: ProductListItem[] = list.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.min_price || p.price || 0),
    comparePrice: p.base_compare_price ? Number(p.base_compare_price) : undefined,
    thumbnailUrl: p.primary_image || p.thumbnailUrl || '',
    category: {
      id: p.category_id || p.category?.id || 0,
      name: p.category_name || p.category?.name || 'Kategori',
      slug: p.category_slug || p.category?.slug || 'kategori',
    },
    stockStatus: p.stockStatus || 'in_stock',
    ratingAverage: p.ratingAverage || 5,
    totalReviews: p.totalReviews || 0,
    isFeatured: p.is_featured === 1 || p.is_featured === true,
    isNew: p.isNew || false
  }));

  return {
    data: formattedData,
    meta: {
      total: meta.total,
      lastPage: meta.totalPages || 1
    }
  };
};

export const getProductBySlug = async (slug: string): Promise<ProductDetail> => {
  const { data } = await api.get(`/products/${slug}`);
  const p: BackendProduct = data.data || data;
  
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.variants?.[0]?.price || p.price || 0),
    comparePrice: p.compare_price ? Number(p.compare_price) : undefined,
    thumbnailUrl: p.images?.find((img) => img.is_primary === 1 || img.is_primary === true)?.url || p.thumbnailUrl || '',
    category: p.category || { id: 0, name: 'Kategori', slug: 'kategori' },
    stockStatus: p.stockStatus || 'in_stock',
    ratingAverage: p.rating_summary?.rating_avg || p.ratingAverage || 5,
    totalReviews: p.rating_summary?.total_reviews || p.totalReviews || 0,
    isFeatured: p.is_featured === 1 || p.is_featured === true,
    isNew: p.isNew || false,
    description: p.description || '',
    images: (p.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt_text || p.name,
      isPrimary: img.is_primary === 1 || img.is_primary === true,
      sortOrder: img.sort_order || 0
    })),
    variants: (p.variants || []).map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price),
      stock: v.stock,
      stockStatus: v.stock > 0 ? ('in_stock' as const) : ('out_of_stock' as const),
      options: (v.attrs || []).map((a, idx) => ({
        id: idx + 1,
        name: a.attr_name,
        value: a.attr_value
      }))
    }))
  };
};

export const getFeaturedProducts = async (): Promise<ProductListItem[]> => {
  const { data } = await api.get('/products', { params: { is_featured: 'true' } });
  const list: BackendProduct[] = data.data || data || [];
  return list.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.min_price || p.price || 0),
    comparePrice: p.base_compare_price ? Number(p.base_compare_price) : undefined,
    thumbnailUrl: p.primary_image || p.thumbnailUrl || '',
    category: {
      id: p.category_id || p.category?.id || 0,
      name: p.category_name || p.category?.name || 'Kategori',
      slug: p.category_slug || p.category?.slug || 'kategori',
    },
    stockStatus: p.stockStatus || 'in_stock',
    ratingAverage: p.ratingAverage || 5,
    totalReviews: p.totalReviews || 0,
    isFeatured: p.is_featured === 1 || p.is_featured === true,
    isNew: p.isNew || false
  }));
};

export const getBrands = async () => {
  const { data } = await api.get('/brands');
  return data.data || data;
};

export const getBrandBySlug = async (slug: string) => {
  const { data } = await api.get(`/brands/${slug}`);
  return data.data || data;
};
