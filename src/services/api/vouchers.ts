import { api } from '@/lib/api';

export const validateVoucher = async (code: string, subtotal: number) => {
  const res = await api.post('/vouchers/validate', { code, subtotal });
  return res.data.data || res.data;
};
