'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  Image as ImageIcon, RefreshCw, Settings, LogOut, Search, Bell
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  const navGroups = [
    {
      title: 'Menu Utama',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: ShoppingCart, label: 'Pesanan', href: '/admin/pesanan' },
        { icon: Users, label: 'Pelanggan', href: '/admin/pelanggan' },
      ]
    },
    {
      title: 'Katalog',
      items: [
        { icon: Package, label: 'Produk', href: '/admin/produk' },
        { icon: Tag, label: 'Kategori', href: '/admin/kategori' },
        { icon: Tag, label: 'Brand', href: '/admin/brand' },
      ]
    },
    {
      title: 'Pemasaran',
      items: [
        { icon: Tag, label: 'Voucher', href: '/admin/voucher' },
        { icon: Tag, label: 'Flash Sale', href: '/admin/flash-sale' },
        { icon: ImageIcon, label: 'Banner', href: '/admin/banner' },
      ]
    },
    {
      title: 'Sistem',
      items: [
        { icon: RefreshCw, label: 'Sinkronisasi Jubelio', href: '/admin/jubelio' },
        { icon: Settings, label: 'Pengaturan', href: '/admin/pengaturan' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-20 flex flex-col hidden lg:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/admin" className="text-xl font-black font-heading text-primary-600">
            ansania <span className="text-gray-400 text-sm font-normal uppercase tracking-widest ml-1">Admin</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide space-y-8">
          {navGroups.map((group, i) => (
            <div key={i}>
              <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-bold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon className={cn('h-5 w-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5 text-red-500" />
            Keluar Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pesanan, pelanggan, atau produk..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || 'Administrator'}</p>
                <p className="text-xs text-gray-500 mt-1">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
