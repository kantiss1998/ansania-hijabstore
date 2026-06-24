import { api } from '@/lib/api';

export const getShippingCost = async (data: Record<string, unknown>) => {
  const res = await api.post('/shipping/rates', data);
  return res.data.data || res.data;
};

export const getProvinces = async () => {
  const { data } = await api.get('/shipping/provinces');
  return data.data || data;
};

export const getCities = async (provinceId?: string) => {
  const params = provinceId ? { province_id: provinceId } : undefined;
  const { data } = await api.get('/shipping/cities', { params });
  return data.data || data;
};

export const trackShipment = async (courier: string, awb: string) => {
  const { data } = await api.get(`/shipping/track/${courier}/${awb}`);
  return data.data || data;
};

export const getDistricts = async (cityId?: string) => {
  const params = cityId ? { city_id: cityId } : undefined;
  const { data } = await api.get('/shipping/districts', { params });
  return data.data || data;
};
