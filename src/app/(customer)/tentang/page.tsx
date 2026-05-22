import type { Metadata } from 'next';
import Image from 'next/image';
import { Heart, Star, Target, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Kami | ansania',
  description: 'Mengenal lebih dekat ansania, destinasi fashion muslim premium pilihan wanita Indonesia.',
};

export default function TentangKamiPage() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container-main relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-6 leading-tight">Mendefinisikan Ulang Fashion Muslim Premium</h1>
          <p className="text-primary-100 text-lg md:text-xl leading-relaxed">
            Berawal dari mimpi kecil di tahun 2018, ansania hadir untuk menemani perjalanan setiap wanita muslim Indonesia tampil percaya diri, elegan, dan tetap syari.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1594912959827-020abcb01b05?q=80&w=2070&auto=format&fit=crop" 
                alt="Workshop ansania" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="font-bold text-2xl font-heading">Kualitas adalah Prioritas</p>
                <p className="text-white/80">Proses jahit tangan eksklusif</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-6">Cerita Kami</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  Kami percaya bahwa pakaian lebih dari sekadar kain yang menutupi tubuh. Ia adalah ekspresi diri, cerminan kepribadian, dan komitmen terhadap keyakinan.
                </p>
                <p>
                  Setiap koleksi ansania dirancang secara khusus oleh desainer lokal berbakat yang memahami betul iklim dan kebutuhan wanita di Indonesia. Kami memilih bahan premium yang sejuk, jatuh dengan sempurna, dan tahan lama.
                </p>
                <p>
                  Hingga hari ini, ansania telah dipercaya oleh lebih dari 500.000 pelanggan setia di seluruh penjuru negeri, dan terus bertumbuh menjadi kiblat trend fashion muslim masa kini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50/50 border-y border-gray-100">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black font-heading text-gray-900 mb-4">Nilai-Nilai Kami</h2>
            <p className="text-gray-500 text-lg">Prinsip yang selalu kami pegang teguh dalam setiap produk yang kami hasilkan.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: 'Dibuat dengan Cinta', desc: 'Setiap jahitan dikerjakan dengan penuh dedikasi dan perhatian pada detail.' },
              { icon: ShieldCheck, title: 'Kualitas Premium', desc: 'Menggunakan material bahan nomor satu yang nyaman dipakai beraktivitas seharian.' },
              { icon: Star, title: 'Inovasi Desain', desc: 'Selalu menghadirkan desain yang fresh dan up-to-date dengan tren global terkini.' },
              { icon: Target, title: 'Fokus Pelanggan', desc: 'Kepuasan dan kenyamanan Anda selalu menjadi prioritas utama tim layanan kami.' },
            ].map((val, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <val.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
