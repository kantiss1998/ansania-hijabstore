'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useCartStore } from '@/stores/cartStore';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Produk', href: ROUTES.PRODUCTS },
  { name: 'Kategori', href: '/kategori' },
  { name: 'Flash Sale', href: ROUTES.FLASH_SALE, hot: true },
  { name: 'Tentang', href: '/tentang' },
];

const SCROLL_THRESHOLD = 48;

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, toggleSearch } = useUiStore();
  const { openDrawer, items } = useCartStore();
  const cartCount = items.length;

  const overHero = isHome && !scrolled;

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <header
      className={cn(
        'z-50 w-full transition-all duration-300',
        isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
      )}
    >
      {/* Promo — hanya tampil saat sudah scroll (home) atau halaman lain */}
      {(!isHome || scrolled) && (
        <div className="relative overflow-hidden bg-dark text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-transparent to-accent-violet/15 pointer-events-none" />
          <div className="container-main relative flex items-center justify-center gap-2 py-2 text-[10px] sm:text-xs">
            <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-accent-lime/90 px-2 py-0.5 font-display font-black uppercase tracking-wider text-[9px] text-dark">
              Hot
            </span>
            <Sparkles className="h-3 w-3 text-accent-lime shrink-0" />
            <span className="font-body font-medium text-white/90 text-center">
              Gratis ongkir min. <strong className="text-white">Rp 500K</strong>
              <span className="mx-1.5 text-white/30">·</span>
              kode <strong className="font-display text-accent-lime">GRATIS</strong>
            </span>
          </div>
        </div>
      )}

      <div
        className={cn(
          'transition-all duration-300',
          scrolled
            ? 'px-3 sm:px-4 pt-2 pb-2'
            : overHero
              ? 'bg-transparent'
              : 'border-b border-primary-100/60 bg-white'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between gap-3 transition-all duration-300',
            scrolled
              ? cn(
                  'mx-auto max-w-[82rem] h-14 sm:h-[3.25rem] px-4 sm:px-5 rounded-lg',
                  'bg-white/92 backdrop-blur-xl border border-gray-200/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)]'
                )
              : overHero
                ? 'container-main h-16 sm:h-[4.25rem]'
                : 'container-main h-14 sm:h-16'
          )}
        >
          <Link href={ROUTES.HOME} className="group flex shrink-0 items-center gap-1.5">
            <span
              className={cn(
                'font-display text-xl sm:text-2xl font-black tracking-[-0.06em] transition-colors',
                overHero ? 'text-white' : 'text-dark'
              )}
            >
              ansania
            </span>
            <span
              className={cn(
                'mt-1.5 h-1.5 w-1.5 rounded-full transition-colors',
                overHero ? 'bg-accent-lime' : 'bg-primary-500 group-hover:bg-primary-600'
              )}
              aria-hidden
            />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'relative px-3.5 py-2 text-[13px] font-display font-bold rounded-lg transition-all group',
                  overHero
                    ? 'text-white/85 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-dark hover:bg-primary-50/80'
                )}
              >
                {link.name}
                {'hot' in link && link.hot && (
                  <span className={cn('ml-1 inline-block text-[9px]', overHero ? 'text-accent-lime' : 'text-primary-500')}>
                    ⚡
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2">
            <button
              type="button"
              onClick={toggleSearch}
              className={cn(
                'w-full flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm text-left transition-colors cursor-pointer',
                overHero
                  ? 'border-white/25 bg-white/10 text-white/70 hover:bg-white/15 backdrop-blur-sm'
                  : 'border-gray-200/80 bg-gray-50/80 text-gray-500 hover:bg-white hover:border-primary-200'
              )}
            >
              <Search className={cn('h-4 w-4 shrink-0', overHero ? 'text-white' : 'text-primary-500')} />
              <span className="font-body truncate">Cari hijab, gamis, mukena...</span>
            </button>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={toggleSearch}
              className={cn(
                'p-2.5 rounded-lg md:hidden transition-all active:scale-95',
                overHero ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
              )}
              aria-label="Cari produk"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href={ROUTES.ACCOUNT.WISHLIST}
              className={cn(
                'hidden sm:flex p-2.5 rounded-lg transition-all',
                overHero ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
              )}
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <button
              onClick={openDrawer}
              className={cn(
                'relative p-2.5 rounded-lg transition-all active:scale-95',
                overHero ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
              )}
              aria-label="Keranjang"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span
                  className={cn(
                    'absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-600 text-[9px] font-display font-black text-white',
                    overHero ? 'ring-2 ring-dark/30' : 'ring-2 ring-white'
                  )}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            <Link
              href={ROUTES.AUTH.LOGIN}
              className={cn(
                'hidden md:inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-display font-bold transition-all',
                overHero
                  ? 'bg-white text-dark hover:bg-white/90'
                  : 'btn-pill-brand !py-2.5 !px-5 !text-xs'
              )}
            >
              <LogIn className="h-3.5 w-3.5" />
              Masuk
            </Link>

            <button
              onClick={toggleMobileMenu}
              className={cn(
                'p-2.5 rounded-lg md:hidden transition-all active:scale-95',
                overHero ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-primary-50'
              )}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl shadow-lg animate-slide-down">
          <div className="container-main py-4 space-y-1 pb-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-4 py-3 rounded-lg font-display font-bold text-sm text-gray-700 hover:bg-primary-50"
              >
                {link.name}
                {'hot' in link && link.hot && (
                  <span className="text-[10px] font-display font-bold text-primary-600">Live</span>
                )}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100">
              <Link
                href={ROUTES.AUTH.LOGIN}
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center gap-2 btn-pill-brand h-12"
              >
                <LogIn className="h-4 w-4" />
                Masuk / Daftar
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
