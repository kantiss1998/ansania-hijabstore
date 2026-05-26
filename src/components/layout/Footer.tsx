'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.84 4.84 0 01-1-.07z" />
    </svg>
  );
}

const SHOP = [
  { name: 'New Arrival', href: `${ROUTES.PRODUCTS}?sort=newest` },
  { name: 'Flash Sale', href: ROUTES.FLASH_SALE },
  { name: 'Semua Produk', href: ROUTES.PRODUCTS },
  { name: 'Kategori', href: '/kategori' },
  { name: 'Brand', href: '/brand' },
];
const HELP = [
  { name: 'Cara Belanja', href: '/cara-belanja' },
  { name: 'Kebijakan Pengiriman', href: '/pengiriman' },
  { name: 'Pengembalian Barang', href: '/retur' },
  { name: 'Hubungi Kami', href: '/kontak' },
  { name: 'Tentang Kami', href: '/tentang' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Stay in the loop — dinonaktifkan sementara */}
      {/* <div className="border-b border-white/[0.06]">...</div> */}

      {/* ── Main Grid ── */}
      <div className="container-main py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-5">
            <div>
              <Link href={ROUTES.HOME}>
                <span className="font-display font-black text-2xl text-white tracking-[-0.05em] hover:text-primary-400 transition-colors">
                  ansania
                </span>
              </Link>
              <p className="text-sm text-white/35 font-body leading-relaxed mt-3">
                Fashion muslim premium untuk generasi modern. Quality meets style.
              </p>
            </div>

            {/* Social Links with handles & follower counts */}
            <div className="space-y-3 pt-2">
              <p className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-white/40">
                Follow Us
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  {
                    icon: InstagramIcon,
                    href: '#',
                    label: '@ansania.official',
                    sub: '12K Followers',
                    bg: 'linear-gradient(135deg, #f43f5e, #a855f7)',
                  },
                  {
                    icon: TikTokIcon,
                    href: '#',
                    label: '@ansania',
                    sub: '8.5K Followers',
                    bg: '#1a1a1a',
                  },
                ].map(({ icon: Icon, href, label, sub, bg }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 transition-all"
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-white group-hover:scale-105 transition-transform"
                      style={{ background: bg }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-display font-bold text-white/80 group-hover:text-white transition-colors">
                        {label}
                      </p>
                      <p className="text-[9px] text-white/40 font-body leading-none mt-0.5">{sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Shop */}
          <FooterGroup title="Belanja" links={SHOP} />

          {/* Help */}
          <FooterGroup title="Bantuan" links={HELP} />

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-[11px] uppercase tracking-[0.15em]">
              Kontak
            </h3>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: 'Jakarta, Indonesia' },
                { icon: Phone, text: '+62 812 3456 7890' },
                { icon: Mail, text: 'halo@ansania.com' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-white/40 text-sm font-body">
                  <Icon className="h-3.5 w-3.5 text-white/25 flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#25D366] text-white text-[12px] font-display font-bold hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/[0.06]">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/25 font-body">
            © {year} ansania. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { name: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
              { name: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
            ].map((l) => (
              <Link key={l.name} href={l.href}
                className="text-[11px] text-white/25 hover:text-white/60 transition-colors font-body">
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-white text-[11px] uppercase tracking-[0.15em]">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.name}>
            <Link href={l.href}
              className="text-sm text-white/35 hover:text-white/70 transition-colors font-body">
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
