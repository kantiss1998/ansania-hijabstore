import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
}

export function formatRelativeTime(dateString: string | Date): string {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: id,
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function getDiscountPercent(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function extractVariantColor(variantName: string, sku: string): string {
  if (!variantName) return sku;
  const parts = variantName.split(/[-|]/).map(p => p.trim());
  if (parts.length <= 1) return variantName;
  
  let lastIdx = parts.length - 1;
  const isGeneric = (str: string) => {
    const s = str.toLowerCase();
    return s.includes('hijab') || 
           s.includes('kerudung') || 
           s.includes('segiempat') || 
           s.includes('segi empat') || 
           s.includes('mystery box') || 
           s.includes('mistery box') || 
           s.includes('scarf') || 
           s.includes('scarves') || 
           s.includes('syamila') || 
           s.includes('bella') || 
           s.includes('olla') || 
           s.includes('bella butik') || 
           /^\d+\s*x\s*\d+$/.test(s);
  };
  
  while (lastIdx > 0 && isGeneric(parts[lastIdx])) {
    lastIdx--;
  }
  
  let result = parts[lastIdx];
  if (lastIdx === 0 && parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    if (!/^\d+\s*x\s*\d+$/.test(lastPart.toLowerCase()) && !lastPart.toLowerCase().includes('kerudung')) {
      return lastPart;
    }
    return parts[1];
  }
  return result || sku;
}

export function mapUserToFrontend(u: any): any {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    avatarUrl: u.avatarUrl || u.avatar_url,
    isEmailVerified: u.isEmailVerified !== undefined ? u.isEmailVerified : (u.email_verified_at !== null && u.email_verified_at !== undefined),
    createdAt: u.createdAt || u.created_at,
    gender: u.gender,
    birthDate: u.birthDate || u.birth_date,
    stylePreference: u.stylePreference || u.style_preference,
    sizePreference: u.sizePreference || u.size_preference,
    loyaltyPoints: u.loyaltyPoints !== undefined ? u.loyaltyPoints : (u.loyalty_points ?? 0),
    loyaltyTier: u.loyaltyTier || u.loyalty_tier || 'BRONZE',
    ordersCount: u.ordersCount !== undefined ? u.ordersCount : (u.orders_count ?? 0),
    wishlistCount: u.wishlistCount !== undefined ? u.wishlistCount : (u.wishlist_count ?? 0),
    vouchersCount: u.vouchersCount !== undefined ? u.vouchersCount : (u.vouchers_count ?? 0),
  };
}

