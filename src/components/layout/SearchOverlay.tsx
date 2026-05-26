'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const SUGGESTIONS = ['Hijab', 'Gamis', 'Mukena', 'Flash sale'];

export function SearchOverlay() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useUiStore();

  useEffect(() => {
    if (!isSearchOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isSearchOpen, closeSearch]);

  const submit = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    closeSearch();
    router.push(ROUTES.SEARCH(trimmed));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(searchQuery);
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeSearch}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pencarian produk"
        className="relative w-full max-w-xl animate-slide-down"
      >
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-primary-100 bg-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)] overflow-hidden"
        >
          <div className="flex items-center gap-2 border-b border-primary-100/80 px-4 py-3">
            <Search className="h-5 w-5 text-primary-500 shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari hijab, gamis, mukena..."
              className="flex-1 bg-transparent text-base font-body text-dark placeholder:text-gray-400 outline-none"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Tutup pencarian"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 py-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">
              Populer:
            </span>
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => submit(term)}
                className="rounded-md border border-primary-100 bg-primary-50/50 px-2.5 py-1 text-xs font-display font-bold text-primary-700 hover:bg-primary-100 transition-colors"
              >
                {term}
              </button>
            ))}
            <button
              type="submit"
              className={cn(
                'ml-auto btn-pill-brand !py-2 !px-5 !text-xs',
                !searchQuery.trim() && 'opacity-50 pointer-events-none'
              )}
            >
              Cari
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
