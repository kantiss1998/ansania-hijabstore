import { api } from '@/lib/api';

/* --- ORIGINAL API IMPLEMENTATION ---
export const getOrders = async () => {
  const { data } = await api.get('/orders');
  return data.data;
};

export const getOrderDetails = async (orderNumber: string) => {
  const { data } = await api.get(`/orders/${orderNumber}`);
  return data.data;
};

export const createOrder = async (data: any) => {
  const res = await api.post('/orders', data);
  return res.data;
};
------------------------------------- */

// Mock Implementation
export const getOrders = async (params?: any) => {
  return {
    data: [
      {
        id: 1,
        order_number: 'ORD-20231020-001',
        status: 'shipped',
        created_at: '2023-10-20T14:30:00Z',
        payment_status: 'paid',
        total_amount: 515000,
        order_items: [
          { id: 1, product: { name: 'Gamis Syari Khadijah', thumbnail_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop' }, variant: { sku: 'Hitam - M' }, price: 350000, qty: 1 }
        ]
      }
    ]
  };
};

export const getOrderDetails = async (orderNumber: string) => {
  return (await getOrders()).data[0];
};

export const createOrder = async (data: any) => {
  return { data: { order_number: 'ORD-20231020-001', snap_token: 'dummy-token' } };
};
