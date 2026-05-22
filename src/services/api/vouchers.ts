import { api } from '@/lib/api';

/* --- ORIGINAL API IMPLEMENTATION ---
export const validateVoucher = async (code: string, subtotal: number) => {
  const res = await api.post('/vouchers/validate', { code, subtotal });
  return res.data.data;
};
------------------------------------- */

// Mock Implementation
export const validateVoucher = async (code: string, subtotal: number) => {
  if (code === 'DISKON10' && subtotal >= 100000) {
    return { code: 'DISKON10', type: 'percentage', value: 10 };
  } else if (code === 'POTONGAN50' && subtotal >= 200000) {
    return { code: 'POTONGAN50', type: 'fixed', value: 50000 };
  }
  throw new Error('Voucher tidak valid atau syarat tidak terpenuhi');
};
