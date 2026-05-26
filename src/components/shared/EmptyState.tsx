import Link from 'next/link';
import { PackageX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-14 text-center',
        className
      )}
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 border border-primary-100">
        <PackageX className="h-9 w-9 text-primary-300" />
      </div>
      <h3 className="font-display text-xl font-black text-dark tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 font-body max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-pill-brand h-11 px-8 text-sm">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
