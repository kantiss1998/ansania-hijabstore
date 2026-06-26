import { api, BACKEND_URL } from '@/lib/api';
import type { User, Address } from '@/types/user.types';
import { mapUserToFrontend } from '@/lib/utils';

interface BackendAddress {
  id: number;
  label?: string;
  recipient_name: string;
  phone: string;
  full_address: string;
  district?: string;
  city_name?: string;
  city?: string;
  city_id?: string | number;
  province_name?: string;
  province?: string;
  province_id?: string | number;
  postal_code: string;
  is_default?: number | boolean;
  is_primary?: number | boolean;
}

interface BackendWishlistItem {
  wishlist_id?: number;
  id?: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  min_price?: number;
  primary_image?: string;
}

// Translation Mappings
const mapAddressToFrontend = (addr: BackendAddress): Address => ({
  id: addr.id,
  label: addr.label || 'Alamat',
  recipientName: addr.recipient_name,
  phone: addr.phone,
  addressLine1: addr.full_address,
  addressLine2: addr.district || '',
  city: addr.city_name || addr.city || '',
  cityId: String(addr.city_id || ''),
  province: addr.province_name || addr.province || '',
  provinceId: String(addr.province_id || ''),
  postalCode: addr.postal_code,
  isDefault: addr.is_default === 1 || addr.is_default === true || addr.is_primary === 1 || addr.is_primary === true,
});

const mapAddressToBackend = (addr: Partial<Address> & Record<string, unknown>): Record<string, unknown> => ({
  label: addr.label || 'Utama',
  recipient_name: addr.recipientName || addr.recipient_name,
  phone: addr.phone,
  full_address: addr.addressLine1 || addr.full_address,
  district: addr.addressLine2 || addr.district || '',
  city_name: addr.city || addr.city_name || 'Kota',
  city_id: String(addr.cityId || addr.city_id || '0'),
  province_name: addr.province || addr.province_name || 'Provinsi',
  province_id: String(addr.provinceId || addr.province_id || '0'),
  postal_code: addr.postalCode || addr.postal_code,
  is_default: addr.isDefault === true || addr.is_default === 1 || addr.is_primary === true || addr.is_primary === 1 || false,
});

// Implementation
export const getUserProfile = async (): Promise<User> => {
  const { data } = await api.get('/users/me');
  return mapUserToFrontend(data.data);
};

export const updateProfile = async (data: Record<string, unknown>) => {
  const backendData = {
    name: data.name,
    phone: data.phone,
    avatar_url: data.avatarUrl || data.avatar_url
  };
  const res = await api.patch('/users/me', backendData);
  return res.data;
};

export const getUserAddresses = async (): Promise<Address[]> => {
  const { data } = await api.get('/users/me/addresses');
  const items: BackendAddress[] = data.data || data || [];
  return items.map(mapAddressToFrontend);
};

export const getWishlist = async () => {
  const { data } = await api.get('/wishlist');
  const items: BackendWishlistItem[] = data.data || data || [];
  return items.map((item) => ({
    id: item.wishlist_id || item.id,
    product_id: item.product_id,
    product: {
      id: item.product_id,
      name: item.product_name,
      slug: item.product_slug,
      price: item.min_price || 0,
      thumbnailUrl: item.primary_image ? (item.primary_image.startsWith('http') ? item.primary_image : `${BACKEND_URL}${item.primary_image}`) : '',
      category: { name: 'Kategori' }
    }
  }));
};

export const toggleWishlist = async (productId: number) => {
  const { data: resData } = await api.get('/wishlist');
  const items: BackendWishlistItem[] = resData.data || resData || [];
  const existing = items.find((item) => item.product_id === productId);
  if (existing) {
    const res = await api.delete(`/wishlist/${existing.wishlist_id || existing.id}`);
    return res.data;
  } else {
    const res = await api.post('/wishlist', { product_id: productId });
    return res.data;
  }
};

export const updateUserProfile = async (data: Record<string, unknown>) => {
  return updateProfile(data);
};

export const createAddress = async (data: Record<string, unknown>) => {
  const backendData = mapAddressToBackend(data);
  const res = await api.post('/users/me/addresses', backendData);
  return res.data;
};

export const updateAddress = async (id: number, data: Record<string, unknown>) => {
  const backendData = mapAddressToBackend(data);
  const res = await api.patch(`/users/me/addresses/${id}`, backendData);
  return res.data;
};

export const deleteAddress = async (id: number) => {
  const res = await api.delete(`/users/me/addresses/${id}`);
  return res.data;
};

export const setDefaultAddress = async (id: number) => {
  const res = await api.patch(`/users/me/addresses/${id}/set-default`);
  return res.data;
};

export const changePassword = async (data: Record<string, unknown>) => {
  const res = await api.patch('/users/me/password', {
    current_password: data.currentPassword || data.current_password,
    new_password: data.newPassword || data.new_password
  });
  return res.data;
};

export const deleteAccount = async () => {
  const res = await api.delete('/users/me');
  return res.data;
};
