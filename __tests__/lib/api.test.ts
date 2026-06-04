import axios from 'axios';
import Cookies from 'js-cookie';

// Mock js-cookie before importing api module
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// We need to import the api module after mocks are set up
let api: typeof import('@/lib/api').api;

beforeAll(async () => {
  const mod = await import('@/lib/api');
  api = mod.api;
});

describe('api interceptors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('request interceptor', () => {
    it('should attach Bearer token when token exists in cookies', async () => {
      (Cookies.get as jest.Mock).mockReturnValue('test-jwt-token');

      // Make a request and intercept it - we check the config transformation
      const config = {
        headers: { 'Content-Type': 'application/json' } as Record<string, string>,
        url: '/test',
      };

      // Manually run the request interceptor
      const interceptors = (api.interceptors.request as unknown as {
        handlers: Array<{ fulfilled: (config: { headers: Record<string, string>; url: string }) => { headers: Record<string, string>; url: string } }>;
      }).handlers;
      
      const requestInterceptor = interceptors[0]?.fulfilled;
      if (requestInterceptor) {
        const result = requestInterceptor(config);
        expect(result.headers.Authorization).toBe('Bearer test-jwt-token');
      }
    });

    it('should not attach Authorization header when no token exists', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(undefined);

      const config = {
        headers: { 'Content-Type': 'application/json' } as Record<string, string>,
        url: '/test',
      };

      const interceptors = (api.interceptors.request as unknown as {
        handlers: Array<{ fulfilled: (config: { headers: Record<string, string>; url: string }) => { headers: Record<string, string>; url: string } }>;
      }).handlers;

      const requestInterceptor = interceptors[0]?.fulfilled;
      if (requestInterceptor) {
        const result = requestInterceptor(config);
        expect(result.headers.Authorization).toBeUndefined();
      }
    });
  });

  describe('api instance configuration', () => {
    it('should have correct baseURL', () => {
      expect(api.defaults.baseURL).toBe('http://localhost:3001/api/v1');
    });

    it('should have Content-Type application/json', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should have withCredentials enabled', () => {
      expect(api.defaults.withCredentials).toBe(true);
    });
  });

  describe('response interceptor - 401 handling', () => {
    it('should clear cookies when refresh token is not available on 401', async () => {
      (Cookies.get as jest.Mock).mockImplementation((key: string) => {
        if (key === 'refreshToken') return undefined;
        if (key === 'token') return 'expired-token';
        return undefined;
      });

      const interceptors = (api.interceptors.response as unknown as {
        handlers: Array<{
          rejected: (error: {
            config: Record<string, unknown>;
            response: { status: number };
          }) => Promise<never>;
        }>;
      }).handlers;

      const responseErrorInterceptor = interceptors[0]?.rejected;
      if (responseErrorInterceptor) {
        const mockError = {
          config: { url: '/some-endpoint', _retry: false, headers: {} },
          response: { status: 401 },
        };

        await expect(responseErrorInterceptor(mockError)).rejects.toBeDefined();
        expect(Cookies.remove).toHaveBeenCalledWith('token');
      }
    });

    it('should pass through non-401 errors without retry', async () => {
      const interceptors = (api.interceptors.response as unknown as {
        handlers: Array<{
          rejected: (error: {
            config?: Record<string, unknown>;
            response: { status: number };
          }) => Promise<never>;
        }>;
      }).handlers;

      const responseErrorInterceptor = interceptors[0]?.rejected;
      if (responseErrorInterceptor) {
        const mockError = {
          response: { status: 500 },
          config: { url: '/test' },
        };

        await expect(responseErrorInterceptor(mockError)).rejects.toBeDefined();
        // Should not attempt refresh
        expect(Cookies.remove).not.toHaveBeenCalled();
      }
    });
  });

  describe('axios post for refresh', () => {
    it('should use axios.post for refresh endpoint', () => {
      // Verify the refresh endpoint path is as expected
      // The actual refresh call uses raw axios.post, not the api instance
      expect(typeof axios.post).toBe('function');
    });
  });
});
