'use client';

import { useQuery } from '@tanstack/react-query';
import { getPublicSettings } from '@/services/api/cms';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

export function WhatsAppBubble() {
  const { t } = useTranslation();

  const { data: settings } = useQuery({
    queryKey: ['publicSettings'],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  });

  const rawWhatsapp = settings?.find(s => s.key === 'social_whatsapp')?.value || '';
  
  // Format the number: remove non-digits, replace leading 0 with 62
  let cleanNumber = rawWhatsapp.replace(/\D/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '62' + cleanNumber.slice(1);
  }
  
  const whatsappNumber = cleanNumber || '6281234567890'; // default fallback

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=Halo%20Ansania%2C%20saya%20ingin%20tanya-tanya%20tentang%20produk...`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 sm:bottom-8 sm:right-8 z-40 bg-[#25D366] text-white p-3.5 rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:bg-[#20ba56] hover:scale-110 transition-all duration-300 group flex items-center gap-2 cursor-pointer"
      title="Hubungi Kami di WhatsApp"
    >
      <MessageCircle className="h-6 w-6 fill-white text-[#25D366]" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out text-sm font-semibold tracking-tight whitespace-nowrap">
        {t('chatCs')}
      </span>
    </a>
  );
}
