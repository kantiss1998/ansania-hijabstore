import { api } from '@/lib/api';
import type { User, UserRole } from '@/types/user.types';

const mockUser = (
  overrides: Pick<User, 'id' | 'name' | 'email' | 'role'> & Partial<User>,
): User => ({
  phone: '081234567890',
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  gender: 'male',
  birthDate: '1995-10-15',
  stylePreference: 'Casual Modest',
  sizePreference: 'M',
  loyaltyPoints: 1250,
  loyaltyTier: 'GOLD',
  voucherCount: 4,
  wishlistCount: 3,
  orderCount: 12,
  ...overrides,
});

/* --- ORIGINAL API IMPLEMENTATION ---
export const login = async (data: any) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const register = async (data: any) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};
------------------------------------- */

// Mock Implementation
export const login = async (data: any) => {
  // Logika Mockup: Jika email mengandung 'admin', jadikan sebagai Admin. Selain itu, Customer.
  const isAdmin = data.email && data.email.toLowerCase().includes('admin');
  
  return {
    token: isAdmin ? 'mock-jwt-token-admin' : 'mock-jwt-token-customer',
    user: mockUser({
      id: isAdmin ? 99 : 1,
      name: isAdmin ? 'Administrator' : 'Budi Santoso',
      email: data.email,
      role: (isAdmin ? 'admin' : 'customer') as UserRole,
    }),
  };
};

export const register = async (data: any) => {
  return {
    token: 'mock-jwt-token-customer',
    user: mockUser({
      id: 2,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'customer',
    }),
  };
};

// getProfile bisa menyesuaikan berdasarkan token atau sekadar return data statis
export const getProfile = async () => {
  // Secara default mockup menganggap user adalah Budi Santoso (Customer). 
  // Untuk pengetesan Admin yang lebih solid tanpa refresh, state role diurus di authStore.
  return mockUser({
    id: 1,
    name: 'Budi Santoso',
    email: 'budi@example.com',
    role: 'customer',
  });
};
