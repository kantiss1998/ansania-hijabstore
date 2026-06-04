import { api } from '@/lib/api';
import type { Review } from '@/types/product.types';

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
}

export const submitReview = async (formData: FormData): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.post('/reviews', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const getProductReviews = async (
  slug: string,
  params?: Record<string, unknown>
): Promise<ReviewListResponse> => {
  const { data } = await api.get(`/products/${slug}/reviews`, { params });
  return data;
};

