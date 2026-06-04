import { api } from '@/lib/api';

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  body: string;
  data: string | null;
  is_read: number | boolean;
  read_at: string | null;
  created_at: string;
}

export const getNotifications = async (params?: Record<string, unknown>): Promise<Notification[]> => {
  const { data } = await api.get('/notifications', { params });
  return data.data || data;
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const { data } = await api.get('/notifications/unread-count');
  return data.data || data;
};

export const markAllRead = async (): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.patch('/notifications/mark-read');
  return data;
};

export const markRead = async (id: number): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.patch(`/notifications/${id}/mark-read`);
  return data;
};

export const deleteNotification = async (id: number): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete(`/notifications/${id}`);
  return data;
};

