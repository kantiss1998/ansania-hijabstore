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

export function EmptyState({ title, description, actionLabel, actionHref, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12 flex flex-col items-center justify-center", className)}>
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <PackageX className="h-10 w-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary py-2.5 px-6 rounded-xl">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
