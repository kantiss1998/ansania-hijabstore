import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: { [key: string]: string | undefined };
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    const query = params.toString();
    return `${baseUrl}${query ? `?${query}` : ''}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center gap-2">
      <Link
        href={getPageUrl(currentPage - 1)}
        className={cn(
          'p-2 rounded-xl border border-gray-200 text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-all',
          currentPage <= 1 && 'opacity-50 pointer-events-none'
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      
      <div className="flex gap-1">
        {pages.map((page) => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all',
              currentPage === page
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
            )}
          >
            {page}
          </Link>
        ))}
      </div>

      <Link
        href={getPageUrl(currentPage + 1)}
        className={cn(
          'p-2 rounded-xl border border-gray-200 text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-all',
          currentPage >= totalPages && 'opacity-50 pointer-events-none'
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}
