import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { User } from '@/types/user.types';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          // Gunakan service mockup (api/auth.ts)
          const { login: apiLogin } = await import('@/services/api/auth');
          const response = await apiLogin(credentials);
          const { user, token } = response;
          
          Cookies.set('token', token, { expires: 7 }); 
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Gagal masuk.');
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const { register: apiRegister } = await import('@/services/api/auth');
          const response = await apiRegister(data);
          const { user, token } = response;
          
          Cookies.set('token', token, { expires: 7 });
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || 'Gagal mendaftar.');
          return false;
        }
      },

      logout: () => {
        Cookies.remove('token');
        set({ user: null, isAuthenticated: false });
        toast.success('Berhasil keluar');
      },

      checkAuth: async () => {
        const token = Cookies.get('token');
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          // Jika token adalah token admin, asumsikan user admin (untuk mockup persistance)
          if (token === 'mock-jwt-token-admin') {
             set({
               user: {
                 id: 99,
                 name: 'Administrator',
                 email: 'admin@ansania.com',
                 phone: '081234567890',
                 role: 'admin',
                 isEmailVerified: true,
                 createdAt: new Date().toISOString(),
               },
               isAuthenticated: true,
             });
             return;
          }

          const { getProfile: apiGetProfile } = await import('@/services/api/auth');
          const user = await apiGetProfile();
          set({ user, isAuthenticated: true });
        } catch (error) {
          Cookies.remove('token');
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'ansania-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // Simpan user data di localStorage untuk fast initial load
    }
  )
);
