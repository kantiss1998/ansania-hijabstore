import { api } from '@/lib/api';

export interface LandingPageContent {
  id: number;
  slug: string;
  title: string;
  content: string;
  is_active: number | boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
}

export interface PublicSetting {
  key?: string;
  setting_key?: string;
  value: string;
  group_name?: string;
}

export const getPublicLandingPage = async (slug: string): Promise<LandingPageContent> => {
  const { data } = await api.get(`/landing-pages/${slug}`);
  return data.data || data;
};

export const getPublicSettings = async (): Promise<PublicSetting[]> => {
  const { data } = await api.get('/settings/public');
  return data.data || data;
};
