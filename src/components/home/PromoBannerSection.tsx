'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function PromoBannerSection() {
  return (
    <section className="py-8 bg-white border-b border-black/[0.05]">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-4">
          
          {/* Left Column - Image Promo */}
          <div className="relative group overflow-hidden rounded-2xl h-[340px] sm:h-[400px] bg-[#F8F8F8] shadow-sm">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=1200&auto=format&fit=crop")',
              }}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 text-white">
              <span className="inline-block px-2.5 py-1 rounded-md text-[9px] font-display font-black uppercase tracking-wider bg-primary-600 text-white mb-2 shadow-sm">
                Limited Drop
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight">
                Raya Series 2026
              </h3>
              <p className="text-xs text-white/80 font-body mt-1">
                Koleksi terbatas edisi lebaran yang anggun & premium.
              </p>
            </div>
          </div>

          {/* Right Column - Dark Editorial Card */}
          <div className="flex flex-col justify-center bg-[#0A0A0A] text-white p-8 sm:p-12 md:p-14 rounded-2xl h-[340px] sm:h-[400px] shadow-sm relative overflow-hidden">
            {/* Grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
            {/* Ambient Pink Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-primary-600/10 rounded-full blur-[60px]" />
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-primary-500/5 rounded-full blur-[80px]" />

            <div className="relative z-10 space-y-4">
              <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-[0.25em] text-primary-500">
                Exclusively For You
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-[32px] leading-[1.05] tracking-tight uppercase max-w-sm">
                Estetika Modern Untuk Generasi Baru
              </h2>
              <p className="text-xs sm:text-sm text-white/50 font-body leading-relaxed max-w-md">
                Gaya modest yang dirancang khusus untuk kenyamanan aktivitas harianmu, memadukan tradisi dengan estetika street-wear masa kini. Koleksi hijab & busana muslim premium teradem.
              </p>
              <div className="pt-2">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="group inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-white/30 text-white font-display font-bold text-[11px] uppercase tracking-wider hover:bg-white hover:text-[#0A0A0A] hover:border-white transition-all duration-300"
                >
                  Jelajahi Koleksi
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
