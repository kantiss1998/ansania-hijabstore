import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

interface InfoPageLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function InfoPageLayout({
  eyebrow,
  title,
  description,
  children,
}: InfoPageLayoutProps) {
  return (
    <div className="min-h-[70vh]">
      <div className="relative overflow-hidden bg-dark text-white py-12 sm:py-14 noise-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-accent-violet/10 pointer-events-none" />
        <div className="container-main relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-display font-black uppercase tracking-[0.18em] text-primary-400 mb-3">
            <Sparkles className="h-3 w-3 text-accent-lime" />
            {eyebrow}
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-black tracking-[-0.04em] text-white">
            {title}
          </h1>
          <p className="mt-3 text-sm font-body text-white/50 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </div>

      <div className="container-main py-8 sm:py-10">
        <section className="max-w-3xl mx-auto rounded-3xl border border-primary-100/70 bg-white p-6 sm:p-10 shadow-[0_24px_80px_-48px_rgba(245,45,110,0.35)]">
          {children}
        </section>
      </div>
    </div>
  );
}
