import { useCartStore } from '@/stores/cartStore';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock authStore
jest.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: () => ({
      isAuthenticated: false,
    }),
  },
}));

// Mock cart API
const mockAddToCart = jest.fn();
const mockGetCart = jest.fn();
const mockUpdateCartItem = jest.fn();
const mockRemoveCartItem = jest.fn();
const mockClearCart = jest.fn();
const mockMergeCart = jest.fn();

jest.mock('@/services/api/cart', () => ({
  addToCart: (...args: unknown[]) => mockAddToCart(...args),
  getCart: (...args: unknown[]) => mockGetCart(...args),
  updateCartItem: (...args: unknown[]) => mockUpdateCartItem(...args),
  removeCartItem: (...args: unknown[]) => mockRemoveCartItem(...args),
  clearCart: (...args: unknown[]) => mockClearCart(...args),
  mergeCart: (...args: unknown[]) => mockMergeCart(...args),
}));

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      isOpen: false,
      isLoading: false,
      sessionId: null,
    });
    jest.clearAllMocks();

    // Mock localStorage
    const mockLocalStorage: Record<string, string> = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, val: string) => { mockLocalStorage[key] = val; }),
        removeItem: jest.fn((key: string) => { delete mockLocalStorage[key]; }),
      },
      writable: true,
    });
  });

  describe('initial state', () => {
    it('should have an empty cart', () => {
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.isOpen).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.sessionId).toBeNull();
    });
  });

  describe('drawer', () => {
    it('should open the cart drawer', () => {
      useCartStore.getState().openDrawer();
      expect(useCartStore.getState().isOpen).toBe(true);
    });

    it('should close the cart drawer', () => {
      useCartStore.setState({ isOpen: true });
      useCartStore.getState().closeDrawer();
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe('getSessionId', () => {
    it('should generate and persist a session ID for guest users', () => {
      const sessId = useCartStore.getState().getSessionId();
      expect(sessId).toBeTruthy();
      expect(typeof sessId).toBe('string');
      expect(sessId!.startsWith('sess_')).toBe(true);
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    it('should return existing session ID if already set', () => {
      useCartStore.setState({ sessionId: 'sess_existing123' });
      const sessId = useCartStore.getState().getSessionId();
      expect(sessId).toBe('sess_existing123');
    });
  });

  describe('syncCart', () => {
    it('should sync cart from API and map items', async () => {
      mockGetCart.mockResolvedValue({
        items: [
          {
            id: 1,
            productId: 10,
            variantId: 100,
            qty: 2,
            price: 35000,
            weight_gram: 110,
            product: { name: 'Hijab Bella', slug: 'hijab-bella', thumbnail_url: '/img.jpg' },
            variant: { sku: 'HJ-BELLA-RED', stock: 50 },
          },
        ],
        total: 70000,
      });

      await useCartStore.getState().syncCart();

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].productName).toBe('Hijab Bella');
      expect(items[0].price).toBe(35000);
      expect(items[0].qty).toBe(2);
    });
  });

  describe('addItem', () => {
    it('should call API and sync cart, then show success toast', async () => {
      mockAddToCart.mockResolvedValue({});
      mockGetCart.mockResolvedValue({ items: [], total: 0 });

      await useCartStore.getState().addItem({ variantId: 100, qty: 1 });

      expect(mockAddToCart).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Produk ditambahkan ke keranjang');
    });

    it('should show error toast on failure', async () => {
      mockAddToCart.mockRejectedValue({
        response: { data: { message: 'Stok tidak cukup' } },
      });

      await useCartStore.getState().addItem({ variantId: 100, qty: 999 });

      expect(toast.error).toHaveBeenCalledWith('Stok tidak cukup');
    });
  });

  describe('updateQty', () => {
    it('should call API and re-sync cart', async () => {
      mockUpdateCartItem.mockResolvedValue({});
      mockGetCart.mockResolvedValue({ items: [], total: 0 });

      await useCartStore.getState().updateQty(1, 3);

      expect(mockUpdateCartItem).toHaveBeenCalledWith(1, 3, expect.any(String));
    });
  });

  describe('removeItem', () => {
    it('should call API, sync, and show success toast', async () => {
      mockRemoveCartItem.mockResolvedValue({});
      mockGetCart.mockResolvedValue({ items: [], total: 0 });

      await useCartStore.getState().removeItem(1);

      expect(mockRemoveCartItem).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Item dihapus');
    });

    it('should show error toast on failure', async () => {
      mockRemoveCartItem.mockRejectedValue(new Error('fail'));

      await useCartStore.getState().removeItem(1);

      expect(toast.error).toHaveBeenCalledWith('Gagal menghapus item');
    });
  });

  describe('clearCart', () => {
    it('should call API and empty items', async () => {
      useCartStore.setState({
        items: [{ id: 1, productId: 10, variantId: 100, productName: 'Test', productSlug: 'test', variantName: 'V', thumbnailUrl: '', price: 1000, qty: 1, maxQty: 10 }],
      });
      mockClearCart.mockResolvedValue({});

      await useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toEqual([]);
    });
  });

  describe('getTotal', () => {
    it('should calculate the correct total', () => {
      useCartStore.setState({
        items: [
          { id: 1, productId: 10, variantId: 100, productName: 'A', productSlug: 'a', variantName: 'V', thumbnailUrl: '', price: 35000, qty: 2, maxQty: 10 },
          { id: 2, productId: 11, variantId: 101, productName: 'B', productSlug: 'b', variantName: 'V', thumbnailUrl: '', price: 15000, qty: 3, maxQty: 10 },
        ],
      });

      expect(useCartStore.getState().getTotal()).toBe(35000 * 2 + 15000 * 3);
    });

    it('should return 0 for empty cart', () => {
      expect(useCartStore.getState().getTotal()).toBe(0);
    });
  });

  describe('mergeGuestCart', () => {
    it('should call merge API and clear sessionId', async () => {
      useCartStore.setState({ sessionId: 'sess_guest123' });
      mockMergeCart.mockResolvedValue({});

      await useCartStore.getState().mergeGuestCart();

      expect(mockMergeCart).toHaveBeenCalledWith('sess_guest123');
      expect(useCartStore.getState().sessionId).toBeNull();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('ansania-session-id');
    });

    it('should do nothing if no sessionId exists', async () => {
      useCartStore.setState({ sessionId: null });

      await useCartStore.getState().mergeGuestCart();

      expect(mockMergeCart).not.toHaveBeenCalled();
    });
  });
});
