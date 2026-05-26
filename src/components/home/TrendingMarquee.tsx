'use client';

const ITEMS = [
  '✨ new drop tiap minggu',
  '🔥 flash sale — checkout sekarang',
  '💗 modest tapi slay',
  '📦 gratis ongkir 500K+',
  '⭐ bestie picks',
  '🎀 hijab & gamis premium',
  '💬 CS bestie 24/7',
  '🛍️ retur 30 hari',
];

export function TrendingMarquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-primary-200/50 bg-dark">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/30 via-transparent to-accent-violet/20 pointer-events-none" />
      <div className="relative flex w-max min-w-full animate-marquee whitespace-nowrap py-3">
        {doubled.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="mx-8 text-[10px] sm:text-[11px] font-display font-bold uppercase tracking-[0.14em] text-white/90"
          >
            {text}
            <span className="ml-8 text-accent-lime">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
