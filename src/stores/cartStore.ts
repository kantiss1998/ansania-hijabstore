import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addToCart, getCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from '@/services/api/cart';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

export interface CartItem {
  id: number; // Item ID dari database
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

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  syncCart: () => Promise<void>;
  addItem: (item: Partial<CartItem> & { variantId: number; qty: number }) => Promise<void>;
  updateQty: (itemId: number, qty: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      syncCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return; // Jika belum login, gunakan state lokal

        set({ isLoading: true });
        try {
          const cartData = await getCart();
          if (cartData && cartData.items) {
            // Mapping dari API response ke CartItem lokal
            const mappedItems = cartData.items.map((apiItem: any) => ({
              id: apiItem.id,
              productId: apiItem.product_id,
              variantId: apiItem.variant_id,
              productName: apiItem.product.name,
              productSlug: apiItem.product.slug,
              variantName: apiItem.variant.sku,
              thumbnailUrl: apiItem.product.thumbnail_url,
              price: apiItem.price,
              qty: apiItem.qty,
              maxQty: apiItem.variant.stock,
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
        
        if (isAuthenticated) {
          try {
            set({ isLoading: true });
            await addToCart({ variant_id: item.variantId, qty: item.qty });
            await get().syncCart(); // Refresh cart dari server
            toast.success('Produk ditambahkan ke keranjang');
          } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menambahkan ke keranjang');
          } finally {
            set({ isLoading: false });
          }
        } else {
          // Fallback lokal jika belum login
          set((state) => {
            const existingItem = state.items.find((i) => i.variantId === item.variantId);
            if (existingItem) {
              const newQty = Math.min(existingItem.qty + item.qty, existingItem.maxQty);
              return {
                items: state.items.map((i) =>
                  i.variantId === item.variantId ? { ...i, qty: newQty } : i
                ),
              };
            }
            // Generate temporary ID
            const tempItem = { ...item, id: Date.now() } as CartItem;
            return { items: [...state.items, tempItem] };
          });
          toast.success('Produk ditambahkan ke keranjang (Lokal)');
        }
      },

      updateQty: async (itemId, qty) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await updateCartItem(itemId, qty);
            await get().syncCart();
          } catch (error) {
            toast.error('Gagal mengupdate kuantitas');
          }
        } else {
          set((state) => ({
            items: state.items.map((i) => (i.id === itemId ? { ...i, qty } : i)),
          }));
        }
      },

      removeItem: async (itemId) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await removeCartItem(itemId);
            await get().syncCart();
            toast.success('Item dihapus');
          } catch (error) {
            toast.error('Gagal menghapus item');
          }
        } else {
          set((state) => ({
            items: state.items.filter((i) => i.id !== itemId),
          }));
        }
      },

      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await apiClearCart();
            set({ items: [] });
          } catch (error) {
            console.error('Clear cart failed', error);
          }
        } else {
          set({ items: [] });
        }
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.qty, 0);
      },
    }),
    {
      name: 'ansania-cart',
      // Hanya persisten item lokal. Jika login, item akan dioverride oleh syncCart
      partialize: (state) => ({ items: state.items }),
    }
  )
);
