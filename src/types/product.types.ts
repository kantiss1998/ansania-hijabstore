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
  variantId?: number | null;
  variant_id?: number | null;
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
  reviews?: Review[];
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

// ─── Admin specific and general entities ───────────────────────────────────

export interface AdminBrand {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  is_active: number;
  sort_order: number;
  product_count?: number;
}

export interface AdminBanner {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url: string;
  link_url?: string | null;
  position: string;
  sort_order?: number;
  is_active: number;
  starts_at?: string | null;
  ends_at?: string | null;
}

export interface Variant {
  id?: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  weight_gram: number;
  is_active: number | boolean;
  isNew?: boolean;
}

export interface ReviewMedia {
  id: number;
  url: string;
  type: string;
}

export interface ReviewReply {
  id: number;
  body: string;
  created_at: string;
  admin_name: string;
}

export interface Review {
  id: number;
  rating: number;
  title: string | null;
  body: string;
  reviewer_name: string;
  reviewer_avatar: string | null;
  created_at: string;
  media?: ReviewMedia[];
  reply?: ReviewReply | null;
  is_anonymous: boolean;
  helpful_count?: number;
}

export interface FlashSaleItem {
  id: number;
  flash_sale_id: number;
  variant_id: number;
  original_price: number;
  sale_price: number;
  discount_percent: number;
  quota: number;
  sold_count: number;
  is_active: number;
  sku: string;
  variant_name: string;
  product_name: string;
  primary_image?: string | null;
}

export interface AdminFlashSale {
  id: number;
  name: string;
  description?: string | null;
  banner_url?: string | null;
  starts_at: string;
  ends_at: string;
  is_active: number;
  items?: FlashSaleItem[];
}

export interface AdminCategory {
  id: number;
  name: string;
}

export interface AdminProductImage {
  id: number;
  url: string;
  is_primary: number;
  sort_order: number;
  variant_id?: number | null;
}
