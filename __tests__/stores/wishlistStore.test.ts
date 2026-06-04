import { useWishlistStore } from '@/stores/wishlistStore';

// Mock the users API
jest.mock('@/services/api/users', () => ({
  toggleWishlist: jest.fn().mockResolvedValue({}),
  getWishlist: jest.fn().mockResolvedValue([]),
}));

describe('wishlistStore', () => {
  beforeEach(() => {
    useWishlistStore.setState({ productIds: new Set<number>() });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty productIds', () => {
      expect(useWishlistStore.getState().productIds.size).toBe(0);
    });
  });

  describe('init', () => {
    it('should initialize with a list of product IDs', () => {
      useWishlistStore.getState().init([1, 2, 3]);
      expect(useWishlistStore.getState().productIds.size).toBe(3);
      expect(useWishlistStore.getState().productIds.has(1)).toBe(true);
      expect(useWishlistStore.getState().productIds.has(2)).toBe(true);
      expect(useWishlistStore.getState().productIds.has(3)).toBe(true);
    });

    it('should replace existing IDs on re-init', () => {
      useWishlistStore.getState().init([1, 2]);
      useWishlistStore.getState().init([5, 10]);
      expect(useWishlistStore.getState().productIds.size).toBe(2);
      expect(useWishlistStore.getState().productIds.has(1)).toBe(false);
      expect(useWishlistStore.getState().productIds.has(5)).toBe(true);
    });
  });

  describe('toggle', () => {
    it('should add a product to wishlist if not present', async () => {
      await useWishlistStore.getState().toggle(42);
      expect(useWishlistStore.getState().productIds.has(42)).toBe(true);
    });

    it('should remove a product from wishlist if already present', async () => {
      useWishlistStore.setState({ productIds: new Set([42]) });
      await useWishlistStore.getState().toggle(42);
      expect(useWishlistStore.getState().productIds.has(42)).toBe(false);
    });

    it('should call the toggleWishlist API', async () => {
      const { toggleWishlist } = await import('@/services/api/users');
      await useWishlistStore.getState().toggle(99);
      expect(toggleWishlist).toHaveBeenCalledWith(99);
    });
  });

  describe('isWishlisted', () => {
    it('should return true for wishlisted product', () => {
      useWishlistStore.setState({ productIds: new Set([7]) });
      expect(useWishlistStore.getState().isWishlisted(7)).toBe(true);
    });

    it('should return false for non-wishlisted product', () => {
      expect(useWishlistStore.getState().isWishlisted(999)).toBe(false);
    });
  });

  describe('count', () => {
    it('should return 0 for empty wishlist', () => {
      expect(useWishlistStore.getState().count()).toBe(0);
    });

    it('should return correct count', () => {
      useWishlistStore.getState().init([1, 2, 3, 4, 5]);
      expect(useWishlistStore.getState().count()).toBe(5);
    });
  });
});
