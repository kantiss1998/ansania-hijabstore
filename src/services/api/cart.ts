import { api, BACKEND_URL } from '@/lib/api';

interface CartItemInput {
  productId?: number;
  product_id?: number;
  variantId?: number;
  variant_id?: number;
  quantity?: number;
  qty?: number;
}

interface BackendCartItem {
  id: number;
  product_id?: number;
  variant_id: number;
  quantity?: number;
  qty?: number;
  price?: number;
  subtotal?: number;
  product_name: string;
  product_slug?: string;
  primary_image?: string;
  thumbnail_url?: string;
  sku?: string;
  variant_name?: string;
  stock?: number;
  weight_gram?: number;
}

export const addToCart = async (data: CartItemInput, sessionId?: string) => {
  const payload: Record<string, unknown> = {
    product_id: data.productId || data.product_id,
    variant_id: data.variantId || data.variant_id,
    quantity: data.quantity || data.qty || 1
  };

  if (sessionId) {
    payload.session_id = sessionId;
  }
  const res = await api.post('/cart/items', payload);
  return res.data;
};

export const getCart = async (sessionId?: string) => {
  const params: Record<string, unknown> = {};
  if (sessionId) {
    params.session_id = sessionId;
  }
  const { data } = await api.get('/cart', { params });
  const cart = data.data || data;
  const items = (cart.items || []).map((item: BackendCartItem) => ({
    id: item.id,
    product_id: item.product_id || item.id,
    variant_id: item.variant_id,
    qty: item.quantity || item.qty || 1,
    price: item.price || (item.subtotal ? item.subtotal / (item.quantity || 1) : 0),
    weight_gram: item.weight_gram || 300,
    product: {
      name: item.product_name,
      slug: item.product_slug || item.product_name.toLowerCase().replace(/ /g, '-'),
      thumbnail_url: (() => {
        const img = item.primary_image || item.thumbnail_url;
        return img ? (img.startsWith('http') ? img : `${BACKEND_URL}${img}`) : '';
      })()
    },
    variant: {
      sku: item.sku || '',
      name: item.variant_name || '',
      stock: item.stock || 0
    }
  }));
  return {
    items,
    total: cart.total || 0
  };
};

export const updateCartItem = async (itemId: number, qty: number, sessionId?: string) => {
  const { data } = await api.patch(`/cart/items/${itemId}`, { quantity: qty }, {
    params: sessionId ? { session_id: sessionId } : undefined
  });
  return data;
};

export const removeCartItem = async (itemId: number, sessionId?: string) => {
  const { data } = await api.delete(`/cart/items/${itemId}`, {
    params: sessionId ? { session_id: sessionId } : undefined
  });
  return data;
};

export const mergeCart = async (sessionId: string) => {
  const res = await api.post('/cart/merge', { session_id: sessionId });
  return res.data;
};

export const clearCart = async (sessionId?: string) => {
  const { data } = await api.delete('/cart', {
    params: sessionId ? { session_id: sessionId } : undefined
  });
  return data;
};
