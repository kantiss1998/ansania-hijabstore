import { api } from '@/lib/api';

export interface DashboardSummary {
  total_revenue: number;
  total_orders: number;
  total_users: number;
  total_products: number;
  recent_orders: Array<{
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get('/admin/dashboard/summary');
  return data.data || data;
};

export const getAdminProducts = async (params?: Record<string, unknown>) => {
  const { data } = await api.get('/admin/products', { params });
  return data;
};

export const getAdminProductDetail = async (id: number) => {
  const { data } = await api.get(`/admin/products/${id}`);
  return data.data || data;
};

export const getAdminOrders = async (params?: Record<string, unknown>) => {
  const { data } = await api.get('/admin/orders', { params });
  return data;
};

export const getAdminCategories = async () => {
  const { data } = await api.get('/admin/categories');
  return data.data || data;
};

export const getAdminVouchers = async () => {
  const { data } = await api.get('/admin/vouchers');
  return data.data || data;
};

// Category CRUD
export const createCategory = async (data: FormData) => {
  const res = await api.post('/admin/categories', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const updateCategory = async (id: number, data: FormData) => {
  const res = await api.patch(`/admin/categories/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteCategory = async (id: number) => {
  const res = await api.delete(`/admin/categories/${id}`);
  return res.data;
};

// Voucher CRUD
export const createVoucher = async (data: Record<string, unknown>) => {
  const res = await api.post('/admin/vouchers', data);
  return res.data;
};

export const updateVoucher = async (id: number, data: Record<string, unknown>) => {
  const res = await api.patch(`/admin/vouchers/${id}`, data);
  return res.data;
};

export const deleteVoucher = async (id: number) => {
  const res = await api.delete(`/admin/vouchers/${id}`);
  return res.data;
};

// Brand CRUD
export const getAdminBrands = async () => {
  const { data } = await api.get('/admin/brands');
  return data.data || data;
};

export const createBrand = async (data: FormData) => {
  const res = await api.post('/admin/brands', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const updateBrand = async (id: number, data: FormData) => {
  const res = await api.patch(`/admin/brands/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteBrand = async (id: number) => {
  const res = await api.delete(`/admin/brands/${id}`);
  return res.data;
};

// Product CRUD & Stock
export const createProduct = async (data: Record<string, unknown>) => {
  const res = await api.post('/admin/products', data);
  return res.data;
};

export const updateProduct = async (id: number, data: Record<string, unknown>) => {
  const res = await api.patch(`/admin/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
};

export const addProductVariant = async (productId: number, variant: Record<string, unknown>) => {
  const res = await api.post(`/admin/products/${productId}/variants`, variant);
  return res.data;
};

export const updateProductVariant = async (variantId: number, variant: Record<string, unknown>) => {
  const res = await api.patch(`/admin/products/variants/${variantId}`, variant);
  return res.data;
};

export const adjustVariantStock = async (variantId: number, adjustment: Record<string, unknown>) => {
  const res = await api.patch(`/admin/products/variants/${variantId}/stock`, adjustment);
  return res.data;
};

export const getProductStockMutations = async (productId: number, query?: Record<string, unknown>) => {
  const { data } = await api.get(`/admin/products/${productId}/stock-mutations`, { params: query });
  return data.data || data;
};

export const addProductImage = async (productId: number, data: FormData) => {
  const res = await api.post(`/admin/products/${productId}/images`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteProductImage = async (imageId: number) => {
  const res = await api.delete(`/admin/products/images/${imageId}`);
  return res.data;
};

// Order Admin
export const getAdminOrderDetail = async (id: number) => {
  const { data } = await api.get(`/admin/orders/${id}`);
  return data.data || data;
};

export const updateOrderStatus = async (orderId: number, status: string, cancelReason?: string) => {
  const res = await api.patch(`/admin/orders/${orderId}/status`, { status, cancel_reason: cancelReason });
  return res.data;
};

export const updateOrderShipping = async (orderId: number, trackingNumber: string) => {
  const res = await api.patch(`/admin/orders/${orderId}/status`, {
    status: 'shipped',
    tracking_number: trackingNumber
  });
  return res.data;
};

export const processOrderRefund = async (orderId: number, refundData: Record<string, unknown>) => {
  const res = await api.post(`/admin/orders/${orderId}/refund`, {
    amount: refundData.amount,
    reason: refundData.reason
  });
  return res.data;
};

// Flash Sale CRUD
export const getAdminFlashSales = async () => {
  const { data } = await api.get('/admin/flash-sales');
  return data.data || data;
};

export const createFlashSale = async (data: Record<string, unknown>) => {
  const res = await api.post('/admin/flash-sales', data);
  return res.data;
};

export const updateFlashSale = async (id: number, data: Record<string, unknown>) => {
  const res = await api.patch(`/admin/flash-sales/${id}`, data);
  return res.data;
};

export const deleteFlashSale = async (id: number) => {
  const res = await api.delete(`/admin/flash-sales/${id}`);
  return res.data;
};

export const addFlashSaleItem = async (flashSaleId: number, item: Record<string, unknown>) => {
  const res = await api.post(`/admin/flash-sales/${flashSaleId}/items`, item);
  return res.data;
};

export const deleteFlashSaleItem = async (flashSaleId: number, itemId: number) => {
  const res = await api.delete(`/admin/flash-sales/${flashSaleId}/items/${itemId}`);
  return res.data;
};

// Banners CRUD
export const getAdminBanners = async () => {
  const { data } = await api.get('/admin/banners');
  return data.data || data;
};

export const createBanner = async (data: FormData) => {
  const res = await api.post('/admin/banners', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const updateBanner = async (id: number, data: FormData) => {
  const res = await api.put(`/admin/banners/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteBanner = async (id: number) => {
  const res = await api.delete(`/admin/banners/${id}`);
  return res.data;
};

// Settings CRUD
export const getAdminSettings = async () => {
  const { data } = await api.get('/admin/settings');
  return data.data || data;
};

export const updateSetting = async (key: string, data: FormData) => {
  const res = await api.put(`/admin/settings/${key}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

// Review Admin
export const getAdminReviews = async (params?: Record<string, unknown>) => {
  const { data } = await api.get('/admin/reviews', { params });
  return data;
};

export const replyToReview = async (reviewId: number, data: Record<string, unknown>) => {
  const res = await api.post(`/admin/reviews/${reviewId}/reply`, data);
  return res.data;
};

export const updateReviewStatus = async (reviewId: number, status: string) => {
  const res = await api.patch(`/admin/reviews/${reviewId}/status`, { status });
  return res.data;
};

export const deleteReview = async (reviewId: number) => {
  const res = await api.delete(`/admin/reviews/${reviewId}`);
  return res.data;
};

// Customer Admin
export const getAdminCustomers = async (params?: Record<string, unknown>) => {
  const { data } = await api.get('/admin/users', { params });
  return data;
};

export const getAdminCustomerDetail = async (id: number) => {
  const { data } = await api.get(`/admin/users/${id}`);
  return data.data || data;
};

export const toggleCustomerStatus = async (id: number, isActive: boolean) => {
  const res = await api.patch(`/admin/users/${id}/status`, { is_active: isActive });
  return res.data;
};

// CMS Landing Pages & Redirects & Notification Templates
export const getLandingPages = async () => {
  const { data } = await api.get('/admin/cms/landing-pages');
  return data.data || data;
};

export const createLandingPage = async (data: Record<string, unknown>) => {
  const res = await api.post('/admin/cms/landing-pages', data);
  return res.data;
};

export const updateLandingPage = async (id: number, data: Record<string, unknown>) => {
  const res = await api.patch(`/admin/cms/landing-pages/${id}`, data);
  return res.data;
};

export const deleteLandingPage = async (id: number) => {
  const res = await api.delete(`/admin/cms/landing-pages/${id}`);
  return res.data;
};

export const getRedirects = async () => {
  const { data } = await api.get('/admin/cms/redirects');
  return data.data || data;
};

export const createRedirect = async (data: Record<string, unknown>) => {
  const res = await api.post('/admin/cms/redirects', data);
  return res.data;
};

export const updateRedirect = async (id: number, data: Record<string, unknown>) => {
  const res = await api.patch(`/admin/cms/redirects/${id}`, data);
  return res.data;
};

export const deleteRedirect = async (id: number) => {
  const res = await api.delete(`/admin/cms/redirects/${id}`);
  return res.data;
};

export const getNotificationTemplates = async () => {
  const { data } = await api.get('/admin/cms/notification-templates');
  return data.data || data;
};

export const createNotificationTemplate = async (data: Record<string, unknown>) => {
  const res = await api.post('/admin/cms/notification-templates', data);
  return res.data;
};

// Activity Logs
export const getActivityLogs = async (params?: Record<string, unknown>) => {
  const { data } = await api.get('/admin/activity-logs', { params });
  return data.data || data;
};

// Jubelio Manual Sync
export const syncJubelioInventory = async () => {
  const res = await api.post('/admin/jubelio/sync/inventory');
  return res.data;
};

export const syncJubelioProducts = async () => {
  const res = await api.post('/admin/jubelio/sync/products');
  return res.data;
};

export const getJubelioSyncLogs = async () => {
  const { data } = await api.get('/admin/jubelio/sync/logs');
  return data.data || data;
};

export const resetJubelioSync = async () => {
  const res = await api.post('/admin/jubelio/sync/reset');
  return res.data;
};
