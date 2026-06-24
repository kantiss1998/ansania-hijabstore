import { api, BACKEND_URL } from '@/lib/api';
import type { ProductDetail, ProductFilter, ProductListItem } from '@/types/product.types';
import { extractVariantColor } from '@/lib/utils';

interface BackendProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: number | boolean;
  sort_order: number;
  variant_id?: number | null;
}

interface BackendProductVariantAttr {
  attr_name: string;
  attr_value: string;
}

interface BackendProductVariant {
  id: number;
  sku: string;
  name?: string;
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
  specifications?: any;
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
    thumbnailUrl: (() => {
      const img = p.primary_image || p.thumbnailUrl;
      return img ? (img.startsWith('http') ? img : `${BACKEND_URL}${img}`) : '';
    })(),
    category: {
      id: p.category_id || p.category?.id || 0,
      name: p.category_name || p.category?.name || 'Kategori',
      slug: p.category_slug || p.category?.slug || 'kategori',
    },
    stockStatus: p.stockStatus || 'in_stock',
    ratingAverage: p.ratingAverage || 5,
    totalReviews: p.totalReviews || 0,
    isFeatured: p.is_featured === 1 || p.is_featured === true,
    isNew: p.isNew || false,
    comparePrice: p.base_compare_price || p.compare_price ? Number(p.base_compare_price || p.compare_price) : undefined
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
    thumbnailUrl: (() => {
      const img = p.images?.find((img) => img.is_primary === 1 || img.is_primary === true)?.url || p.thumbnailUrl;
      return img ? (img.startsWith('http') ? img : `${BACKEND_URL}${img}`) : '';
    })(),
    category: p.category || { id: 0, name: 'Kategori', slug: 'kategori' },
    stockStatus: p.stockStatus || 'in_stock',
    ratingAverage: p.rating_summary?.rating_avg || p.ratingAverage || 5,
    totalReviews: p.rating_summary?.total_reviews || p.totalReviews || 0,
    isFeatured: p.is_featured === 1 || p.is_featured === true,
    isNew: p.isNew || false,
    comparePrice: p.base_compare_price || p.compare_price ? Number(p.base_compare_price || p.compare_price) : undefined,
    description: p.description || '',
    specifications: (() => {
      if (!p.specifications) return undefined;
      if (typeof p.specifications === 'string') {
        try {
          return JSON.parse(p.specifications);
        } catch {
          return undefined;
        }
      }
      return p.specifications as Record<string, string>;
    })(),
    images: (p.images || []).map((img) => ({
      id: img.id,
      url: img.url.startsWith('http') ? img.url : `${BACKEND_URL}${img.url}`,
      alt: img.alt_text || p.name,
      isPrimary: img.is_primary === 1 || img.is_primary === true,
      sortOrder: img.sort_order || 0,
      variantId: img.variant_id || null,
      variant_id: img.variant_id || null
    })),
    variants: (p.variants || []).map((v: any) => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price),
      comparePrice: v.compare_price ? Number(v.compare_price) : undefined,
      stock: v.stock,
      stockStatus: v.stock > 0 ? ('in_stock' as const) : ('out_of_stock' as const),
      options: (() => {
        if (v.attrs && v.attrs.length > 0) {
          return v.attrs.map((a: any, idx: number) => ({
            id: idx + 1,
            name: a.attr_name,
            value: a.attr_value
          }));
        }
        
        const colorName = extractVariantColor(v.name || '', v.sku);
        return [{
          id: 1,
          name: 'Warna',
          value: colorName
        }];
      })()
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
    thumbnailUrl: (() => {
      const img = p.primary_image || p.thumbnailUrl;
      return img ? (img.startsWith('http') ? img : `${BACKEND_URL}${img}`) : '';
    })(),
    category: {
      id: p.category_id || p.category?.id || 0,
      name: p.category_name || p.category?.name || 'Kategori',
      slug: p.category_slug || p.category?.slug || 'kategori',
    },
    stockStatus: p.stockStatus || 'in_stock',
    ratingAverage: p.ratingAverage || 5,
    totalReviews: p.totalReviews || 0,
    isFeatured: p.is_featured === 1 || p.is_featured === true,
    isNew: p.isNew || false,
    comparePrice: p.base_compare_price || p.compare_price ? Number(p.base_compare_price || p.compare_price) : undefined
  }));
};

export const getBrands = async () => {
  const { data } = await api.get('/brands');
  const list = data.data || data || [];
  return list.filter((b: any) => b.name?.toLowerCase() === 'ansania');
};

export const getBrandBySlug = async (slug: string) => {
  const { data } = await api.get(`/brands/${slug}`);
  return data.data || data;
};

export const getSearchSuggestions = async (q: string): Promise<string[]> => {
  if (!q.trim()) return [];
  const { data } = await api.get('/products/search-suggest', { params: { q } });
  return data.data || [];
};
