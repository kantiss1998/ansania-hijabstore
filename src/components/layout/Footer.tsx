'use client';

import Link from 'next/link';
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
  Send,
  Sparkles,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SHOP_LINKS = [
  { name: 'Semua Produk', href: ROUTES.PRODUCTS },
  { name: 'Flash Sale', href: ROUTES.FLASH_SALE },
  { name: 'Kategori', href: '/kategori' },
  { name: 'Tentang Kami', href: '/tentang' },
  { name: 'Produk Baru', href: `${ROUTES.PRODUCTS}?sort=newest` },
];

const HELP_LINKS = [
  { name: 'Cara Belanja', href: '/cara-belanja' },
  { name: 'Kebijakan Pengiriman', href: '/pengiriman' },
  { name: 'Pengembalian Barang', href: '/retur' },
  { name: 'Hubungi Kami', href: '/kontak' },
];

const ACCOUNT_LINKS = [
  { name: 'Akun Saya', href: ROUTES.ACCOUNT.PROFILE },
  { name: 'Pesanan Saya', href: ROUTES.ORDERS },
  { name: 'Wishlist', href: ROUTES.ACCOUNT.WISHLIST },
  { name: 'Notifikasi', href: ROUTES.ACCOUNT.NOTIFICATIONS },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-white to-gray-50/50 pt-16 mt-20 border-t border-gray-100">
      <div className="container-main">
        {/* Newsletter */}
        <div className="mb-16 rounded-4xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 px-6 py-12 text-white shadow-2xl shadow-primary-900/20 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Newsletter</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3 leading-tight">
                Bergabung dengan Komunitas ansania
              </h2>
              <p className="text-primary-100 leading-relaxed">
                Dapatkan penawaran eksklusif, inspirasi gaya hijab, dan koleksi terbaru langsung ke inbox Anda.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 sm:max-w-xs px-5 py-3 rounded-full border-none bg-white/10 text-white placeholder-primary-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white text-primary-900 font-bold hover:bg-primary-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <Send className="h-4 w-4" />
                Berlangganan
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 border-b border-gray-200 pb-12">
          {/* Brand */}
          <div className="space-y-5">
            <Link href={ROUTES.HOME}>
              <span className="text-2xl font-black font-heading bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                ansania
              </span>
            </Link>
            <p className="text-gray-600 leading-relaxed text-sm">
              Destinasi fashion muslim premium dengan kualitas terbaik dan desain modern yang elegan. Sempurnakan penampilan Anda dengan koleksi kami.
            </p>
            <div className="flex gap-3">
              {[
                { icon: InstagramIcon, href: '#', label: 'Instagram', style: { background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' } },
                { icon: FacebookIcon, href: '#', label: 'Facebook', style: { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } },
                { icon: TwitterIcon, href: '#', label: 'Twitter', style: { background: 'linear-gradient(135deg, #38bdf8, #0284c7)' } },
              ].map(({ icon: Icon, href, label, style }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-10 w-10 flex items-center justify-center rounded-full text-white hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={style}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <FooterLinkGroup title="Belanja" links={SHOP_LINKS} />

          {/* Help */}
          <FooterLinkGroup title="Bantuan" links={HELP_LINKS} />

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-gray-900 text-base mb-5 relative inline-block">
              Kontak
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-gradient-primary rounded-full" />
            </h3>
            <ul className="space-y-4 text-gray-600 text-sm">
              <li className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600 mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                  <Mail className="h-4 w-4" />
                </div>
                <span>halo@ansania.com</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-full bg-gradient-primary text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-500">
            © {year} ansania. All rights reserved. Made with ❤️ in Indonesia
          </p>
          <div className="flex items-center gap-6">
            {[
              { name: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
              { name: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-primary-600 scale-x-0 origin-left transition-transform group-hover:scale-x-100 rounded-full" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-heading font-bold text-gray-900 text-base mb-5 relative inline-block">
        {title}
        <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-gradient-primary rounded-full" />
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-all"
            >
              <ArrowRight className="h-3.5 w-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
