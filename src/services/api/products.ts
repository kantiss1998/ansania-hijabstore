import { api } from '@/lib/api';
import type { ProductDetail, ProductFilter, ProductListItem } from '@/types/product.types';

/* --- ORIGINAL API IMPLEMENTATION ---
export const getProducts = async (params?: any) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProductBySlug = async (slug: string) => {
  const { data } = await api.get(`/products/${slug}`);
  return data.data;
};

export const getFeaturedProducts = async () => {
  const { data } = await api.get('/products/featured');
  return data.data;
};
------------------------------------- */

// Mock Implementation
const dummyListProducts: ProductListItem[] = Array.from({ length: 24 }).map(
  (_, i) => {
    const isGamis = i % 2 === 0;
    return {
      id: i + 1,
      name: `Produk Fashion Muslim Premium ${i + 1}`,
      slug: `produk-fashion-muslim-premium-${i + 1}`,
      price: 250000 + i * 15000,
      comparePrice: i % 3 === 0 ? 400000 + i * 15000 : undefined,
      thumbnailUrl: `https://images.unsplash.com/photo-${isGamis ? '1515347619362-e64e9e42d765' : '1589810635656-3c28549aa669'}?q=80&w=800&auto=format&fit=crop`,
      category: {
        id: isGamis ? 1 : 3,
        name: isGamis ? 'Gamis' : 'Hijab',
        slug: isGamis ? 'gamis' : 'hijab',
      },
      stockStatus: i === 3 ? 'out_of_stock' : i === 5 ? 'low_stock' : 'in_stock',
      ratingAverage: 4.8,
      totalReviews: 150 + i * 10,
      isFeatured: i % 4 === 0,
      isNew: i < 5,
    };
  },
);

const dummyDetailProduct: ProductDetail = {
  ...dummyListProducts[0],
  description:
    'Desain eksklusif dengan bahan premium yang nyaman dipakai seharian. Potongan rapi dan elegan, cocok untuk berbagai acara.',
  images: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1515347619362-e64e9e42d765?q=80&w=800&auto=format&fit=crop',
      alt: 'Produk 1',
      isPrimary: true,
      sortOrder: 0,
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1589810635656-3c28549aa669?q=80&w=800&auto=format&fit=crop',
      alt: 'Produk 1 - 2',
      isPrimary: false,
      sortOrder: 1,
    },
  ],
  variants: [
    {
      id: 1,
      sku: 'BLK-01',
      price: dummyListProducts[0].price,
      stock: 10,
      stockStatus: 'in_stock',
      options: [{ id: 1, name: 'Warna', value: 'Hitam' }],
    },
    {
      id: 2,
      sku: 'NVY-01',
      price: dummyListProducts[0].price,
      stock: 15,
      stockStatus: 'in_stock',
      options: [{ id: 2, name: 'Warna', value: 'Navy' }],
    },
  ],
};

export const getProducts = async (params?: ProductFilter) => {
  let items = dummyListProducts;
  if (params?.q) {
    const term = params.q.toLowerCase().trim();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.name.toLowerCase().includes(term) ||
        p.category.slug.toLowerCase().includes(term),
    );
  }
  if (params?.isFeatured) {
    items = items.filter((p) => p.isFeatured);
  }
  if (params?.isNew) {
    items = items.filter((p) => p.isNew);
  }
  if (params?.sort === 'newest') {
    items = [...items].sort((a, b) => b.id - a.id);
  }
  const limit = params?.limit ?? 12;
  return {
    data: items.slice(0, limit),
    meta: {
      total: items.length,
      lastPage: Math.ceil(items.length / limit),
    },
  };
};

export const getProductBySlug = async (_slug: string): Promise<ProductDetail> => {
  return dummyDetailProduct;
};

export const getFeaturedProducts = async (): Promise<ProductListItem[]> => {
  return dummyListProducts.filter((p) => p.isFeatured).slice(0, 8);
};
