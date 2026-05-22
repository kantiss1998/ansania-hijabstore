// ─── Product Types ─────────────────────────────────────────────────────────

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductVariantOption {
  id: number;
  name: string;
  value: string;
  colorHex?: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  stockStatus: StockStatus;
  options: ProductVariantOption[];
  images?: string[];
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductBrand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string;
  price: number;
  comparePrice?: number;
  flashSalePrice?: number;
  flashSaleEndsAt?: string;
  ratingAverage: number;
  totalReviews: number;
  stockStatus: StockStatus;
  isFeatured: boolean;
  isNew: boolean;
  category: ProductCategory;
  brand?: ProductBrand;
  tags?: string[];
}

export interface ProductDetail extends ProductListItem {
  description: string;
  shortDescription?: string;
  specifications?: Record<string, string>;
  images: ProductImage[];
  variants: ProductVariant[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  iconName?: string;
  productCount: number;
  parentId?: number;
  children?: Category[];
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  position: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FlashSale {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  products: FlashSaleProduct[];
}

export interface FlashSaleProduct {
  id: number;
  product: ProductListItem;
  originalPrice: number;
  flashSalePrice: number;
  maxQty: number;
  soldQty: number;
}

// ─── API Response Types ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}

// ─── Product Filter ─────────────────────────────────────────────────────────

export interface ProductFilter {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'best_rating';
  isFeatured?: boolean;
  isNew?: boolean;
  page?: number;
  limit?: number;
}
