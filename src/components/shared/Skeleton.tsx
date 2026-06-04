'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-gray-200/80', className)}
      {...props}
    />
  );
}

// Reusable composite skeletons

export function ProductCardSkeleton() {
  return (
    <div className="border border-black/[0.05] rounded-3xl p-4 space-y-4 bg-white">
      {/* Thumbnail */}
      <Skeleton className="aspect-square w-full rounded-2xl" />
      {/* Category */}
      <Skeleton className="h-3 w-16" />
      {/* Title */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      {/* Price */}
      <Skeleton className="h-5 w-24 mt-2" />
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div className="p-5 border border-black/[0.05] rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
      <div className="space-y-2.5 w-full sm:w-auto">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="space-y-2 w-full sm:w-auto flex flex-col sm:items-end">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export function NotificationRowSkeleton() {
  return (
    <div className="p-4 border border-black/[0.05] rounded-2xl flex gap-4 bg-white">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
