import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CustomerCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function CustomerCard({ children, className, title, icon, action }: CustomerCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-primary-100/80 bg-white p-5 sm:p-6 shadow-[0_16px_48px_-32px_rgba(245,45,110,0.2)]',
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-primary-100/60">
          {title && (
            <h2 className="font-display font-bold text-sm text-dark flex items-center gap-2">
              {icon}
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
