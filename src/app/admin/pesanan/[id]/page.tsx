'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, User, MapPin, Save, Printer, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getAdminOrderDetail, updateOrderStatus, updateOrderShipping } from '@/services/api/admin';
import { downloadInvoice } from '@/services/api/orders';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  product_name: string;
  variant_name?: string | null;
  sku: string;
  quantity: number;
  price: number;
}

interface OrderShipping {
  courier_code?: string;
  courier_service?: string;
  recipient_name?: string;
  phone?: string;
  full_address?: string;
  district?: string;
  city_id?: string;
  province_id?: string;
  postal_code?: string;
  tracking_number?: string;
}

interface Customer {
  name: string;
  email: string;
  phone?: string | null;
}

interface OrderDetailData {
  id: number;
  order_number: string;
  status: string;
  created_at: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  items?: OrderItem[];
  shipping?: OrderShipping | null;
  customer?: Customer | null;
}

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [status, setStatus] = useState('processing');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminOrderDetail(parseInt(orderId));
      setOrder(data);
      setStatus(data.status);
      setTrackingNumber(data.shipping?.tracking_number || '');
    } catch (error) {
      console.error('Gagal memuat detail pesanan:', error);
      toast.error('Gagal memuat detail pesanan');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId, fetchOrderDetail]);

  const handleSaveChanges = async () => {
    if (!order) return;
    setIsSubmitting(true);
    try {
      if (status === 'shipped') {
        if (!trackingNumber.trim()) {
          toast.error('Nomor resi wajib diisi untuk status Sedang Dikirim');
          setIsSubmitting(false);
          return;
        }
        await updateOrderShipping(order.id, trackingNumber.trim());
      } else if (status === 'cancelled') {
        const reason = prompt('Masukkan alasan pembatalan pesanan:');
        if (reason === null) {
          setIsSubmitting(false);
          return; // user cancelled prompt
        }
        if (!reason.trim()) {
          toast.error('Alasan pembatalan harus diisi');
          setIsSubmitting(false);
          return;
        }
        await updateOrderStatus(order.id, 'cancelled', reason.trim());
      } else {
        await updateOrderStatus(order.id, status);
      }
      toast.success('Perubahan pesanan berhasil disimpan');
      fetchOrderDetail();
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Gagal memperbarui pesanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    setIsDownloading(true);
    try {
      const blob = await downloadInvoice(order.order_number);
      const url = window.URL.createObjectURL(new Blob([blob as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order.order_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Invoice berhasil diunduh');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh invoice');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500 flex justify-center items-center gap-2"><Loader2 className="h-6 w-6 animate-spin text-primary-500" /> Memuat detail pesanan...</div>;
  if (!order) return <div className="p-12 text-center text-gray-500">Pesanan tidak ditemukan.</div>;

  const isOrderFinalized = order.status === 'cancelled' || order.status === 'delivered';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pesanan" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black font-heading text-gray-900">Detail Pesanan {order.order_number}</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {new Date(order.created_at).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            className="btn-outline py-2 px-4 flex items-center gap-2 text-sm rounded-xl disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Printer className="h-4 w-4" />
            )}
            Cetak Invoice
          </button>
          <button 
            onClick={handleSaveChanges}
            disabled={isSubmitting || isOrderFinalized}
            className="btn-primary py-2 px-4 flex items-center gap-2 text-sm rounded-xl disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 border border-gray-100 shadow-sm bg-white rounded-2xl">
            <h2 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Produk Dipesan</h2>
            <div className="space-y-4">
              {order.items?.map((item: OrderItem) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.product_name}</h3>
                    <p className="text-sm text-gray-500">{item.variant_name || item.sku} x {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal Produk</span>
                <span>{formatCurrency(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkos Kirim</span>
                <span>{formatCurrency(order.shipping_cost || 0)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Diskon</span>
                <span>-{formatCurrency(order.discount_amount || 0)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-50">
                <span>Total Pembayaran</span>
                <span className="text-primary-600">{formatCurrency(order.total_amount || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 border border-gray-100 shadow-sm bg-white rounded-2xl">
            <h2 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Status Pemrosesan</h2>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              disabled={isOrderFinalized}
              className="input w-full mb-4"
            >
              <option value="pending_payment">Menunggu Pembayaran</option>
              <option value="processing">Sedang Diproses (Dikemas)</option>
              <option value="shipped">Sedang Dikirim</option>
              <option value="delivered">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            
            {status === 'shipped' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nomor Resi</label>
                <input 
                  type="text" 
                  className="input" 
                  value={trackingNumber} 
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={isOrderFinalized}
                  placeholder="Masukkan nomor resi pengiriman"
                />
              </div>
            )}
          </div>

          <div className="card p-6 border border-gray-100 shadow-sm bg-white rounded-2xl">
            <h2 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" /> Pelanggan
            </h2>
            {order.customer ? (
              <>
                <p className="font-semibold text-gray-900">{order.customer.name}</p>
                <p className="text-sm text-gray-500">{order.customer.email}</p>
                <p className="text-sm text-gray-500">{order.customer.phone || '-'}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Info pelanggan tidak tersedia</p>
            )}
          </div>

          <div className="card p-6 border border-gray-100 shadow-sm bg-white rounded-2xl">
            <h2 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" /> Pengiriman
            </h2>
            {order.shipping ? (
              <>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {order.shipping.courier_code?.toUpperCase()} - {order.shipping.courier_service}
                </p>
                <p className="text-xs text-gray-500 mb-2"> Penerima: {order.shipping.recipient_name} ({order.shipping.phone})</p>
                <p className="text-sm text-gray-600 leading-relaxed">{order.shipping.full_address}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.shipping.district}, {order.shipping.city_id}, {order.shipping.province_id} - {order.shipping.postal_code}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">Alamat tidak tersedia</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
