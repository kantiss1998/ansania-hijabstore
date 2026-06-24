'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, Trash2, CheckCircle2, XCircle, Clock, Send } from 'lucide-react';
import { getAdminReviews, replyToReview, updateReviewStatus, deleteReview } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  status: 'pending' | 'approved' | 'rejected';
  is_anonymous: boolean;
  created_at: string;
  user_name: string;
  user_email: string;
  product_name: string;
  reply_body: string | null;
  replied_at: string | null;
}

export default function AdminReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Reply input state
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [replyingId, setReplyingId] = useState<number | null>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminReviews({ page, limit, status: statusFilter });
      const payload = data.data || data;
      setReviews(payload.items || []);
      setTotal(payload.total || 0);
    } catch (error) {
      console.error('Gagal memuat ulasan:', error);
      toast.error('Gagal memuat ulasan pelanggan');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, statusFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleStatusChange = async (id: number, newStatus: 'approved' | 'rejected') => {
    const statusText = newStatus === 'approved' ? 'menyetujui' : 'menolak';
    try {
      await updateReviewStatus(id, newStatus);
      toast.success(`Berhasil ${statusText} ulasan`);
      fetchReviews();
    } catch {
      toast.error(`Gagal mengubah status ulasan`);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) return;
    try {
      await deleteReview(id);
      toast.success('Ulasan berhasil dihapus');
      fetchReviews();
    } catch {
      toast.error('Gagal menghapus ulasan');
    }
  };

  const handleSendReply = async (id: number) => {
    const text = replyInputs[id]?.trim();
    if (!text) return;
    
    setReplyingId(id);
    try {
      await replyToReview(id, { body: text });
      toast.success('Balasan ulasan berhasil disimpan');
      setReplyInputs(prev => ({ ...prev, [id]: '' }));
      fetchReviews();
    } catch {
      toast.error('Gagal mengirim balasan');
    } finally {
      setReplyingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-heading text-gray-900">Ulasan Pelanggan</h1>
        <p className="text-gray-500 mt-1">Lihat, beri balasan, dan moderasi ulasan produk dari pelanggan.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-200 pb-px overflow-x-auto">
        {[
          { label: 'Semua Ulasan', value: '' },
          { label: 'Menunggu Moderasi', value: 'pending' },
          { label: 'Disetujui', value: 'approved' },
          { label: 'Ditolak', value: 'rejected' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              statusFilter === tab.value
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="card p-10 text-center text-gray-400 border border-gray-100">
            Memuat ulasan...
          </div>
        ) : reviews.length === 0 ? (
          <div className="card p-10 text-center text-gray-400 border border-gray-100">
            Tidak ada ulasan ditemukan.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="card border border-gray-100 p-5 space-y-4 hover:border-gray-200 transition-colors">
              {/* Product and Rating Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-gray-50">
                <div>
                  <span className="text-xs text-gray-400">Ulasan untuk produk:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{review.product_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{review.rating}/5</span>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-bold text-gray-800">
                    {review.is_anonymous ? 'Anonim' : review.user_name}
                  </span>
                  <span>({review.user_email})</span>
                  <span>•</span>
                  <span>
                    {new Date(review.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {review.title && <h4 className="font-bold text-gray-900 text-sm">{review.title}</h4>}
                <p className="text-gray-700 text-sm leading-relaxed">{review.body || 'Tidak ada isi ulasan.'}</p>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-gray-50 text-xs">
                {/* Moderation Status */}
                <div className="flex items-center gap-1.5">
                  {review.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-bold">
                      <Clock className="w-3.5 h-3.5" /> Menunggu Moderasi
                    </span>
                  )}
                  {review.status === 'approved' && (
                    <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                    </span>
                  )}
                  {review.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-full font-bold">
                      <XCircle className="w-3.5 h-3.5" /> Ditolak
                    </span>
                  )}
                </div>

                {/* Moderation actions */}
                <div className="flex gap-2">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(review.id, 'approved')}
                      className="btn py-1 px-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center gap-1"
                    >
                      Setujui
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(review.id, 'rejected')}
                      className="btn py-1 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1"
                    >
                      Tolak
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Hapus Ulasan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reply Section */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3">
                {review.reply_body ? (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="font-bold text-primary-600 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> Balasan Admin
                      </span>
                      <span>
                        {review.replied_at ? new Date(review.replied_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : '-'}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{review.reply_body}</p>
                    
                    {/* Allow editing reply */}
                    <details className="mt-2 group">
                      <summary className="text-xs text-primary-500 cursor-pointer hover:underline list-none select-none font-bold">
                        Edit Balasan
                      </summary>
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Ubah balasan..."
                          value={replyInputs[review.id] ?? review.reply_body}
                          onChange={(e) => setReplyInputs(prev => ({ ...prev, [review.id]: e.target.value }))}
                          className="input py-1.5 px-3 text-sm flex-1 bg-white"
                        />
                        <button
                          disabled={replyingId === review.id}
                          onClick={() => handleSendReply(review.id)}
                          className="btn btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1 rounded-lg"
                        >
                          <Send className="w-3 h-3" /> Simpan
                        </button>
                      </div>
                    </details>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tulis balasan untuk ulasan ini..."
                      value={replyInputs[review.id] || ''}
                      onChange={(e) => setReplyInputs(prev => ({ ...prev, [review.id]: e.target.value }))}
                      className="input py-1.5 px-3 text-sm flex-1 bg-white"
                    />
                    <button
                      disabled={replyingId === review.id || !replyInputs[review.id]?.trim()}
                      onClick={() => handleSendReply(review.id)}
                      className="btn btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1 rounded-lg"
                    >
                      <Send className="w-3 h-3" /> Kirim
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border border-gray-100 text-xs">
          <span className="text-gray-500 font-semibold">
            Halaman {page} dari {totalPages} (Total {total} ulasan)
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn btn-outline py-1 px-2.5 font-bold rounded-lg text-gray-650 border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-[10px] sm:text-xs"
            >
              Sebelumnya
            </button>
            
            {(() => {
              const pages = [];
              const maxButtons = 5;
              let startPage = Math.max(1, page - 2);
              let endPage = Math.min(totalPages, startPage + maxButtons - 1);
              
              if (endPage - startPage + 1 < maxButtons) {
                startPage = Math.max(1, endPage - maxButtons + 1);
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }

              return (
                <div className="flex items-center gap-1">
                  {startPage > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setPage(1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        1
                      </button>
                      {startPage > 2 && <span className="text-gray-400 px-0.5 font-bold">...</span>}
                    </>
                  )}
                  
                  {pages.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        page === p
                          ? 'bg-[#0A0A0A] text-white border border-[#0A0A0A]'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  {endPage < totalPages && (
                    <>
                      {endPage < totalPages - 1 && <span className="text-gray-400 px-0.5 font-bold">...</span>}
                      <button
                        type="button"
                        onClick={() => setPage(totalPages)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
              );
            })()}

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn btn-outline py-1 px-2.5 font-bold rounded-lg text-gray-650 border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-[10px] sm:text-xs"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
