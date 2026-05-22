'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  LogIn,
  ChevronDown,
  Sparkles,
  Bell,
  User,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useCartStore } from '@/stores/cartStore';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Produk', href: ROUTES.PRODUCTS },
  { name: 'Kategori', href: '/kategori' },
  { name: 'Flash Sale', href: ROUTES.FLASH_SALE },
  { name: 'Tentang', href: '/tentang' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();
  const { isOpen, openDrawer, items } = useCartStore();
  const cartCount = items.length;

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-gray-200/60 bg-white/95 backdrop-blur-xl shadow-sm'
          : 'bg-white/85 backdrop-blur-md border-b border-transparent'
      )}
    >
      {/* Top Promo Banner */}
      {!scrolled && (
        <div className="bg-gradient-primary text-white py-2 text-center text-xs sm:text-sm animate-fade-in">
          <div className="container-main flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-medium">
              🎉 Gratis Ongkir untuk pembelian di atas{' '}
              <strong>Rp 500.000</strong> — Kode:{' '}
              <strong>GRATIS</strong>
            </span>
          </div>
        </div>
      )}

      <div className="container-main flex h-16 sm:h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="relative flex items-center gap-2 group flex-shrink-0"
        >
          <div className="absolute -inset-2 bg-gradient-primary rounded-xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-300" />
          <span className="relative z-10 font-heading font-black text-xl sm:text-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent transition-all group-hover:scale-105">
            ansania
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-xl hover:bg-primary-50/60 transition-all duration-200 group"
            >
              {link.name}
              <span className="absolute inset-x-4 -bottom-0.5 h-0.5 bg-gradient-primary rounded-full scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm">
          <Link
            href="/produk"
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-500 hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-200 group"
          >
            <Search className="h-4 w-4 group-hover:text-primary-500 transition-colors" />
            <span>Cari hijab, gamis, mukena...</span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search */}
          <Link
            href="/produk"
            className="p-2.5 rounded-full text-gray-600 hover:bg-primary-50 hover:text-primary-600 md:hidden transition-all active:scale-95"
            aria-label="Cari"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Wishlist */}
          <Link
            href={ROUTES.ACCOUNT.WISHLIST}
            className="hidden sm:flex p-2.5 rounded-full text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all relative group"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5 group-hover:fill-primary-500 transition-all" />
          </Link>

          {/* Cart */}
          <button
            onClick={openDrawer}
            className="relative p-2.5 rounded-full text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all active:scale-95"
            aria-label="Keranjang"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold text-white ring-2 ring-white shadow-md animate-scale-in">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* User / Login */}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="hidden md:flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <LogIn className="h-4 w-4" />
            Masuk
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2.5 rounded-full text-gray-600 hover:bg-primary-50 hover:text-primary-600 md:hidden transition-all active:scale-95"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-xl shadow-lg animate-slide-down">
          <div className="container-main py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <Link
                href={ROUTES.AUTH.LOGIN}
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all active:scale-95"
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
