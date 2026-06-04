'use client';

import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { Star, MessageSquare, Video, Loader2 } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { ProductDetail, Review, ReviewMedia } from '@/types/product.types';
import { getProductReviews } from '@/services/api/reviews';

interface ProductTabsProps {
  product: ProductDetail;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'review'>('desc');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [withMediaFilter, setWithMediaFilter] = useState<boolean>(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (activeTab === 'review' && product.slug) {
      const fetchReviews = async () => {
        setIsLoadingReviews(true);
        try {
          const params: Record<string, unknown> = {
            page,
            limit: 10,
            rating: ratingFilter || undefined,
            with_media: withMediaFilter ? 'true' : undefined
          };
          const response = await getProductReviews(product.slug, params);
          // Format standard successList payload
          const items = response.reviews || [];
          const count = response.total || 0;
          setReviews(items);
          setTotal(count);
        } catch (e) {
          console.error('Gagal mengambil ulasan:', e);
        } finally {
          setIsLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [activeTab, product.slug, page, ratingFilter, withMediaFilter]);

  const handleRatingFilterChange = (val: string) => {
    setRatingFilter(val);
    setPage(1);
  };

  const handleMediaFilterChange = () => {
    setWithMediaFilter(prev => !prev);
    setPage(1);
  };

  return (
    <div className="mt-16">
      <div className="flex border-b border-black/[0.06] mb-8 overflow-x-auto scrollbar-hide">
        {([
          { key: 'desc', label: 'Deskripsi' },
          { key: 'spec', label: 'Spesifikasi' },
          { key: 'review', label: `Ulasan (${total || product.totalReviews || 0})` },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-6 py-3.5 text-xs font-display font-bold uppercase tracking-wider border-b-2 transition-all -mb-px whitespace-nowrap cursor-pointer',
              activeTab === tab.key
                ? 'border-[#0A0A0A] text-[#0A0A0A] font-black'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'desc' && (
        <div
          className="prose prose-gray max-w-none text-gray-700 font-body text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.description || 'Tidak ada deskripsi.' }}
        />
      )}

      {activeTab === 'spec' && product.specifications && (
        <div className="overflow-hidden rounded-2xl border border-black/[0.06]">
          <table className="w-full text-xs font-body">
            <tbody>
              {Object.entries(product.specifications).map(([key, val], i) => (
                <tr key={key} className={i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                  <td className="px-6 py-4 font-semibold text-gray-700 w-48 border-r border-black/[0.03]">{key}</td>
                  <td className="px-6 py-4 text-gray-600">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'review' && (
        <div className="space-y-8">
          {/* Summary Banner */}
          <div className="grid md:grid-cols-3 gap-6 p-6 bg-gray-50/30 border border-black/[0.05] rounded-3xl items-center">
            <div className="text-center md:border-r border-black/[0.05] py-4">
              <div className="text-6xl font-display font-black text-[#0A0A0A] mb-2 leading-none">
                {Number(product.ratingAverage || 0).toFixed(1)}
              </div>
              <div className="flex justify-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn('h-4 w-4', i < Math.round(product.ratingAverage || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 font-body">dari {total || product.totalReviews || 0} ulasan terverifikasi</p>
            </div>

            {/* Filters */}
            <div className="md:col-span-2 space-y-4 px-2">
              <div>
                <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mb-2">Filter Rating</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Semua', value: '' },
                    { label: '5 ★', value: '5' },
                    { label: '4 ★', value: '4' },
                    { label: '3 ★', value: '3' },
                    { label: '2 ★', value: '2' },
                    { label: '1 ★', value: '1' }
                  ].map(item => (
                    <button
                      key={item.value}
                      onClick={() => handleRatingFilterChange(item.value)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-xl text-[10px] font-display font-bold uppercase tracking-wider transition-all border cursor-pointer',
                        ratingFilter === item.value
                          ? 'bg-[#0A0A0A] text-white border-transparent'
                          : 'bg-white border-black/[0.06] text-gray-600 hover:border-black/20'
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="media-filter"
                  checked={withMediaFilter}
                  onChange={handleMediaFilterChange}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-[#0A0A0A] focus:ring-[#0A0A0A]"
                />
                <label htmlFor="media-filter" className="text-[11px] font-body text-gray-600 cursor-pointer select-none">
                  Hanya tampilkan ulasan dengan foto / video
                </label>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {isLoadingReviews ? (
              <div className="py-12 flex justify-center items-center text-gray-400 gap-2 font-body text-xs">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" /> Memuat ulasan...
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-12 text-center text-gray-400 border border-dashed border-black/[0.08] rounded-3xl font-body text-xs">
                Tidak ada ulasan yang sesuai dengan filter.
              </div>
            ) : (
              reviews.map((rev: Review) => (
                <div key={rev.id} className="p-6 border border-black/[0.05] rounded-3xl space-y-4 hover:border-black/[0.09] transition-colors bg-white">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <div className="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center font-display text-xs font-black uppercase text-gray-400 border border-black/[0.04] overflow-hidden">
                        {rev.reviewer_avatar ? (
                          <NextImage src={rev.reviewer_avatar} alt={rev.reviewer_name} fill className="object-cover rounded-xl" unoptimized />
                        ) : (
                          rev.reviewer_name?.charAt(0) || 'A'
                        )}
                      </div>
                      <div>
                        <h5 className="text-xs font-display font-bold uppercase tracking-wider text-dark">{rev.reviewer_name}</h5>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn('h-3 w-3', i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-body">{formatDate(rev.created_at)}</span>
                  </div>

                  {/* Body */}
                  <div className="space-y-3 pl-12">
                    {rev.title && <h6 className="text-xs font-display font-black uppercase tracking-wider text-[#0a0a0a]">{rev.title}</h6>}
                    <p className="text-xs text-gray-600 font-body leading-relaxed">{rev.body}</p>

                    {/* Media attachments */}
                    {rev.media && rev.media.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {rev.media.map((med: ReviewMedia) => (
                          <div key={med.id} className="relative w-16 h-16 rounded-xl border border-black/[0.05] overflow-hidden group">
                            {med.type?.includes('video') ? (
                              <div className="w-full h-full bg-gray-950 flex items-center justify-center text-white">
                                <Video className="w-5 h-5 opacity-70" />
                              </div>
                            ) : (
                              <NextImage src={med.url} alt="Review attachment" fill className="object-cover hover:scale-105 transition-transform" unoptimized />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Admin Reply */}
                    {rev.reply && (
                      <div className="mt-4 p-4 bg-gray-50 border border-black/[0.03] rounded-2xl space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-display uppercase tracking-wider">
                          <span className="font-black text-primary-600 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> Balasan Dari {rev.reply.admin_name || 'Admin'}
                          </span>
                          <span className="text-gray-400 font-body">{formatDate(rev.reply.created_at)}</span>
                        </div>
                        <p className="text-xs text-gray-600 font-body leading-relaxed">{rev.reply.body}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {total > 10 && (
            <div className="flex justify-between items-center pt-4 border-t border-black/[0.05] text-xs font-body text-gray-500">
              <span>Menampilkan {((page - 1) * 10) + 1}-{Math.min(page * 10, total)} dari {total} ulasan</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="btn btn-outline py-1 px-3 text-xs"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={page * 10 >= total}
                  onClick={() => setPage(p => p + 1)}
                  className="btn btn-outline py-1 px-3 text-xs"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
