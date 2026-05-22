'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrders } from '@/services/api/orders';
import { Loader2, Package, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/types/order.types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getOrders(statusFilter ? { status: statusFilter } : undefined);
        setOrders(res.data || []);
      } catch (error) {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter]);

  const tabs = [
    { value: '', label: 'Semua' },
    { value: 'pending', label: 'Belum Bayar' },
    { value: 'processing', label: 'Dikemas' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'completed', label: 'Selesai' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold font-heading text-gray-900">Pesanan Saya</h2>
        <p className="text-sm text-gray-500 mt-1">Lacak status pesanan dan lihat riwayat belanja Anda.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-100 mb-6 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={cn(
              'px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors -mb-px',
              statusFilter === tab.value
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 text-lg">Tidak Ada Pesanan</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
            Anda belum memiliki pesanan dengan status ini. Yuk, mulai belanja koleksi terbaru kami!
          </p>
          <Link href="/produk" className="btn-primary mt-6">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-gray-900">{order.order_number}</span>
                  <span className="text-gray-500">{formatDate(order.created_at)}</span>
                </div>
                <span className={cn('badge', ORDER_STATUS_COLOR[order.status as keyof typeof ORDER_STATUS_COLOR] || 'bg-gray-100 text-gray-600')}>
                  {ORDER_STATUS_LABEL[order.status as keyof typeof ORDER_STATUS_LABEL] || order.status}
                </span>
              </div>
              
              <div className="p-5">
                {/* Menampilkan 1 item pertama saja sebagai representasi */}
                {order.items && order.items.length > 0 && (
                  <div className="flex gap-4">
                    <img 
                      src={order.items[0].product.thumbnail_url} 
                      alt={order.items[0].product.name} 
                      className="w-20 h-20 object-cover rounded-xl border border-gray-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 line-clamp-1">{order.items[0].product.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Varian: {order.items[0].variant.sku} x {order.items[0].qty}</p>
                      <p className="font-semibold text-primary-600 mt-2">{formatCurrency(order.items[0].price)}</p>
                    </div>
                  </div>
                )}
                {order.items && order.items.length > 1 && (
                  <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50">
                    + {order.items.length - 1} produk lainnya
                  </p>
                )}
              </div>

              <div className="px-5 py-4 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Total Belanja</p>
                  <p className="font-bold text-gray-900 text-lg">{formatCurrency(order.total_amount)}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/akun/pesanan/${order.order_number}`} className="btn-outline py-2 px-4 text-sm">
                    Lihat Detail
                  </Link>
                  {order.status === 'pending' && (
                    <button className="btn-primary py-2 px-4 text-sm">
                      Bayar Sekarang
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
