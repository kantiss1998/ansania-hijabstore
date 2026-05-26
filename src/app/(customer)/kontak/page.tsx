import type { Metadata } from 'next';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { PageHero } from '@/components/customer/PageHero';

export const metadata: Metadata = {
  title: 'Hubungi Kami | ansania',
  description: 'Hubungi tim layanan pelanggan ansania.',
};

export default function KontakPage() {
  return (
    <div className="min-h-[70vh]">
      <PageHero
        align="center"
        size="compact"
        eyebrow="Contact"
        title="Hubungi kami"
        description="CS bestie siap bantu Senin–Jumat, 09:00–17:00 WIB."
      />

      <div className="container-main py-8 sm:py-10">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-dark text-white p-6 sm:p-8 relative overflow-hidden noise-overlay">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display font-black text-lg tracking-tight mb-6">Info kontak</h2>
              <ul className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    label: 'Alamat',
                    text: 'Gedung Fashion Plaza Lt. 5\nJl. Jend. Sudirman Kav. 12\nJakarta Selatan 12190',
                  },
                  { icon: Phone, label: 'Telepon', text: '+62 812 3456 7890' },
                  { icon: Mail, label: 'Email', text: 'halo@ansania.com' },
                ].map(({ icon: Icon, label, text }) => (
                  <li key={label} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-xs uppercase tracking-wider text-white/80">
                        {label}
                      </p>
                      <p className="text-xs text-white/50 font-body mt-1 whitespace-pre-line leading-relaxed">
                        {text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-display font-bold text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="h-4 w-4" />
                Chat WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-primary-100/80 bg-white p-6 sm:p-8 shadow-[0_16px_48px_-32px_rgba(245,45,110,0.2)]">
            <h2 className="font-display font-black text-sm text-dark mb-6 pb-4 border-b border-primary-100/60">
              Kirim pesan
            </h2>
            <form className="space-y-4">
              {[
                { label: 'Nama', type: 'text', placeholder: 'Nama lengkap' },
                { label: 'Email', type: 'email', placeholder: 'nama@email.com' },
                { label: 'Subjek', type: 'text', placeholder: 'Stok, resi, dll' },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required
                    className="input rounded-2xl"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Pesan
                </label>
                <textarea
                  placeholder="Tulis pesan kamu..."
                  required
                  className="input rounded-2xl min-h-[120px] resize-y"
                />
              </div>
              <button type="submit" className="btn-pill-brand w-full h-12 mt-2">
                Kirim pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
