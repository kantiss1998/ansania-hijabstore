'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Zap, Heart, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';

const TABS = [
  { href: ROUTES.HOME, label: 'Home', icon: Home, match: (p: string) => p === '/' },
  { href: '#keranjang', label: 'Keranjang', icon: ShoppingBag, match: (p: string) => p === '#keranjang' },
  { href: ROUTES.FLASH_SALE, label: 'Sale', icon: Zap, match: (p: string) => p.startsWith('/flash-sale') },
  { href: ROUTES.ACCOUNT.WISHLIST, label: 'Wish', icon: Heart, match: (p: string) => p.includes('/wishlist') },
  { href: ROUTES.ACCOUNT.PROFILE, label: 'Akun', icon: User, match: (p: string) => p.startsWith('/akun') },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { items, openDrawer } = useCartStore();
  const cartCount = items.length;

  const hideOn = ['/checkout', '/masuk', '/daftar'];
  if (hideOn.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-[env(safe-area-inset-bottom)]"
      aria-label="Navigasi utama"
    >
      <div className="mx-3 mb-3 rounded-2xl border border-white/60 bg-white/90 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="flex items-stretch justify-around px-1 py-1.5">
          {TABS.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            const isCart = label === 'Keranjang';
            const showBadge = isCart && cartCount > 0;

            const handleClick = (e: React.MouseEvent) => {
              if (isCart) {
                e.preventDefault();
                openDrawer();
              }
            };

            return (
              <Link
                key={href}
                href={href}
                onClick={handleClick}
                className={cn(
                  'relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-all duration-200',
                  active ? 'text-primary-600' : 'text-gray-400 hover:text-gray-700'
                )}
              >
                {active && !isCart && (
                  <span className="absolute inset-x-2 top-1 h-8 rounded-xl bg-primary-50/90 -z-10" />
                )}
                <span className="relative">
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-transform',
                      active && 'scale-110',
                      label === 'Sale' && active && 'text-primary-600 fill-primary-100'
                    )}
                  />
                  {showBadge && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[9px] font-display font-black text-white">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    'text-[9px] font-display font-bold uppercase tracking-wider',
                    active && 'text-primary-600'
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
