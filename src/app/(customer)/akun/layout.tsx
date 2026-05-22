'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, MapPin, ShoppingBag, Heart, LogOut } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AccountLayout({
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

  const navItems = [
    { icon: User, label: 'Profil Saya', href: '/akun/profil' },
    { icon: MapPin, label: 'Alamat Pengiriman', href: '/akun/alamat' },
    { icon: ShoppingBag, label: 'Pesanan Saya', href: '/akun/pesanan' },
    { icon: Heart, label: 'Wishlist', href: '/akun/wishlist' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-main">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card p-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl uppercase shadow-md shadow-primary-500/20">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{user?.name || 'Pengguna'}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{user?.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary-50 text-primary-600 font-bold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon className={cn('h-5 w-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut className="h-5 w-5 text-red-500" />
                  Keluar
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="card p-6 sm:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
