import { api } from '@/lib/api';
import type { FlashSale } from '@/types/product.types';

interface BackendFlashSaleItem {
  id: number;
  variant_id: number;
  original_price: number;
  sale_price: number;
  quota: number;
  sold_count: number;
  product_name: string;
  variant_name?: string;
  primary_image?: string;
}

interface BackendFlashSale {
  id: number;
  name: string;
  starts_at?: string;
  startDate?: string;
  ends_at?: string;
  endDate?: string;
  items?: BackendFlashSaleItem[];
}

export const getActiveFlashSale = async (): Promise<FlashSale | null> => {
  const { data } = await api.get('/flash-sales/active');
  const sales: BackendFlashSale[] = data.data || data;
  if (!sales || sales.length === 0) return null;
  
  const sale = sales[0];
  return {
    id: sale.id,
    name: sale.name,
    startDate: sale.starts_at || sale.startDate || '',
    endDate: sale.ends_at || sale.endDate || '',
    products: (sale.items || []).map((item: BackendFlashSaleItem) => ({
      id: item.id,
      originalPrice: item.original_price,
      flashSalePrice: item.sale_price,
      maxQty: item.quota,
      soldQty: item.sold_count,
      product: {
        id: item.variant_id,
        name: item.variant_name ? `${item.product_name} - ${item.variant_name}` : item.product_name,
        slug: item.product_name.toLowerCase().replace(/ /g, '-') + '-' + item.variant_id,
        price: item.sale_price,
        comparePrice: item.original_price,
        thumbnailUrl: item.primary_image || '',
        category: { id: 0, name: 'Uncategorized', slug: 'uncategorized' },
        stockStatus: item.quota > item.sold_count ? 'in_stock' : 'out_of_stock',
        ratingAverage: 4.8,
        totalReviews: 50,
        isFeatured: false,
        isNew: false
      }
    }))
  };
};
