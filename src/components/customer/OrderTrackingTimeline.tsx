'use client';

import { Check, CreditCard, Package, Truck, Smile, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/order.types';

interface OrderTrackingTimelineProps {
  status: OrderStatus;
  resi?: string;
  courier?: string;
}

export function OrderTrackingTimeline({ status, resi, courier }: OrderTrackingTimelineProps) {
  // If cancelled, show a specific simple cancelled state
  if (status === 'cancelled') {
    return (
      <div className="p-5 border border-red-100 bg-red-50/10 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-500 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-display font-black text-xs uppercase tracking-wider text-red-600 mb-0.5">Pesanan Dibatalkan</h4>
          <p className="text-xs text-gray-500 font-body leading-relaxed">
            Pesanan ini telah dibatalkan. Dana pembayaran Anda akan dikembalikan jika sesuai dengan kebijakan pengembalian kami.
          </p>
        </div>
      </div>
    );
  }

  // Standard steps
  const steps = [
    {
      key: 'pending_payment',
      label: 'Dipesan',
      description: 'Menunggu Pembayaran',
      icon: CreditCard
    },
    {
      key: 'processing',
      label: 'Diproses',
      description: 'Pesanan Sedang Dikemas',
      icon: Package
    },
    {
      key: 'shipped',
      label: 'Dikirim',
      description: resi && resi !== 'Belum tersedia' ? `${courier} - ${resi}` : 'Pesanan Sedang Dikirim',
      icon: Truck
    },
    {
      key: 'delivered',
      label: 'Selesai',
      description: 'Pesanan Telah Tiba',
      icon: Smile
    }
  ];

  // Helper to determine step status
  const getStepIndex = (statusStr: string) => {
    switch (statusStr) {
      case 'pending_payment':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="p-6 border border-black/[0.05] bg-white rounded-3xl space-y-6">
      <h3 className="font-display font-black uppercase text-xs tracking-wider text-[#0A0A0A] pb-2 border-b border-black/[0.05]">
        Status Pelacakan Pesanan
      </h3>

      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 md:px-4 py-2">
        {/* Progress Line for Desktop */}
        <div className="absolute top-[23px] left-[32px] right-[32px] h-0.5 bg-gray-100 hidden md:block" aria-hidden="true">
          <div
            className="h-full bg-primary-500 transition-all duration-500 ease-out"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          
          return (
            <div key={step.key} className="flex md:flex-col items-center gap-4 md:gap-2.5 relative z-10 w-full md:w-auto text-left md:text-center flex-1">
              {/* Step Circle / Badge */}
              <div
                className={cn(
                  'w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 border shadow-sm',
                  isCompleted
                    ? 'bg-primary-500 text-white border-transparent'
                    : isActive
                      ? 'bg-primary-50 border-primary-200 text-primary-500 scale-105 ring-4 ring-primary-50/30'
                      : 'bg-white border-black/[0.05] text-gray-300'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[3px]" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>

              {/* Step Labels */}
              <div className="space-y-0.5 min-w-0">
                <p
                  className={cn(
                    'font-display text-[10px] sm:text-xs font-black uppercase tracking-wider',
                    isActive ? 'text-primary-600' : isCompleted ? 'text-dark' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-gray-400 font-body truncate max-w-[120px] md:max-w-none">
                  {isActive ? step.description : isCompleted ? 'Selesai' : 'Belum Mulai'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
