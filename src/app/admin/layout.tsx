'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  Image as ImageIcon, RefreshCw, Settings, LogOut, Search, Bell,
  Menu, X, ChevronDown, Globe
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
  const { user, logout, isAuthenticated } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Bug #13 fix: auth guard admin — cek isAuthenticated dan role
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`${ROUTES.AUTH.LOGIN}?redirect=/admin`);
      return;
    }
    if (user && user.role !== 'admin') {
      router.replace(ROUTES.HOME);
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

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
      {/* Sidebar Backdrop for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-white border-r border-gray-200 fixed h-full z-30 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/Ansania.png"
              alt="Ansania Logo"
              width={100}
              height={26}
              className="h-5.5 w-auto object-contain"
              priority
            />
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Admin</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
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

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all border border-gray-200"
          >
            <Globe className="h-5 w-5 text-gray-500" />
            Kembali ke Toko
          </Link>
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
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-primary-600 transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pesanan, pelanggan, atau produk..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-none group-hover:text-primary-600 transition-colors">
                    {user?.name || 'Administrator'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Super Admin</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-primary-600 transition-colors" />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 animate-slide-down">
                    <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Administrator'}</p>
                      <p className="text-xs text-gray-500 truncate">Super Admin</p>
                    </div>
                    <Link
                      href="/"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-body transition-colors"
                    >
                      <Globe className="h-4 w-4 text-gray-500" />
                      Kembali ke Toko
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-body cursor-pointer text-left transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      Keluar Admin
                    </button>
                  </div>
                </>
              )}
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
