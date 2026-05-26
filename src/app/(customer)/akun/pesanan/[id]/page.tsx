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
        <Link href="/akun/pesanan" className="p-2.5 rounded-full border border-primary-100 bg-primary-50/50 text-gray-600 hover:text-primary-600 transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="section-label mb-0.5">Order detail</p>
          <h2 className="font-display font-black text-lg text-dark tracking-tight">#{order.id}</h2>
        </div>
      </div>

      <div className="bento-card mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mb-1">Status Pesanan</p>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#F52D6E]" />
              <h3 className="font-display font-black uppercase text-xs tracking-wider text-[#0A0A0A]">{order.statusLabel}</h3>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mb-1">Tanggal Pembelian</p>
            <p className="text-xs font-body text-gray-900">{order.date}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-black/[0.06] bg-white rounded-2xl p-6">
            <h3 className="font-display font-black uppercase text-xs tracking-wider text-[#0A0A0A] mb-4 pb-2 border-b border-black/[0.06] flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" /> Daftar Produk
            </h3>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-black/[0.05]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A] line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-body mt-0.5">{item.variant}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400 font-body">{formatCurrency(item.price)} x {item.qty}</p>
                      <p className="font-display font-black text-xs text-[#0A0A0A]">{formatCurrency(item.price * item.qty)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-black/[0.06] bg-white rounded-2xl p-6">
            <h3 className="font-display font-black uppercase text-xs tracking-wider text-[#0A0A0A] mb-4 pb-2 border-b border-black/[0.06] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" /> Info Pengiriman
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="text-xs font-body text-gray-500 space-y-1">
                <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">Kurir</p>
                <p className="font-semibold text-gray-900">{order.courier}</p>
                <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 pt-2">No. Resi</p>
                <p className="font-display font-bold text-xs text-[#F52D6E]">{order.resi}</p>
              </div>
              <div className="text-xs font-body text-gray-500 space-y-1">
                <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">Alamat Penerima</p>
                <p className="font-semibold text-gray-900">{order.address.name}</p>
                <p className="text-gray-400">{order.address.phone}</p>
                <p className="text-[10px] text-gray-400 mt-1 max-w-xs">{order.address.full}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="border border-black/[0.06] bg-white rounded-2xl p-6 sticky top-24">
            <h3 className="font-display font-black uppercase text-xs tracking-wider text-[#0A0A0A] mb-4 pb-2 border-b border-black/[0.06]">Ringkasan Pembayaran</h3>
            <div className="space-y-3 mb-6 pb-6 border-b border-black/[0.06] text-xs">
              <div className="flex justify-between font-body text-gray-500">
                <span>Metode Pembayaran</span>
                <span className="font-bold text-gray-900">{order.payment.method}</span>
              </div>
              <div className="flex justify-between font-body text-gray-500">
                <span>Total Harga ({order.items.length} Barang)</span>
                <span className="font-bold text-gray-900">{formatCurrency(order.payment.subtotal)}</span>
              </div>
              <div className="flex justify-between font-body text-gray-500">
                <span>Ongkos Kirim</span>
                <span className="font-bold text-gray-900">{formatCurrency(order.payment.shipping)}</span>
              </div>
              {order.payment.discount > 0 && (
                <div className="flex justify-between font-body text-red-600 font-bold">
                  <span>Diskon Promo</span>
                  <span>-{formatCurrency(order.payment.discount)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-display font-bold uppercase text-xs tracking-wider text-gray-900">Total Belanja</span>
              <span className="text-base font-display font-black text-[#F52D6E]">{formatCurrency(order.payment.total)}</span>
            </div>
            
            {order.status === 'delivered' && (
              <button className="w-full h-11 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white font-display font-bold uppercase tracking-wider text-[11px] rounded-xl mt-6 cursor-pointer">
                Beli Lagi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
