import type { Metadata } from 'next';
import Image from 'next/image';
import { Heart, Star, Target, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/customer/PageHero';

export const metadata: Metadata = {
  title: 'Tentang Kami | ansania',
  description: 'Mengenal ansania — fashion muslim premium untuk generasi modern.',
};

const VALUES = [
  { icon: Heart, title: 'Dibuat dengan cinta', desc: 'Setiap jahitan penuh detail & dedikasi.' },
  { icon: ShieldCheck, title: 'Kualitas premium', desc: 'Material nyaman untuk aktivitas seharian.' },
  { icon: Star, title: 'Desain fresh', desc: 'Selalu update tren modest global.' },
  { icon: Target, title: 'Fokus kamu', desc: 'CS bestie siap bantu kapan pun.' },
];

export default function TentangKamiPage() {
  return (
    <div>
      <PageHero
        align="center"
        eyebrow="About · ansania"
        title="Modest fashion, generasi sekarang"
        description="Sejak 2018, ansania menemani perjalanan wanita muslim Indonesia tampil percaya diri, elegan, dan tetap syar'i."
      />

      <section className="py-14 sm:py-16">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="relative aspect-[4/5] rounded-4xl overflow-hidden border border-primary-100 shadow-[0_24px_60px_-32px_rgba(245,45,110,0.35)]">
              <Image
                src="https://images.unsplash.com/photo-1594912959827-020abcb01b05?q=80&w=2070&auto=format&fit=crop"
                alt="Workshop ansania"
                width={800}
                height={1000}
                className="h-full w-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-display font-black text-lg tracking-tight">Quality first</p>
                <p className="text-xs text-white/70 font-body mt-1">Jahitan eksklusif, material premium</p>
              </div>
            </div>

            <div>
              <p className="section-label mb-2">Our story</p>
              <h2 className="section-title mb-6">Cerita kami</h2>
              <div className="space-y-4 text-sm text-gray-500 font-body leading-relaxed">
                <p>
                  Pakaian lebih dari kain — ekspresi diri, cerminan keyakinan, dan cara kamu tampil di
                  dunia.
                </p>
                <p>
                  Setiap koleksi dirancang desainer lokal yang paham iklim & kebutuhan wanita
                  Indonesia. Bahan sejuk, jatuh rapi, tahan lama.
                </p>
                <p>
                  500K+ pelanggan setia di seluruh Indonesia — dan kami terus grow jadi referensi
                  modest fashion Gen Z.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-primary-50/30 border-y border-primary-100/60">
        <div className="container-main">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="section-label mb-2 justify-center">Values</p>
            <h2 className="section-title">Yang kami pegang</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((val) => (
              <div key={val.title} className="bento-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-dark text-white">
                  <val.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-dark mb-2">{val.title}</h3>
                <p className="text-xs text-gray-500 font-body leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
