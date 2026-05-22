'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Package, Truck, Clock, CheckCircle2, ChevronLeft, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
// import { getOrderDetails } from '@/services/api/orders';

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch order details
    setTimeout(() => {
      setOrder({
        id: orderId,
        date: '15 Okt 2023, 14:30 WIB',
        status: 'shipped',
        statusLabel: 'Sedang Dikirim',
        resi: 'JP1234567890',
        courier: 'JNT Express - Reguler',
        address: {
          name: 'Budi Santoso',
          phone: '081234567890',
          full: 'Jl. Jend. Sudirman Kav 21, Apartemen Senayan Lt 10 No 5, Jakarta Selatan, DKI Jakarta 12190'
        },
        items: [
          { id: 1, name: 'Gamis Khadijah', variant: 'Hitam - M', price: 350000, qty: 1, image: '/images/placeholder.jpg' },
          { id: 2, name: 'Hijab Instan', variant: 'Navy', price: 85000, qty: 2, image: '/images/placeholder.jpg' }
        ],
        payment: {
          method: 'BCA Virtual Account',
          subtotal: 520000,
          shipping: 15000,
          discount: 20000,
          total: 515000
        }
      });
      setIsLoading(false);
    }, 800);
  }, [orderId]);

  if (isLoading) {
    return <div className="py-20 text-center text-gray-500">Memuat detail pesanan...</div>;
  }

  if (!order) {
    return <div className="py-20 text-center text-gray-500">Pesanan tidak ditemukan.</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/akun/pesanan" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold font-heading text-gray-900">Detail Pesanan</h2>
          <p className="text-sm text-gray-500 mt-0.5">{order.id}</p>
        </div>
      </div>

      <div className="card p-6 border border-gray-100 mb-6 bg-blue-50/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Status Pesanan</p>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-blue-700 text-lg">{order.statusLabel}</h3>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-500 mb-1">Tanggal Pembelian</p>
            <p className="font-semibold text-gray-900">{order.date}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-400" /> Daftar Produk
            </h3>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">{item.variant}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)} x {item.qty}</p>
                      <p className="font-bold text-gray-900">{formatCurrency(item.price * item.qty)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" /> Info Pengiriman
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Kurir</p>
                <p className="font-semibold text-gray-900">{order.courier}</p>
                <p className="text-sm text-gray-500 mt-3 mb-1">No. Resi</p>
                <p className="font-semibold text-primary-600">{order.resi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Alamat</p>
                <p className="font-semibold text-gray-900">{order.address.name}</p>
                <p className="text-sm text-gray-600">{order.address.phone}</p>
                <p className="text-sm text-gray-500 mt-1">{order.address.full}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card p-6 border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Metode Pembayaran</span>
                <span className="font-semibold text-gray-900">{order.payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Harga ({order.items.length} Barang)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(order.payment.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ongkos Kirim</span>
                <span className="font-semibold text-gray-900">{formatCurrency(order.payment.shipping)}</span>
              </div>
              {order.payment.discount > 0 && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Diskon Promo</span>
                  <span>-{formatCurrency(order.payment.discount)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Belanja</span>
              <span className="text-xl font-black text-primary-600">{formatCurrency(order.payment.total)}</span>
            </div>
            
            {order.status === 'delivered' && (
              <button className="w-full btn-primary py-3 rounded-xl mt-6">
                Beli Lagi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
