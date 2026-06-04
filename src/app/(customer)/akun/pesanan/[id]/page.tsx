'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  ChevronLeft, 
  MapPin, 
  CreditCard, 
  XCircle, 
  FileText, 
  Loader2, 
  Star, 
  Camera, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  getOrderDetails, 
  cancelOrder, 
  confirmReceived, 
  downloadInvoice, 
  getPaymentToken 
} from '@/services/api/orders';
import { submitReview } from '@/services/api/reviews';
import { ORDER_STATUS_LABEL } from '@/types/order.types';
import type { OrderStatus } from '@/types/order.types';
import toast from 'react-hot-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { OrderTrackingTimeline } from '@/components/customer/OrderTrackingTimeline';

interface WindowWithSnap extends Window {
  snap: {
    pay: (token: string, options: {
      onSuccess: () => void;
      onPending: () => void;
      onError: () => void;
      onClose: () => void;
    }) => void;
  };
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface ReviewingItem {
  id: number;
  product?: {
    name: string;
    thumbnail_url: string;
  };
  name?: string;
  image?: string;
  variant?: {
    sku: string;
  };
}

interface OrderItem {
  id: number;
  price: number;
  qty: number;
  is_reviewed?: boolean;
  product?: {
    name: string;
    thumbnail_url: string;
  };
  variant?: {
    sku: string;
  };
}

interface OrderDetails {
  order_number: string;
  created_at: string;
  status: OrderStatus;
  shipping_tracking_number: string | null;
  shipping_courier: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  payment_method: string | null;
  total_amount: number;
  order_items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  // React Query Fetch
  const { data: rawOrder, isLoading, refetch } = useQuery<OrderDetails>({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetails(orderId),
  });

  // Action states
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Review states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingItem, setReviewingItem] = useState<ReviewingItem | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [reviewedItemIds, setReviewedItemIds] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mutations
  const payMutation = useMutation({
    mutationFn: () => getPaymentToken(orderId),
    onSuccess: (res: { snap_token?: string; token?: string }) => {
      const token = res.snap_token || res.token || (res as unknown as string);
      if (token) {
        (window as unknown as WindowWithSnap).snap.pay(token, {
          onSuccess: () => {
            toast.success('Pembayaran berhasil!');
            refetch();
          },
          onPending: () => {
            toast.success('Silakan selesaikan pembayaran Anda.');
            refetch();
          },
          onError: () => {
            toast.error('Pembayaran gagal. Silakan coba kembali.');
          },
          onClose: () => {
            toast.error('Anda menutup panel pembayaran.');
          }
        });
      } else {
        toast.error('Gagal memuat token pembayaran.');
      }
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.response?.data?.message || 'Gagal memproses pembayaran');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => cancelOrder(orderId, reason),
    onSuccess: () => {
      toast.success('Pesanan berhasil dibatalkan');
      setIsCancelModalOpen(false);
      refetch();
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.response?.data?.message || 'Gagal membatalkan pesanan');
    }
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmReceived(orderId),
    onSuccess: () => {
      toast.success('Pesanan telah diselesaikan! Terima kasih.');
      refetch();
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.response?.data?.message || 'Gagal menyelesaikan pesanan');
    }
  });

  const downloadMutation = useMutation({
    mutationFn: () => downloadInvoice(orderId),
    onSuccess: (blob: unknown) => {
      const url = window.URL.createObjectURL(new Blob([blob as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Invoice berhasil diunduh');
    },
    onError: () => {
      toast.error('Gagal mengunduh invoice');
    }
  });

  const reviewMutation = useMutation({
    mutationFn: (formData: FormData) => submitReview(formData),
    onSuccess: () => {
      toast.success('Ulasan berhasil dikirim!');
      if (reviewingItem) {
        setReviewedItemIds(prev => [...prev, reviewingItem.id]);
      }
      setIsReviewModalOpen(false);
    },
    onError: (err: ApiErrorResponse) => {
      toast.error(err.response?.data?.message || 'Gagal mengirimkan ulasan');
    }
  });

  // Load Midtrans Snap script when pending payment
  useEffect(() => {
    if (rawOrder?.status === 'pending_payment') {
      const scriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js';
      const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
      
      const scriptTag = document.createElement('script');
      scriptTag.src = scriptUrl;
      scriptTag.setAttribute('data-client-key', clientKey || '');
      document.body.appendChild(scriptTag);
      
      return () => {
        document.body.removeChild(scriptTag);
      };
    }
  }, [rawOrder?.status]);

  const handlePayNow = () => {
    payMutation.mutate();
  };

  const handleCancelOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      toast.error('Tuliskan alasan pembatalan');
      return;
    }
    cancelMutation.mutate(cancelReason);
  };

  const handleConfirmReceived = () => {
    if (!confirm('Apakah Anda yakin pesanan sudah sampai dan ingin menyelesaikan pesanan?')) {
      return;
    }
    confirmMutation.mutate();
  };

  const handleDownloadInvoice = () => {
    downloadMutation.mutate();
  };

  // Reviews logic
  const openReviewModal = (item: OrderItem) => {
    setReviewingItem(item);
    setRating(5);
    setReviewTitle('');
    setReviewBody('');
    setIsAnonymous(false);
    setSelectedFiles([]);
    setFilePreviews([]);
    setIsReviewModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedFiles.length + filesArray.length > 5) {
        toast.error('Maksimal hanya 5 file media.');
        return;
      }
      
      const newFiles = [...selectedFiles, ...filesArray];
      setSelectedFiles(newFiles);

      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setFilePreviews([...filePreviews, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);

    const updatedPreviews = [...filePreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setFilePreviews(updatedPreviews);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingItem) return;

    const formData = new FormData();
    formData.append('order_item_id', reviewingItem.id.toString());
    formData.append('rating', rating.toString());
    formData.append('title', reviewTitle);
    formData.append('body', reviewBody);
    formData.append('is_anonymous', isAnonymous ? 'true' : 'false');

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    reviewMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-500 font-body gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#F52D6E]" />
        <span>Memuat detail pesanan...</span>
      </div>
    );
  }

  if (!rawOrder) {
    return <div className="py-20 text-center text-gray-500 font-body">Pesanan tidak ditemukan.</div>;
  }

  const order = {
    id: rawOrder.order_number,
    date: formatDate(rawOrder.created_at),
    status: rawOrder.status,
    statusLabel: ORDER_STATUS_LABEL[rawOrder.status as keyof typeof ORDER_STATUS_LABEL] || rawOrder.status,
    resi: rawOrder.shipping_tracking_number || 'Belum tersedia',
    courier: rawOrder.shipping_courier || 'Reguler',
    address: {
      name: rawOrder.shipping_name || 'Penerima',
      phone: rawOrder.shipping_phone || '',
      full: rawOrder.shipping_address || 'Alamat tidak tersedia'
    },
    items: rawOrder.order_items || [],
    payment: {
      method: rawOrder.payment_method || 'Transfer Bank',
      subtotal: rawOrder.total_amount,
      shipping: 0,
      discount: 0,
      total: rawOrder.total_amount
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/akun/pesanan" className="p-2.5 rounded-full border border-primary-100 bg-primary-50/50 text-gray-600 hover:text-primary-600 transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="section-label mb-0.5">Order detail</p>
          <h2 className="font-display font-black text-lg text-dark tracking-tight">#{order.id}</h2>
        </div>
      </div>

      <div className="bento-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mb-1">Status Pesanan</p>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#F52D6E]" />
              <h3 className="font-display font-black uppercase text-xs tracking-wider text-[#0A0A0A]">{order.statusLabel}</h3>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 mb-1">Tanggal Pembelian</p>
            <p className="text-xs font-body text-gray-900">{order.date}</p>
          </div>
        </div>
      </div>

      <OrderTrackingTimeline 
        status={order.status}
        resi={order.resi}
        courier={order.courier}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-black/[0.06] bg-white rounded-2xl p-6">
            <h3 className="font-display font-black uppercase text-xs tracking-wider text-[#0A0A0A] mb-4 pb-2 border-b border-black/[0.06] flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" /> Daftar Produk
            </h3>
            <div className="space-y-4">
              {order.items.map((item: OrderItem) => {
                const isReviewed = reviewedItemIds.includes(item.id) || item.is_reviewed;
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-black/[0.05]">
                      <Image src={item.product?.thumbnail_url || item.product?.thumbnail_url || '/placeholder.png'} alt={item.product?.name || 'Produk'} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A] line-clamp-1">{item.product?.name || 'Produk'}</h4>
                        {order.status === 'delivered' && (
                          <button
                            disabled={isReviewed}
                            onClick={() => openReviewModal(item)}
                            className={`flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-display font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                              isReviewed 
                                ? 'bg-gray-55 border-transparent text-gray-400 cursor-not-allowed'
                                : 'border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
                            }`}
                          >
                            <Star className={`h-3 w-3 ${isReviewed ? 'fill-gray-400' : 'fill-amber-400 text-amber-500'}`} />
                            {isReviewed ? 'Sudah Diulas' : 'Ulas'}
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-body mt-0.5">Varian: {item.variant?.sku || '-'}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-400 font-body">{formatCurrency(item.price)} x {item.qty}</p>
                        <p className="font-display font-black text-xs text-[#0A0A0A]">{formatCurrency(item.price * item.qty)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-black/[0.06] bg-white rounded-2xl p-6">
            <h3 className="font-display font-black uppercase text-xs tracking-wider text-[#0A0A0A] mb-4 pb-2 border-b border-black/[0.06] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" /> Info Pengiriman
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="text-xs font-body text-gray-500 space-y-1">
                <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">Kurir</p>
                <p className="font-semibold text-gray-900">{order.courier}</p>
                <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400 pt-2">No. Resi</p>
                <p className="font-display font-bold text-xs text-[#F52D6E]">{order.resi}</p>
              </div>
              <div className="text-xs font-body text-gray-500 space-y-1">
                <p className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">Alamat Penerima</p>
                <p className="font-semibold text-gray-900">{order.address.name}</p>
                {order.address.phone && <p className="text-gray-400">{order.address.phone}</p>}
                <p className="text-[10px] text-gray-400 mt-1 max-w-xs">{order.address.full}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="border border-black/[0.06] bg-white rounded-2xl p-6 sticky top-24 space-y-6">
            <div>
              <h3 className="font-display font-black uppercase text-xs tracking-wider text-[#0A0A0A] mb-4 pb-2 border-b border-black/[0.06]">Ringkasan Pembayaran</h3>
              <div className="space-y-3 text-xs mb-4">
                <div className="flex justify-between font-body text-gray-500">
                  <span>Metode Pembayaran</span>
                  <span className="font-bold text-gray-900">{order.payment.method}</span>
                </div>
                <div className="flex justify-between font-body text-gray-500">
                  <span>Total Harga ({order.items.length} Barang)</span>
                  <span className="font-bold text-gray-900">{formatCurrency(order.payment.subtotal)}</span>
                </div>
                <div className="flex justify-between font-body text-gray-500">
                  <span>Ongkos Kirim</span>
                  <span className="font-bold text-gray-900">{formatCurrency(order.payment.shipping)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-black/[0.06]">
                <span className="font-display font-bold uppercase text-xs tracking-wider text-gray-900">Total Belanja</span>
                <span className="text-base font-display font-black text-[#F52D6E]">{formatCurrency(order.payment.total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {order.status === 'pending_payment' && (
                <>
                  <button
                    disabled={payMutation.isPending}
                    onClick={handlePayNow}
                    className="w-full h-11 bg-dark hover:bg-dark-hover text-white font-display font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {payMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    Bayar Sekarang
                  </button>

                  <button
                    disabled={cancelMutation.isPending}
                    onClick={() => setIsCancelModalOpen(true)}
                    className="w-full h-11 border border-red-200 text-red-600 hover:bg-red-50 font-display font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Batalkan Pesanan
                  </button>
                </>
              )}

              {order.status === 'shipped' && (
                <button
                  disabled={confirmMutation.isPending}
                  onClick={handleConfirmReceived}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-display font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {confirmMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Konfirmasi Diterima
                </button>
              )}

              {order.status !== 'pending_payment' && order.status !== 'cancelled' && (
                <button
                  disabled={downloadMutation.isPending}
                  onClick={handleDownloadInvoice}
                  className="w-full h-11 border border-black/10 text-gray-700 hover:border-black/25 font-display font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {downloadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  Unduh Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Reason Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-black/[0.05] animate-scale-up">
            <h3 className="font-display font-black uppercase text-sm tracking-wider text-[#0A0A0A] mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" /> Batalkan Pesanan
            </h3>
            <p className="text-xs text-gray-500 font-body mb-4">
              Apakah Anda yakin ingin membatalkan pesanan ini? Stok barang akan segera dipulihkan setelah dibatalkan.
            </p>
            <form onSubmit={handleCancelOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Alasan Pembatalan</label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Tuliskan alasan Anda (misal: ingin mengganti varian/alamat)..."
                  className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 h-10 rounded-xl text-[10px] font-display font-bold uppercase tracking-wider border border-black/10 text-gray-500 hover:border-black/20 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={cancelMutation.isPending}
                  className="px-6 h-10 rounded-xl text-[10px] font-display font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {cancelMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  Batalkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && reviewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-black/[0.05] max-h-[90vh] overflow-y-auto animate-scale-up scrollbar-hide">
            <h3 className="font-display font-black uppercase text-sm tracking-wider text-[#0A0A0A] mb-4 pb-2 border-b border-black/[0.06]">
              Tulis Ulasan Produk
            </h3>
            
            <div className="flex gap-4 mb-5 pb-5 border-b border-black/[0.04]">
              <Image src={reviewingItem.product?.thumbnail_url || reviewingItem.image || '/placeholder.png'} alt={reviewingItem.product?.name || reviewingItem.name || 'Produk'} width={56} height={56} className="w-14 h-14 object-cover rounded-xl border border-black/[0.05]" unoptimized />
              <div>
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A] line-clamp-1">{reviewingItem.product?.name || reviewingItem.name || 'Produk'}</h4>
                <p className="text-[9px] text-gray-400 font-body mt-0.5">Varian: {reviewingItem.variant?.sku || '-'}</p>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500">Rating Produk</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-all hover:scale-110 active:scale-95"
                    >
                      <Star 
                        className={`h-7 w-7 ${
                          star <= rating 
                            ? 'fill-amber-400 text-amber-500' 
                            : 'text-gray-200 hover:text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Judul Ulasan</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Misal: Kualitas sangat bagus, bahan adem"
                  className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Comment Body */}
              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Detail Ulasan</label>
                <textarea
                  required
                  rows={4}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda mengenai produk ini (ukuran, bahan, warna)..."
                  className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous-checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#F52D6E] focus:ring-[#F52D6E]"
                />
                <label htmlFor="anonymous-checkbox" className="text-xs font-body text-gray-500 cursor-pointer">
                  Kirim ulasan sebagai Anonim
                </label>
              </div>

              {/* Media Upload */}
              <div className="space-y-2">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500">
                  Foto / Video Pendukung (Maksimal 5)
                </label>
                
                <div className="flex flex-wrap gap-2.5">
                  {filePreviews.map((src, index) => (
                    <div key={index} className="relative w-16 h-16 border border-black/[0.08] rounded-xl overflow-hidden group">
                      <Image src={src} alt="Upload preview" width={64} height={64} className="w-full h-full object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {selectedFiles.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 border border-dashed border-black/10 rounded-xl hover:border-black/20 flex flex-col items-center justify-center text-gray-400 transition-colors cursor-pointer"
                    >
                      <Camera className="h-5 w-5 mb-0.5" />
                      <span className="text-[8px] font-display font-bold uppercase tracking-wider">Upload</span>
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 h-10 rounded-xl text-[10px] font-display font-bold uppercase tracking-wider border border-black/10 text-gray-500 hover:border-black/20 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="px-6 h-10 rounded-xl text-[10px] font-display font-bold uppercase tracking-wider bg-dark hover:bg-dark-hover text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {reviewMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  Kirim Ulasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
