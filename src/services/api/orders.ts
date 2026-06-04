import { api } from '@/lib/api';

export const getOrders = async (params?: Record<string, unknown>) => {
  const { data } = await api.get('/orders', { params });
  return data.data || data;
};

export const getOrderDetails = async (orderNumber: string) => {
  const { data } = await api.get(`/orders/${orderNumber}`);
  return data.data || data;
};

export const createOrder = async (data: Record<string, unknown>) => {
  const res = await api.post('/orders', data);
  return res.data;
};

export const cancelOrder = async (orderNumber: string, cancelReason: string) => {
  const res = await api.post(`/orders/${orderNumber}/cancel`, { cancel_reason: cancelReason });
  return res.data;
};

export const confirmReceived = async (orderNumber: string) => {
  const res = await api.post(`/orders/${orderNumber}/confirm-received`);
  return res.data;
};

export const downloadInvoice = async (orderNumber: string) => {
  const response = await api.get(`/orders/${orderNumber}/invoice`, {
    responseType: 'blob'
  });
  return response.data;
};

export const getPaymentToken = async (orderNumber: string) => {
  const { data } = await api.get(`/payments/${orderNumber}/token`);
  return data.data || data;
};
