'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrders } from '@/services/api/orders';
import { Loader2, Package, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/types/order.types';
import { AccountPageHeader } from '@/components/customer/AccountPageHeader';

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
      <AccountPageHeader
        title="Pesanan saya"
        description="Lacak status & riwayat belanja kamu."
      />

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-primary-100 mb-6 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={cn(
              'px-6 py-3.5 text-xs font-display font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all -mb-px cursor-pointer',
              statusFilter === tab.value
                ? 'border-[#0A0A0A] text-[#0A0A0A] font-black'
                : 'border-transparent text-gray-450 hover:text-gray-700'
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
        <div className="text-center py-16 rounded-3xl border border-primary-100 bg-primary-50/20 p-8">
          <Package className="h-10 w-10 text-primary-300 mx-auto mb-4" />
          <h3 className="font-display font-black text-sm text-dark">Belum ada pesanan</h3>
          <p className="text-xs text-gray-500 font-body mt-2 max-w-sm mx-auto">
            Yuk mulai belanja koleksi terbaru!
          </p>
          <Link href="/produk" className="btn-pill-brand inline-flex mt-6 h-11 px-8 text-xs">
            Mulai belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bento-card overflow-hidden !p-0 hover:!translate-y-0">
              <div className="bg-gray-50/50 px-5 py-3.5 border-b border-black/[0.06] flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-display font-bold uppercase tracking-wider text-[#0A0A0A]">{order.order_number}</span>
                  <span className="text-gray-400 font-body">{formatDate(order.created_at)}</span>
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
                      className="w-20 h-20 object-cover rounded-xl border border-black/[0.05]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A] line-clamp-1">{order.items[0].product.name}</h4>
                      <p className="text-[10px] text-gray-400 font-body mt-0.5">Varian: {order.items[0].variant.sku} x {order.items[0].qty}</p>
                      <p className="font-display font-black text-xs text-[#F52D6E] mt-2">{formatCurrency(order.items[0].price)}</p>
                    </div>
                  </div>
                )}
                {order.items && order.items.length > 1 && (
                  <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mt-3 pt-3 border-t border-black/[0.05]">
                    + {order.items.length - 1} produk lainnya
                  </p>
                )}
              </div>

              <div className="px-5 py-4 bg-gray-50/20 flex flex-wrap justify-between items-center gap-4 border-t border-black/[0.06]">
                <div>
                  <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">Total Belanja</p>
                  <p className="font-display font-black text-sm text-[#0A0A0A]">{formatCurrency(order.total_amount)}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/akun/pesanan/${order.order_number}`}
                    className="inline-flex items-center justify-center h-9 px-4 rounded-xl border border-black/10 text-gray-700 font-display font-bold uppercase tracking-wider text-[10px] hover:border-black/20 transition-all cursor-pointer"
                  >
                    Lihat Detail
                  </Link>
                  {order.status === 'pending' && (
                    <button className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white font-display font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer">
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
