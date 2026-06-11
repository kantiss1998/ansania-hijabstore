import { api, BACKEND_URL } from '@/lib/api';
import type { Banner } from '@/types/product.types';

interface RawBanner {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  position: string;
  sort_order: number;
  is_active: number | boolean;
}

export const getBanners = async (): Promise<Banner[]> => {
  const { data } = await api.get('/banners');
  const banners: RawBanner[] = data.data || data;
  return banners.map((b) => ({
    id: b.id,
    title: b.title,
    imageUrl: b.image_url ? (b.image_url.startsWith('http') ? b.image_url : `${BACKEND_URL}${b.image_url}`) : '',
    linkUrl: b.link_url,
    position: b.position,
    sortOrder: b.sort_order,
    isActive: b.is_active === 1 || b.is_active === true,
  }));
};
