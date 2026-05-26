import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const PROPS = [
  {
    icon: Truck,
    title: 'Gratis Ongkir',
    desc: 'Min. belanja 500K',
    emoji: '📦',
    accent: 'from-primary-100 to-primary-50',
  },
  {
    icon: ShieldCheck,
    title: '100% Original',
    desc: 'Garansi keaslian',
    emoji: '✨',
    accent: 'from-violet-100 to-primary-50',
  },
  {
    icon: RefreshCw,
    title: 'Retur 30 Hari',
    desc: 'Tanpa ribet',
    emoji: '💗',
    accent: 'from-pink-100 to-rose-50',
  },
  {
    icon: Headphones,
    title: 'CS Bestie',
    desc: 'Siap bantu 24/7',
    emoji: '💬',
    accent: 'from-amber-50 to-primary-50',
  },
];

export function ValuePropsSection() {
  return (
    <section className="border-b border-primary-100/60 bg-white/70 backdrop-blur-sm">
      <div className="container-main py-6 sm:py-8">
        <p className="text-center text-[10px] font-display font-black uppercase tracking-[0.22em] text-primary-600 mb-5">
          Kenapa girls suka belanja di sini
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {PROPS.map((p) => (
            <div
              key={p.title}
              className="bento-card flex items-center gap-3 p-4 sm:p-5 group"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${p.accent} text-lg group-hover:scale-105 transition-transform`}
                aria-hidden
              >
                {p.emoji}
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs sm:text-sm text-dark leading-tight">
                  {p.title}
                </p>
                <p className="text-[10px] sm:text-[11px] text-gray-500 font-body mt-0.5">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
