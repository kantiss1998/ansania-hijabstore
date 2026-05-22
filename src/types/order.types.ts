// ─── Order Types ───────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderAddress {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface OrderItem {
  id: number;
  productName: string;
  productSlug: string;
  variantName: string;
  thumbnailUrl: string;
  price: number;
  qty: number;
  subtotal: number;
}

export interface OrderShipping {
  courierName: string;
  courierService: string;
  trackingNumber?: string;
  shippingCost: number;
  estimatedDelivery?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  shipping: OrderShipping;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  voucherCode?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: 'Menunggu Pembayaran',
  paid: 'Dibayar',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Selesai',
  cancelled: 'Dibatalkan',
  refunded: 'Dikembalikan',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending_payment: 'badge-warning',
  paid: 'badge-info',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
  refunded: 'badge-gray',
};
