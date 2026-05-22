import { api } from '@/lib/api';

/* --- ORIGINAL API IMPLEMENTATION ---
export const getShippingCost = async (data: any) => {
  const res = await api.post('/shipping/cost', data);
  return res.data.data;
};
------------------------------------- */

// Mock Implementation
export const getShippingCost = async (data: any) => {
  return [
    { name: 'JNE Reguler', cost: 15000, etd: '2-3 hari' },
    { name: 'JNE YES', cost: 25000, etd: '1 hari' },
    { name: 'J&T Express', cost: 14000, etd: '2-3 hari' },
  ];
};
