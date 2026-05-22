import { api } from '@/lib/api';

/* --- ORIGINAL API IMPLEMENTATION ---
export const addToCart = async (data: any) => {
  const res = await api.post('/cart', data);
  return res.data;
};

export const getCart = async () => {
  const { data } = await api.get('/cart');
  return data.data;
};

export const updateCartItem = async (itemId: number, qty: number) => {
  const { data } = await api.put(`/cart/${itemId}`, { qty });
  return data;
};

export const removeCartItem = async (itemId: number) => {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete('/cart/clear');
  return data;
};
------------------------------------- */

// Mock Implementation
export const addToCart = async (data: any) => {
  return { success: true, message: 'Added to cart' };
};

export const getCart = async () => {
  return {
    items: [
      {
        id: 999,
        product_id: 1,
        variant_id: 1,
        qty: 1,
        price: 250000,
        product: {
          name: 'Produk Fashion Muslim Premium 1',
          slug: 'produk-fashion-muslim-premium-1',
          thumbnail_url: 'https://images.unsplash.com/photo-1515347619362-e64e9e42d765?q=80&w=800&auto=format&fit=crop'
        },
        variant: {
          sku: 'SKU-1',
          stock: 50
        }
      }
    ]
  };
};

export const updateCartItem = async (itemId: number, qty: number) => {
  return { success: true };
};

export const removeCartItem = async (itemId: number) => {
  return { success: true };
};

export const clearCart = async () => {
  return { success: true };
};
