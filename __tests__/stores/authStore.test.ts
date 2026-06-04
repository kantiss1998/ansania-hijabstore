import { useAuthStore } from '@/stores/authStore';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Mock js-cookie
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Mock auth API
jest.mock('@/services/api/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
  loginWithOAuth: jest.fn(),
  logout: jest.fn(),
  getProfile: jest.fn(),
}));

// Mock users API (for wishlist sync)
jest.mock('@/services/api/users', () => ({
  getWishlist: jest.fn().mockResolvedValue([]),
  toggleWishlist: jest.fn(),
}));

// Mock cartStore
jest.mock('@/stores/cartStore', () => ({
  useCartStore: {
    getState: () => ({
      mergeGuestCart: jest.fn().mockResolvedValue(undefined),
      syncCart: jest.fn().mockResolvedValue(undefined),
    }),
  },
}));

// Mock wishlistStore
jest.mock('@/stores/wishlistStore', () => ({
  useWishlistStore: {
    getState: () => ({
      init: jest.fn(),
    }),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    // Reset zustand state
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have null user and isAuthenticated=false', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('should set user and isAuthenticated on successful login', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@test.com', role: 'customer' };
      const { login: apiLogin } = await import('@/services/api/auth');
      (apiLogin as jest.Mock).mockResolvedValue({
        data: {
          user: mockUser,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      });

      const result = await useAuthStore.getState().login({ email: 'test@test.com', password: 'pass' });

      expect(result).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(Cookies.set).toHaveBeenCalledWith('token', 'mock-access-token', { expires: 7 });
      expect(Cookies.set).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token', { expires: 7 });
    });

    it('should show error toast on login failure', async () => {
      const { login: apiLogin } = await import('@/services/api/auth');
      (apiLogin as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      const result = await useAuthStore.getState().login({ email: 'test@test.com', password: 'wrong' });

      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should set user and isAuthenticated on successful registration (auto-login)', async () => {
      const mockUser = { id: 2, name: 'New User', email: 'new@test.com', role: 'customer' };
      const { register: apiRegister } = await import('@/services/api/auth');
      (apiRegister as jest.Mock).mockResolvedValue({
        data: {
          user: mockUser,
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      });

      const result = await useAuthStore.getState().register({ name: 'New User', email: 'new@test.com', password: 'pass' });

      expect(result).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(Cookies.set).toHaveBeenCalledWith('token', 'new-access-token', { expires: 7 });
    });

    it('should show error toast on registration failure', async () => {
      const { register: apiRegister } = await import('@/services/api/auth');
      (apiRegister as jest.Mock).mockRejectedValue(new Error('Email already exists'));

      const result = await useAuthStore.getState().register({ name: 'New', email: 'dup@test.com', password: 'pass' });

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Email already exists');
    });
  });

  describe('loginOAuth', () => {
    it('should handle OAuth login flow successfully', async () => {
      const mockUser = { id: 3, name: 'OAuth User', email: 'oauth@google.com', role: 'customer' };
      const { loginWithOAuth } = await import('@/services/api/auth');
      (loginWithOAuth as jest.Mock).mockResolvedValue({
        data: {
          user: mockUser,
          accessToken: 'oauth-token',
          refreshToken: 'oauth-refresh',
        },
      });

      const result = await useAuthStore.getState().loginOAuth('google', {
        token: 'google-id-token',
        email: 'oauth@google.com',
        name: 'OAuth User',
      });

      expect(result).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear user state and cookies on logout', async () => {
      // Set initial authenticated state
      useAuthStore.setState({
        user: { id: 1, name: 'Test', email: 'test@test.com' } as never,
        isAuthenticated: true,
      });

      const { logout: apiLogout } = await import('@/services/api/auth');
      (apiLogout as jest.Mock).mockResolvedValue({});
      (Cookies.get as jest.Mock).mockReturnValue('mock-refresh-token');

      await useAuthStore.getState().logout();

      expect(Cookies.remove).toHaveBeenCalledWith('token');
      expect(Cookies.remove).toHaveBeenCalledWith('refreshToken');
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should still clear state even if API logout fails', async () => {
      useAuthStore.setState({
        user: { id: 1, name: 'Test', email: 'test@test.com' } as never,
        isAuthenticated: true,
      });

      const { logout: apiLogout } = await import('@/services/api/auth');
      (apiLogout as jest.Mock).mockRejectedValue(new Error('Network error'));

      await useAuthStore.getState().logout();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('checkAuth', () => {
    it('should restore user from token if valid', async () => {
      const mockUser = { id: 1, name: 'Test', email: 'test@test.com' };
      (Cookies.get as jest.Mock).mockReturnValue('valid-token');
      const { getProfile: apiGetProfile } = await import('@/services/api/auth');
      (apiGetProfile as jest.Mock).mockResolvedValue(mockUser);

      await useAuthStore.getState().checkAuth();

      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should clear state if no token exists', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(undefined);

      await useAuthStore.getState().checkAuth();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should clear cookies and state if token is invalid/expired', async () => {
      (Cookies.get as jest.Mock).mockReturnValue('expired-token');
      const { getProfile: apiGetProfile } = await import('@/services/api/auth');
      (apiGetProfile as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      await useAuthStore.getState().checkAuth();

      expect(Cookies.remove).toHaveBeenCalledWith('token');
      expect(Cookies.remove).toHaveBeenCalledWith('refreshToken');
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
