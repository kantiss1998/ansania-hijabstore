import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow?: string;
  badge?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  align?: 'left' | 'center';
  size?: 'default' | 'compact';
}

export function PageHero({
  eyebrow,
  badge,
  title,
  description,
  children,
  align = 'left',
  size = 'default',
}: PageHeroProps) {
  const isCenter = align === 'center';
  const py = size === 'compact' ? 'py-10 sm:py-12' : 'py-12 sm:py-16';

  return (
    <div className={`relative overflow-hidden bg-dark text-white ${py} noise-overlay`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/25 via-transparent to-accent-violet/15 pointer-events-none" />
      <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-accent-lime/10 blur-2xl pointer-events-none" />

      <div className={`container-main relative z-10 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'}`}>
        {(badge || eyebrow) && (
          <div className={`flex flex-wrap items-center gap-2 mb-3 ${isCenter ? 'justify-center' : ''}`}>
            {badge && (
              <span className="sticker-pill !bg-accent-lime/90 !border-transparent !text-dark !shadow-none">
                {badge}
              </span>
            )}
            {eyebrow && (
              <span className="section-label !text-primary-400">{eyebrow}</span>
            )}
          </div>
        )}
        <h1
          className={`font-display font-black tracking-[-0.04em] leading-[0.95] text-white ${
            size === 'compact' ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'
          }`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`mt-3 text-sm font-body text-white/55 leading-relaxed max-w-lg ${
              isCenter ? 'mx-auto' : ''
            }`}
          >
            {description}
          </p>
        )}
        {children && <div className={`mt-6 ${isCenter ? 'flex justify-center' : ''}`}>{children}</div>}
      </div>
    </div>
  );
}
