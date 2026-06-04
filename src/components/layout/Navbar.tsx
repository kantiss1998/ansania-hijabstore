'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  User,
  Bell,
  CheckCheck,
  Loader2,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useCartStore } from '@/stores/cartStore';
import { useUiStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { cn, formatRelativeTime } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Notification } from '@/services/api/notifications';

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
  const { isAuthenticated, user, checkAuth, logout } = useAuthStore();
  const cartCount = items.length;

  const overHero = isHome && !scrolled;

  // Notifications states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isNotifLoading, setIsNotifLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnreadCount = async () => {
        try {
          const { getUnreadCount } = await import('@/services/api/notifications');
          const data = await getUnreadCount();
          setUnreadCount(data.count || 0);
        } catch (e) {
          console.error(e);
        }
      };
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const handleToggleNotif = async () => {
    const nextState = !isNotifOpen;
    setIsNotifOpen(nextState);
    if (nextState) {
      setIsNotifLoading(true);
      try {
        const { getNotifications } = await import('@/services/api/notifications');
        const data = await getNotifications();
        setNotifications(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsNotifLoading(false);
      }
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const { markRead } = await import('@/services/api/notifications');
      await markRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const { markAllRead } = await import('@/services/api/notifications');
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('Semua notifikasi ditandai telah dibaca');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
          <Link href={ROUTES.HOME} className="group flex shrink-0 items-center">
            <Image
              src="/Ansania.png"
              alt="Ansania Logo"
              width={120}
              height={32}
              className={cn(
                'h-6 sm:h-7 w-auto object-contain transition-all duration-300',
                overHero && 'brightness-0 invert'
              )}
              priority
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

            {mounted && isAuthenticated && (
              <div className="relative hidden sm:block">
                <button
                  onClick={handleToggleNotif}
                  className={cn(
                    'relative p-2.5 rounded-lg transition-all active:scale-95 cursor-pointer',
                    overHero ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                  )}
                  aria-label="Notifikasi"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span
                      className={cn(
                        'absolute right-1 top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-primary-600 text-[8px] font-display font-black text-white px-0.5',
                        overHero ? 'ring-2 ring-dark/30' : 'ring-2 ring-white'
                      )}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-gray-200/80 rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-slide-down">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-b-black/[0.04] bg-gray-50/50">
                        <span className="font-display font-black text-xs uppercase tracking-wider text-[#0A0A0A]">Notifikasi</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="inline-flex items-center gap-1 text-[9px] font-display font-bold uppercase tracking-wider text-primary-600 hover:text-primary-700 cursor-pointer"
                          >
                            <CheckCheck className="h-3 w-3" /> Tandai semua dibaca
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-[360px] overflow-y-auto divide-y divide-black/[0.04] scrollbar-hide">
                        {isNotifLoading ? (
                          <div className="py-8 flex justify-center items-center text-xs text-gray-400 font-body gap-1.5">
                            <Loader2 className="h-4 w-4 animate-spin text-primary-500" /> Memuat...
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="py-12 text-center text-xs text-gray-400 font-body">
                            Tidak ada notifikasi baru
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            let linkUrl = '';
                            try {
                              const parsed = typeof notif.data === 'string' ? JSON.parse(notif.data) : notif.data;
                              const orderNum = parsed?.orderNumber || parsed?.order_number;
                              if (orderNum) {
                                linkUrl = `/akun/pesanan/${orderNum}`;
                              }
                            } catch {}

                            const content = (
                              <div className="p-4 flex gap-3 text-left">
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-2 mb-0.5">
                                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A] line-clamp-1">{notif.title}</h4>
                                    <span className="text-[9px] text-gray-400 font-body shrink-0">
                                      {formatRelativeTime(notif.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 font-body leading-relaxed">{notif.body}</p>
                                </div>
                                {!notif.is_read && (
                                  <span className="h-2 w-2 rounded-full bg-primary-600 shrink-0 mt-1.5" />
                                )}
                              </div>
                            );

                            const onClick = () => {
                              if (!notif.is_read) {
                                handleMarkAsRead(notif.id);
                              }
                              setIsNotifOpen(false);
                            };

                            if (linkUrl) {
                              return (
                                <Link
                                  key={notif.id}
                                  href={linkUrl}
                                  onClick={onClick}
                                  className={cn("block hover:bg-gray-50/50 transition-colors", !notif.is_read && "bg-primary-50/20")}
                                >
                                  {content}
                                </Link>
                              );
                            }

                            return (
                              <button
                                key={notif.id}
                                onClick={onClick}
                                className={cn("w-full block hover:bg-gray-50/50 transition-colors cursor-pointer", !notif.is_read && "bg-primary-50/20")}
                              >
                                {content}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

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

            {mounted && isAuthenticated ? (
              <div className="hidden md:flex relative group">
                <button
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-display font-bold transition-all',
                    overHero
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  )}
                >
                  <User className="h-4 w-4" />
                  {user?.name?.split(' ')[0] || 'Akun'}
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-48 overflow-hidden py-1">
                    {user?.role === 'admin' && (
                      <>
                        <Link href="/admin" className="block px-4 py-2 text-sm font-bold text-primary-600 hover:bg-primary-50 font-body">Halaman Admin</Link>
                        <div className="border-t border-gray-100 my-1"></div>
                      </>
                    )}
                    <Link href={ROUTES.ACCOUNT.PROFILE} className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 font-body">Profil Saya</Link>
                    <Link href="/akun/pesanan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 font-body">Pesanan Saya</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-body cursor-pointer">Keluar</button>
                  </div>
                </div>
              </div>
            ) : (
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
            )}

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
              {mounted && isAuthenticated ? (
                <div className="space-y-1">
                  {user?.role === 'admin' && (
                    <Link href="/admin" onClick={closeMobileMenu} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-display font-bold text-primary-600 hover:bg-primary-50">
                      <Sparkles className="h-4 w-4 text-primary-500" />
                      Halaman Admin
                    </Link>
                  )}
                  <Link href={ROUTES.ACCOUNT.PROFILE} onClick={closeMobileMenu} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-display font-bold text-gray-700 hover:bg-primary-50">
                    <User className="h-4 w-4" />
                    Akun Saya
                  </Link>
                  <Link href="/akun/pesanan" onClick={closeMobileMenu} className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-display font-bold text-gray-700 hover:bg-primary-50">
                    <span className="flex items-center gap-3">
                      <Bell className="h-4 w-4" />
                      Notifikasi Saya
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-primary-600 text-white font-display font-black text-[9px] h-5 min-w-5 flex items-center justify-center rounded-full px-1">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <button onClick={() => { logout(); closeMobileMenu(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-display font-bold text-red-600 hover:bg-red-50 cursor-pointer">
                    <LogIn className="h-4 w-4 rotate-180" />
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  href={ROUTES.AUTH.LOGIN}
                  onClick={closeMobileMenu}
                  className="flex w-full items-center justify-center gap-2 btn-pill-brand h-12"
                >
                  <LogIn className="h-4 w-4" />
                  Masuk / Daftar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
