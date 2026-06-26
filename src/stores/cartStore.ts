import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addToCart, getCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from '@/services/api/cart';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';
import { extractVariantColor } from '@/lib/utils';

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
  weight_gram?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  sessionId: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  getSessionId: () => string | null;
  syncCart: () => Promise<void>;
  addItem: (item: Partial<CartItem> & { variantId: number; qty: number }) => Promise<void>;
  updateQty: (itemId: number, qty: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
  getTotal: () => number;
}

interface ApiCartItem {
  id: number;
  // Backend returns snake_case; camelCase kept for compat
  productId?: number;
  product_id?: number;
  variantId?: number;
  variant_id?: number;
  qty?: number;
  quantity?: number;
  price: number;
  weight_gram?: number;
  product: {
    name: string;
    slug: string;
    thumbnail_url: string;
  };
  variant: {
    sku: string;
    name?: string;
    stock: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      sessionId: null,

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      getSessionId: () => {
        let sessId = get().sessionId;
        if (!sessId && typeof window !== 'undefined') {
          sessId = localStorage.getItem('ansania-session-id');
          if (!sessId) {
            sessId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem('ansania-session-id', sessId);
          }
          set({ sessionId: sessId });
        }
        return sessId;
      },

      syncCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        const sessId = !isAuthenticated ? get().getSessionId() : undefined;

        set({ isLoading: true });
        try {
          const cartData = await getCart(sessId || undefined);
          if (cartData && cartData.items) {
            const mappedItems = cartData.items.map((apiItem: ApiCartItem) => ({
              id: apiItem.id,
              // Bug #7 fix: backend sends snake_case, fallback to camelCase for compat
              productId: apiItem.product_id ?? apiItem.productId ?? 0,
              variantId: apiItem.variant_id ?? apiItem.variantId ?? 0,
              productName: apiItem.product.name,
              productSlug: apiItem.product.slug,
              variantName: apiItem.variant.name ? extractVariantColor(apiItem.variant.name, apiItem.variant.sku) : apiItem.variant.sku,
              thumbnailUrl: apiItem.product.thumbnail_url,
              price: apiItem.price,
              qty: apiItem.qty ?? apiItem.quantity ?? 1,
              maxQty: apiItem.variant.stock,
              weight_gram: apiItem.weight_gram,
            }));
            set({ items: mappedItems });
          }
        } catch (error) {
          console.error('Failed to sync cart', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (item) => {
        const { isAuthenticated } = useAuthStore.getState();
        const sessId = !isAuthenticated ? get().getSessionId() : undefined;
        
        try {
          set({ isLoading: true });
          await addToCart({ 
            variant_id: item.variantId, 
            product_id: item.productId || item.id, 
            quantity: item.qty 
          }, sessId || undefined);
          await get().syncCart();

          toast.success('Produk ditambahkan ke keranjang');
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err.response?.data?.message || 'Gagal menambahkan ke keranjang');
        } finally {
          set({ isLoading: false });
        }
      },

      updateQty: async (itemId, qty) => {
        const { isAuthenticated } = useAuthStore.getState();
        const sessId = !isAuthenticated ? get().getSessionId() : undefined;
        
        try {
          await updateCartItem(itemId, qty, sessId || undefined);
          await get().syncCart();
        } catch {
          toast.error('Gagal mengupdate kuantitas');
        }
      },

      removeItem: async (itemId) => {
        const { isAuthenticated } = useAuthStore.getState();
        const sessId = !isAuthenticated ? get().getSessionId() : undefined;
        
        try {
          await removeCartItem(itemId, sessId || undefined);
          await get().syncCart();
          toast.success('Item dihapus');
        } catch {
          toast.error('Gagal menghapus item');
        }
      },

      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        const sessId = !isAuthenticated ? get().getSessionId() : undefined;
        try {
          await apiClearCart(sessId || undefined);
          set({ items: [] });
        } catch (error) {
          console.error('Clear cart failed', error);
        }
      },

      mergeGuestCart: async () => {
        const sessId = get().sessionId || (typeof window !== 'undefined' ? localStorage.getItem('ansania-session-id') : null);
        if (!sessId) return;

        try {
          const { mergeCart: apiMergeCart } = await import('@/services/api/cart');
          await apiMergeCart(sessId);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('ansania-session-id');
          }
          set({ sessionId: null });
        } catch (error) {
          console.error('Failed to merge guest cart:', error);
        }
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.qty, 0);
      },
    }),
    {
      name: 'ansania-cart',
      partialize: (state) => ({ items: state.items, sessionId: state.sessionId }),
    }
  )
);
