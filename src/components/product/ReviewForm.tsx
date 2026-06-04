'use client';

import { useState, useRef } from 'react';
import { Star, ImagePlus, X, Loader2, Send } from 'lucide-react';
import Image from 'next/image';
import { submitReview } from '@/services/api/reviews';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  orderItemId: number;
  productName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ orderItemId, productName, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxImages = 5;
    const remaining = maxImages - images.length;

    if (files.length > remaining) {
      toast.error(`Maksimal ${maxImages} gambar. Sisa slot: ${remaining}`);
      return;
    }

    const validFiles = files.filter(f => {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} terlalu besar (maks 5MB)`);
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Silakan pilih rating terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('order_item_id', String(orderItemId));
      formData.append('rating', String(rating));
      if (title.trim()) formData.append('title', title.trim());
      if (body.trim()) formData.append('body', body.trim());
      images.forEach(img => formData.append('images', img));

      await submitReview(formData);
      toast.success('Ulasan berhasil dikirim! Terima kasih atas feedback kamu 🎉');
      onSuccess?.();
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || 'Gagal mengirim ulasan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white border border-black/[0.05] rounded-3xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#0A0A0A]">
            Tulis Ulasan
          </h3>
          <p className="text-xs text-gray-500 font-body mt-1">
            Untuk: <strong>{productName}</strong>
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Rating Stars */}
      <div className="space-y-2">
        <label className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 cursor-pointer transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  'w-7 h-7 transition-colors',
                  (hoverRating || rating) >= star
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200 fill-gray-200'
                )}
              />
            </button>
          ))}
          {(hoverRating || rating) > 0 && (
            <span className="ml-2 text-xs font-display font-bold text-gray-600">
              {ratingLabels[hoverRating || rating]}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="review-title" className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">
          Judul Ulasan
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ringkasan singkat pengalaman kamu..."
          maxLength={150}
          className="w-full px-4 py-3 text-sm font-body rounded-xl border border-black/[0.08] focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
        />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <label htmlFor="review-body" className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">
          Detail Ulasan
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ceritakan pengalaman kamu menggunakan produk ini..."
          rows={4}
          className="w-full px-4 py-3 text-sm font-body rounded-xl border border-black/[0.08] focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none bg-gray-50/50 placeholder:text-gray-400"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">
          Foto Produk (opsional, maks 5)
        </label>
        <div className="flex flex-wrap gap-2">
          {imagePreviews.map((src, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-xl border border-black/[0.06] overflow-hidden group">
              <Image src={src} alt={`Preview ${idx + 1}`} width={80} height={80} className="w-full h-full object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-300 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-gray-400 hover:text-primary-500"
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-[9px] font-display font-bold uppercase">Tambah</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2 border-t border-black/[0.04]">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-xs font-display font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-display font-bold uppercase tracking-wider bg-[#0A0A0A] text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengirim...
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" /> Kirim Ulasan
            </>
          )}
        </button>
      </div>
    </form>
  );
}
