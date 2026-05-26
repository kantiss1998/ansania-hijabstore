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
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container-main">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          <aside className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-primary-100/80 bg-white shadow-[0_20px_60px_-40px_rgba(245,45,110,0.35)]">
              <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-accent-violet px-6 py-6 text-white">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 font-display text-xl font-black uppercase backdrop-blur-sm ring-2 ring-white/30">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-black text-sm tracking-tight line-clamp-1">
                      {user?.name || 'Pengguna'}
                    </h3>
                    <p className="text-[11px] text-white/70 font-body mt-0.5 line-clamp-1">
                      {user?.email}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent-lime/90 px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-wider text-dark">
                      ★ {user?.loyaltyTier || 'Gold'} Member
                    </span>
                  </div>
                </div>
              </div>

              <nav className="space-y-1 p-4">
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-display font-bold transition-all',
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
                      )}
                    >
                      <item.icon
                        className={cn('h-4 w-4', isActive ? 'text-primary-500' : 'text-gray-400')}
                      />
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-display font-bold text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="rounded-3xl border border-primary-100/60 bg-white/95 p-6 sm:p-8 shadow-[0_16px_48px_-32px_rgba(0,0,0,0.08)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
