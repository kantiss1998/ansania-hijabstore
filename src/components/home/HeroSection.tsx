'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { type Banner } from '@/types/product.types';
import Link from 'next/link';

interface Props {
  banners: Banner[];
}

export function HeroSection({ banners }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(
    () => setCurrentIndex((prev) => (prev + 1) % banners.length),
    [banners.length],
  );
  const prevSlide = useCallback(
    () =>
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length),
    [banners.length],
  );

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => nextSlide(), 6000);
    return () => clearInterval(interval);
  }, [currentIndex, banners.length, isPaused, nextSlide]);

  if (!banners.length) return null;

  const banner = banners[currentIndex];

  return (
    <section
      className="relative w-full h-[100svh] min-h-[560px] max-h-[900px] overflow-hidden bg-dark"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-dark/90 via-dark/35 to-dark/20" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${banner.imageUrl || '/placeholder-banner.jpg'})`,
            }}
          />

          <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 sm:pb-16 md:justify-center md:pb-0">
            <div className="container-main max-w-2xl flex flex-col gap-4 sm:gap-5">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 text-accent-lime" />
                  {banner.subtitle || 'New drop'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-display text-[2rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black leading-[0.95] tracking-[-0.04em] text-white"
              >
                {banner.title}
              </motion.h1>

              {banner.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-lg text-white/75 font-body leading-relaxed max-w-lg"
                >
                  {banner.description}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex flex-wrap gap-3 pt-1"
              >
                <Link
                  href={banner.linkUrl || '/produk'}
                  className="btn-pill-brand h-11 sm:h-12 px-7 sm:px-9 text-sm"
                >
                  {banner.linkText || 'Belanja Sekarang'}
                </Link>
                <Link
                  href="/produk"
                  className="inline-flex h-11 sm:h-12 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-7 font-display text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
                >
                  Lihat Katalog
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 z-30">
        <div className="container-main flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-sm transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-accent-lime'
                  : 'w-4 bg-white/35 hover:bg-white/55'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-6 top-1/2 z-30 -translate-y-1/2 rounded-lg border border-white/20 bg-black/30 p-3 text-white backdrop-blur-md hover:bg-black/45 transition-all active:scale-95"
        aria-label="Sebelumnya"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-6 top-1/2 z-30 -translate-y-1/2 rounded-lg border border-white/20 bg-black/30 p-3 text-white backdrop-blur-md hover:bg-black/45 transition-all active:scale-95"
        aria-label="Berikutnya"
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}
