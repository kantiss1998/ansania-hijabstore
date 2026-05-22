import { api } from '@/lib/api';

/* --- ORIGINAL API IMPLEMENTATION ---
export const getUserProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.put('/users/profile', data);
  return res.data;
};

export const getUserAddresses = async () => {
  const { data } = await api.get('/users/addresses');
  return data.data;
};

export const getWishlist = async () => {
  const { data } = await api.get('/users/wishlist');
  return data.data;
};

export const toggleWishlist = async (productId: number) => {
  const { data } = await api.post('/users/wishlist/toggle', { product_id: productId });
  return data;
};
------------------------------------- */

// Mock Implementation
export const getUserProfile = async () => {
  return {
    id: 1,
    name: 'Budi Santoso',
    email: 'budi@example.com',
    phone: '081234567890',
  };
};

export const updateProfile = async (data: any) => {
  return { success: true, message: 'Profile updated' };
};

export const getUserAddresses = async () => {
  return [
    {
      id: 1,
      recipient_name: 'Budi Santoso',
      phone: '081234567890',
      full_address: 'Jl. Jend. Sudirman Kav 21, Apartemen Senayan Lt 10 No 5',
      district: 'Kebayoran Baru',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postal_code: '12190',
      is_primary: true
    }
  ];
};

export const getWishlist = async () => {
  return [
    {
      id: 1,
      product: {
        id: 1,
        name: 'Gamis Syari Khadijah',
        slug: 'gamis-syari-khadijah',
        price: 350000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop',
        category: { name: 'Gamis' }
      }
    }
  ];
};

export const toggleWishlist = async (productId: number) => {
  return { success: true };
};

export const updateUserProfile = async (data: any) => {
  return { success: true, message: 'Profile updated' };
};

export const deleteAddress = async (id: number) => {
  return { success: true, message: 'Address deleted' };
};
