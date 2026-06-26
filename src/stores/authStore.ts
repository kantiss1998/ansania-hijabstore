import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/types/user.types';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Record<string, unknown>) => Promise<boolean>;
  register: (data: Record<string, unknown>) => Promise<boolean>;
  loginOAuth: (provider: string, data: { token?: string; provider_id?: string; email?: string; name?: string }) => Promise<boolean>;
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
          const { login: apiLogin } = await import('@/services/api/auth');
          const response = await apiLogin(credentials);
          
          const payload = response.data || response;
          const { user, accessToken, refreshToken } = payload;
          const activeToken = accessToken || response.token;
          
          Cookies.set('token', activeToken, { expires: 7 }); 
          if (refreshToken) {
            Cookies.set('refreshToken', refreshToken, { expires: 7 });
          }
          
          set({ user, isAuthenticated: true, isLoading: false });

          // Sync wishlist dari database
          try {
            const { getWishlist } = await import('@/services/api/users');
            const { useWishlistStore } = await import('@/stores/wishlistStore');
            const wishlist = await getWishlist();
            const ids = (wishlist || [])
              .map((item) => item.product_id || item.product?.id || item.id)
              .filter((id): id is number => typeof id === 'number');
            useWishlistStore.getState().init(ids);
          } catch (e) {
            console.error('Failed to sync wishlist on login:', e);
          }

          // Merge guest cart with user cart in DB
          try {
            const { useCartStore } = await import('@/stores/cartStore');
            await useCartStore.getState().mergeGuestCart();
            await useCartStore.getState().syncCart();
          } catch (e) {
            console.error('Failed to sync/merge cart on login:', e);
          }

          return true;
        } catch (error) {
          set({ isLoading: false });
          // Bug #11 fix: extract pesan error dari Axios response
          const axiosErr = error as { response?: { data?: { message?: string } }; message?: string };
          toast.error(axiosErr.response?.data?.message || axiosErr.message || 'Gagal masuk.');
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const { register: apiRegister } = await import('@/services/api/auth');
          const response = await apiRegister(data);
          
          const payload = response.data || response;
          const { user, accessToken, refreshToken } = payload;
          const activeToken = accessToken || response.token;
          
          Cookies.set('token', activeToken, { expires: 7 });
          if (refreshToken) {
            Cookies.set('refreshToken', refreshToken, { expires: 7 });
          }
          
          set({ user, isAuthenticated: true, isLoading: false });

          // Sync wishlist dari database
          try {
            const { getWishlist } = await import('@/services/api/users');
            const { useWishlistStore } = await import('@/stores/wishlistStore');
            const wishlist = await getWishlist();
            const ids = (wishlist || [])
              .map((item) => item.product_id || item.product?.id || item.id)
              .filter((id): id is number => typeof id === 'number');
            useWishlistStore.getState().init(ids);
          } catch (e) {
            console.error('Failed to sync wishlist on register:', e);
          }

          // Merge guest cart with user cart in DB
          try {
            const { useCartStore } = await import('@/stores/cartStore');
            await useCartStore.getState().mergeGuestCart();
            await useCartStore.getState().syncCart();
          } catch (e) {
            console.error('Failed to sync/merge cart on register:', e);
          }

          return true;
        } catch (error) {
          set({ isLoading: false });
          // Bug #11 fix: extract pesan error dari Axios response
          const axiosErr = error as { response?: { data?: { message?: string } }; message?: string };
          toast.error(axiosErr.response?.data?.message || axiosErr.message || 'Gagal mendaftar.');
          return false;
        }
      },

      loginOAuth: async (provider, data) => {
        set({ isLoading: true });
        try {
          const { loginWithOAuth } = await import('@/services/api/auth');
          const response = await loginWithOAuth({ provider, ...data });
          
          const payload = response.data || response;
          const { user, accessToken, refreshToken } = payload;
          const activeToken = accessToken || response.token;
          
          Cookies.set('token', activeToken, { expires: 7 }); 
          if (refreshToken) {
            Cookies.set('refreshToken', refreshToken, { expires: 7 });
          }
          
          set({ user, isAuthenticated: true, isLoading: false });

          // Sync wishlist dari database
          try {
            const { getWishlist } = await import('@/services/api/users');
            const { useWishlistStore } = await import('@/stores/wishlistStore');
            const wishlist = await getWishlist();
            const ids = (wishlist || [])
              .map((item) => item.product_id || item.product?.id || item.id)
              .filter((id): id is number => typeof id === 'number');
            useWishlistStore.getState().init(ids);
          } catch (e) {
            console.error('Failed to sync wishlist on OAuth login:', e);
          }

          // Merge guest cart with user cart in DB
          try {
            const { useCartStore } = await import('@/stores/cartStore');
            await useCartStore.getState().mergeGuestCart();
            await useCartStore.getState().syncCart();
          } catch (e) {
            console.error('Failed to sync/merge cart on OAuth login:', e);
          }

          return true;
        } catch (error) {
          set({ isLoading: false });
          // Bug #11 fix: extract pesan error dari Axios response
          const axiosErr = error as { response?: { data?: { message?: string } }; message?: string };
          toast.error(axiosErr.response?.data?.message || axiosErr.message || 'Gagal masuk dengan OAuth.');
          return false;
        }
      },

      logout: async () => {
        try {
          const refreshToken = Cookies.get('refreshToken');
          const { logout: apiLogout } = await import('@/services/api/auth');
          await apiLogout(refreshToken);
        } catch (error) {
          console.error('API Error /auth/logout:', error);
        } finally {
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          // Bug #4 fix: bersihkan persist state di localStorage agar tidak ada data user tersisa
          useAuthStore.persist.clearStorage();
          set({ user: null, isAuthenticated: false });
          toast.success('Berhasil keluar');
        }
      },

      checkAuth: async () => {
        const token = Cookies.get('token');
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          const { getProfile: apiGetProfile } = await import('@/services/api/auth');
          const user = await apiGetProfile();
          set({ user, isAuthenticated: true });

          // Sync wishlist dari database
          try {
            const { getWishlist } = await import('@/services/api/users');
            const { useWishlistStore } = await import('@/stores/wishlistStore');
            const wishlist = await getWishlist();
            const ids = (wishlist || [])
              .map((item) => item.product_id || item.product?.id || item.id)
              .filter((id): id is number => typeof id === 'number');
            useWishlistStore.getState().init(ids);
          } catch (e) {
            console.error('Failed to sync wishlist on checkAuth:', e);
          }
        } catch {
          Cookies.remove('token');
          Cookies.remove('refreshToken');
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
