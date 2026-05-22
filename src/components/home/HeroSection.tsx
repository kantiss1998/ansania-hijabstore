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

  return (
    <section className="container-main py-8 z-10 relative">
      <div
        className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-gray-900 shadow-2xl md:h-[600px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <motion.div
              className="absolute inset-0 bg-gray-800"
              style={{
                backgroundImage: `url(${banners[currentIndex].imageUrl || "/placeholder-banner.jpg"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20">
              <div className="max-w-2xl flex flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white py-2 px-4 rounded-full font-bold text-sm tracking-wide shadow-sm">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    {banners[currentIndex].subtitle || 'Koleksi Terbaru'}
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] text-white drop-shadow-2xl"
                >
                  {banners[currentIndex].title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-2xl text-gray-100 drop-shadow-lg font-light leading-relaxed max-w-xl"
                >
                  {banners[currentIndex].description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap gap-4 pt-2"
                >
                  <Link
                    href={banners[currentIndex].linkUrl || '/produk'}
                    className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-800 text-white font-bold text-base shadow-xl shadow-primary-900/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-1 transition-all"
                  >
                    {banners[currentIndex].linkText || 'Belanja Sekarang'}
                  </Link>
                  <Link
                    href="/produk"
                    className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white font-semibold text-base hover:bg-white/20 transition-all"
                  >
                    Lihat Katalog
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "w-10 bg-white" : "w-3 bg-white/40 hover:bg-white/60"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-4 text-white backdrop-blur-md hover:bg-white/20 transition-all active:scale-95"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-4 text-white backdrop-blur-md hover:bg-white/20 transition-all active:scale-95"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
