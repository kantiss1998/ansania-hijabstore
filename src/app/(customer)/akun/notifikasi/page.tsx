'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Trash2, Calendar, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import { getNotifications, markRead, markAllRead, deleteNotification } from '@/services/api/notifications';
import type { Notification } from '@/services/api/notifications';
import { formatRelativeTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AccountNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifs = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Gagal memuat notifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);


  const handleMarkAllRead = async () => {
    if (notifications.filter(n => !n.is_read).length === 0) return;
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      toast.success('Semua notifikasi ditandai telah dibaca');
    } catch {
      toast.error('Gagal memperbarui notifikasi');
    }
  };

  const handleDeleteNotif = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus notifikasi ini?')) return;
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notifikasi berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus notifikasi');
    }
  };

  const handleNotifClick = async (notif: Notification) => {
    if (!notif.is_read) {
      await markRead(notif.id);
      setNotifications(prev =>
        prev.map(n => n.id === notif.id ? { ...n, is_read: 1 } : n)
      );
    }

    // Try to parse order redirection
    try {
      const parsed = typeof notif.data === 'string' ? JSON.parse(notif.data) : notif.data;
      const orderNum = parsed?.orderNumber || parsed?.order_number;
      if (orderNum) {
        router.push(`/akun/pesanan/${orderNum}`);
      }
    } catch (err) {
      console.error('Redirection parse error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="section-label mb-0.5">Notifikasi Akun</p>
          <h2 className="font-display font-black text-lg text-dark tracking-tight">Semua Pemberitahuan</h2>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-black/10 hover:border-black/25 text-gray-700 text-xs font-display font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Tandai Semua Dibaca
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 font-body gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          <span>Memuat notifikasi...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/30 border border-black/[0.05] rounded-3xl">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="font-display font-bold text-sm text-[#0A0A0A] mb-1">Kotak Masuk Kosong</h4>
          <p className="text-xs text-gray-400 font-body">Anda belum menerima notifikasi apa pun saat ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const hasLink = (() => {
              try {
                const parsed = typeof notif.data === 'string' ? JSON.parse(notif.data) : notif.data;
                return !!(parsed?.orderNumber || parsed?.order_number);
              } catch {
                return false;
              }
            })();

            return (
              <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`relative group p-4 border rounded-2xl flex gap-4 transition-all ${
                  hasLink ? 'cursor-pointer hover:border-primary-200 hover:shadow-sm' : ''
                } ${
                  notif.is_read
                    ? 'border-black/[0.05] bg-white'
                    : 'border-primary-100 bg-primary-50/10'
                }`}
              >
                {/* Status Dot */}
                {!notif.is_read && (
                  <span className="absolute top-4 left-4 h-2.5 w-2.5 rounded-full bg-primary-600 ring-4 ring-primary-50/20" />
                )}

                {/* Left Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  notif.is_read
                    ? 'bg-gray-50 border-black/[0.05] text-gray-400'
                    : 'bg-primary-50 border-primary-100 text-primary-500'
                } ${!notif.is_read ? 'pl-2' : ''}`}>
                  <ShoppingBag className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className={`font-display text-xs uppercase tracking-wider line-clamp-1 ${
                      notif.is_read ? 'font-bold text-gray-800' : 'font-black text-dark'
                    }`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-body flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3" /> {formatRelativeTime(notif.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-body leading-relaxed">{notif.body}</p>
                  
                  {hasLink && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-display font-bold uppercase tracking-wider text-primary-600 group-hover:text-primary-700 mt-2">
                      Lihat Pesanan <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>

                {/* Delete / Actions Right */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    onClick={(e) => handleDeleteNotif(e, notif.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                    title="Hapus Notifikasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
