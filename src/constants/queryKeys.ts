export const QUERY_KEYS = {
  products: {
    all: ['products'] as const,
    list: (params?: Record<string, unknown>) =>
      ['products', 'list', params] as const,
    detail: (slug: string) => ['products', 'detail', slug] as const,
    featured: ['products', 'featured'] as const,
    search: (q: string) => ['products', 'search', q] as const,
  },
  categories: {
    all: ['categories'] as const,
    detail: (slug: string) => ['categories', 'detail', slug] as const,
  },
  banners: {
    all: ['banners'] as const,
    byPosition: (position: string) => ['banners', position] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (orderNumber: string) => ['orders', 'detail', orderNumber] as const,
  },
  user: {
    profile: ['user', 'profile'] as const,
    addresses: ['user', 'addresses'] as const,
    wishlist: ['user', 'wishlist'] as const,
    notifications: ['user', 'notifications'] as const,
  },
  reviews: {
    product: (productId: number) => ['reviews', 'product', productId] as const,
  },
  flashSale: {
    active: ['flash-sale', 'active'] as const,
  },
} as const;
