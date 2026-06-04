import { api } from '@/lib/api';
import type { User } from '@/types/user.types';

export const login = async (data: Record<string, unknown>) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const register = async (data: Record<string, unknown>) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get('/users/me');
  return data.data;
};

export const logout = async (refreshToken?: string) => {
  const res = await api.post('/auth/logout', { refreshToken });
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
};

export const resetPassword = async (data: Record<string, unknown>) => {
  const res = await api.post('/auth/reset-password', data);
  return res.data;
};

export const verifyEmail = async (token: string) => {
  const res = await api.post('/auth/verify-email', { token });
  return res.data;
};

export const loginWithOAuth = async (data: {
  provider: string;
  token?: string;
  provider_id?: string;
  email?: string;
  name?: string;
}) => {
  const res = await api.post('/auth/oauth/login', data);
  return res.data;
};

