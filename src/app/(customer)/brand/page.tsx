'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, Award } from 'lucide-react';
import { getBrands } from '@/services/api/products';
import toast from 'react-hot-toast';

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  is_active: number;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getBrands();
        // Handle format returns
        const items = response.data || response || [];
        setBrands(items.filter((b: Brand) => b.is_active === 1));
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat daftar brand');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="container-main space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-display font-black uppercase tracking-wider text-primary-600">
            <Award className="w-3.5 h-3.5" /> Official Brands
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-dark">
            Partner Brand Resmi Kami
          </h1>
          <p className="text-sm text-gray-500 font-body leading-relaxed">
            Jelajahi koleksi busana muslim, hijab, dan aksesoris terbaik dari brand-brand terpercaya yang berkolaborasi dengan kami.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-500 font-body gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <span>Memuat daftar brand...</span>
          </div>
        ) : brands.length === 0 ? (
          <div className="py-20 text-center text-gray-400 border border-dashed border-black/[0.08] rounded-3xl font-body text-xs">
            Belum ada brand resmi terdaftar saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="group relative flex flex-col justify-between p-6 bg-white border border-black/[0.05] rounded-3xl hover:border-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-accent-violet opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="space-y-4">
                  {/* Logo Container */}
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-black/[0.04] group-hover:border-primary-100 transition-colors">
                    {brand.logo_url ? (
                      <Image src={brand.logo_url} alt={brand.name} width={64} height={64} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                    ) : (
                      <span className="font-display font-black text-xl text-gray-400 uppercase">
                        {brand.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Brand Meta */}
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-sm uppercase tracking-wider text-dark group-hover:text-primary-600 transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-body line-clamp-2 leading-relaxed">
                      {brand.description || 'Tidak ada deskripsi ulasan brand.'}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="inline-flex items-center gap-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 group-hover:text-primary-600 pt-4 mt-4 border-t border-black/[0.03] transition-colors">
                  Lihat Produk <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
