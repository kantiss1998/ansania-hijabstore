'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Package, ShoppingCart, 
  ArrowUpRight, ArrowDownRight, Activity, RefreshCw 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
// import { getAdminDashboardMetrics } from '@/services/api/admin'; // TODO: Buat service admin

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch for dashboard metrics
    setTimeout(() => {
      setMetrics({
        revenue: 125000000,
        revenueGrowth: 15.2,
        orders: 1250,
        ordersGrowth: 8.5,
        customers: 3450,
        customersGrowth: 12.3,
        products: 450,
        recentOrders: [
          { id: 'ORD-001', customer: 'Budi Santoso', total: 450000, status: 'pending', date: '2 Menit lalu' },
          { id: 'ORD-002', customer: 'Siti Aminah', total: 850000, status: 'processing', date: '1 Jam lalu' },
          { id: 'ORD-003', customer: 'Rudi Hermawan', total: 1250000, status: 'shipped', date: '3 Jam lalu' },
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-primary-500">
          <Activity className="h-8 w-8 animate-pulse" />
          <p className="text-sm font-semibold animate-pulse">Memuat Data Dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Pendapatan',
      value: formatCurrency(metrics?.revenue || 0),
      trend: metrics?.revenueGrowth,
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Pesanan',
      value: metrics?.orders || 0,
      trend: metrics?.ordersGrowth,
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Total Pelanggan',
      value: metrics?.customers || 0,
      trend: metrics?.customersGrowth,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Total Produk',
      value: metrics?.products || 0,
      trend: null, // No trend for products
      icon: Package,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Ringkasan performa toko Anda hari ini.</p>
        </div>
        <div className="flex gap-2">
          <select className="input py-2 text-sm max-w-[150px]">
            <option>Hari Ini</option>
            <option>7 Hari Terakhir</option>
            <option>30 Hari Terakhir</option>
            <option>Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="card p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              {stat.trend !== null && (
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(stat.trend)}%
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders Chart / Table */}
        <div className="lg:col-span-2 card border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Pesanan Terbaru</h2>
            <button className="text-sm text-primary-600 font-semibold hover:text-primary-700">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Pelanggan</th>
                  <th className="px-6 py-4 font-semibold">Tanggal</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {metrics?.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Jubelio Sync Status */}
        <div className="card border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Status Sistem</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-500" /> Sinkronisasi Jubelio
                </span>
                <span className="badge bg-green-100 text-green-700">Aktif</span>
              </div>
              <p className="text-xs text-gray-500">Terakhir sync: 5 menit yang lalu</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-500" /> Stok Menipis
                </span>
                <span className="badge-warning">12 Item</span>
              </div>
              <p className="text-xs text-gray-500">Perlu restock segera</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
