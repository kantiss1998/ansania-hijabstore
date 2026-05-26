// ─── User Types ────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
  gender?: 'female' | 'male' | 'other';
  birthDate?: string;
  stylePreference?: string;
  sizePreference?: string;
  loyaltyPoints?: number;
  loyaltyTier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  voucherCount?: number;
  wishlistCount?: number;
  orderCount?: number;
}

export interface Address {
  id: number;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  cityId: string;
  province: string;
  provinceId: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

// ─── Auth Types ────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phone?: string;
}

export interface AuthSession {
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl: string | null;
  };
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
}

// ─── Cart Types ─────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  productId: number;
  variantId: number;
  productName: string;
  productSlug: string;
  variantName: string;
  thumbnailUrl: string;
  price: number;
  qty: number;
  maxQty: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}
