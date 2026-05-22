'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, User, MapPin, Truck, Save, Printer } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setOrder({
        id: orderId,
        date: '20 Okt 2023, 14:30 WIB',
        customer: { name: 'Budi Santoso', email: 'budi@example.com', phone: '081234567890' },
        address: 'Jl. Jend. Sudirman Kav 21, Apartemen Senayan Lt 10 No 5, Jakarta Selatan, DKI Jakarta 12190',
        shipping: { courier: 'JNT Express - Reguler', resi: 'JP1234567890', cost: 15000 },
        payment: { method: 'BCA Virtual Account', status: 'paid', subtotal: 520000, discount: 20000, total: 515000 },
        items: [
          { id: 1, name: 'Gamis Khadijah', variant: 'Hitam - M', price: 350000, qty: 1 },
          { id: 2, name: 'Hijab Instan', variant: 'Navy', price: 85000, qty: 2 }
        ],
      });
      setStatus('processing');
    }, 500);
  }, [orderId]);

  if (!order) return <div className="p-12 text-center text-gray-500">Memuat detail pesanan...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pesanan" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black font-heading text-gray-900">Detail Pesanan {order.id}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{order.date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline py-2 px-4 flex items-center gap-2 text-sm rounded-xl">
            <Printer className="h-4 w-4" /> Cetak Invoice
          </button>
          <button className="btn-primary py-2 px-4 flex items-center gap-2 text-sm rounded-xl">
            <Save className="h-4 w-4" /> Simpan Perubahan
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Produk Dipesan</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.variant} x {item.qty}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal Produk</span>
                <span>{formatCurrency(order.payment.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkos Kirim</span>
                <span>{formatCurrency(order.shipping.cost)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Diskon</span>
                <span>-{formatCurrency(order.payment.discount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-50">
                <span>Total Pembayaran</span>
                <span className="text-primary-600">{formatCurrency(order.payment.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Status Pemrosesan</h2>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="input w-full mb-4"
            >
              <option value="pending">Menunggu Pembayaran</option>
              <option value="processing">Sedang Diproses (Dikemas)</option>
              <option value="shipped">Sedang Dikirim</option>
              <option value="delivered">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            
            {status === 'shipped' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nomor Resi</label>
                <input type="text" className="input" defaultValue={order.shipping.resi} />
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" /> Pelanggan
            </h2>
            <p className="font-semibold text-gray-900">{order.customer.name}</p>
            <p className="text-sm text-gray-500">{order.customer.email}</p>
            <p className="text-sm text-gray-500">{order.customer.phone}</p>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" /> Pengiriman
            </h2>
            <p className="text-sm font-semibold text-gray-900 mb-1">{order.shipping.courier}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{order.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
