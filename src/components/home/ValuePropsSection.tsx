import { Truck, ShieldCheck, RefreshCw, Headphones, Sparkles } from 'lucide-react';

const VALUE_PROPS = [
  {
    icon: Truck,
    title: 'Gratis Ongkir',
    desc: 'Pembelian ≥ Rp 500.000',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: ShieldCheck,
    title: 'Garansi Ori',
    desc: 'Produk 100% original',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: RefreshCw,
    title: 'Easy Retur',
    desc: 'Retur 30 hari tanpa ribet',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Headphones,
    title: 'CS 24/7',
    desc: 'Siap membantu kapanpun',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
];

export function ValuePropsSection() {
  return (
    <section className="py-8 sm:py-10 bg-white border-b border-gray-100">
      <div className="container-main">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.title}
              className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 group"
            >
              <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 ${prop.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <prop.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${prop.color}`} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm sm:text-base leading-tight">{prop.title}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{prop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
