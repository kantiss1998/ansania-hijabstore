import type { Metadata } from 'next';
import { InfoPageLayout } from '@/components/customer/InfoPageLayout';
import { InfoSection } from '@/components/customer/InfoSection';

export const metadata: Metadata = {
  title: 'Kebijakan Pengiriman | ansania',
  description: 'Informasi dan kebijakan pengiriman pesanan di ansania.',
};

export default function PengirimanPage() {
  return (
    <InfoPageLayout
      eyebrow="Shipping"
      title="Kebijakan Pengiriman"
      description="Proses pengiriman, estimasi waktu, dan cara lacak pesanan kamu."
    >
      <p className="text-sm text-gray-500 font-body leading-relaxed">
        Pesanan diproses Senin–Jumat (hari libur nasional tidak termasuk). Order sebelum 14:00 WIB
        biasanya dikirim hari yang sama.
      </p>

      <InfoSection title="Metode pengiriman">
        <p>
          Kami pakai kurir terpercaya: JNE, J&T, SiCepat, dan AnterAja — biar paket sampai aman &
          cepat.
        </p>
      </InfoSection>

      <InfoSection title="Estimasi waktu">
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>
            <strong className="text-dark">Jabodetabek:</strong> 1–3 hari kerja
          </li>
          <li>
            <strong className="text-dark">Pulau Jawa:</strong> 2–4 hari kerja
          </li>
          <li>
            <strong className="text-dark">Luar Jawa:</strong> 3–7 hari kerja
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Lacak pesanan">
        <p>
          Setelah dikirim, nomor resi dikirim ke email & bisa dilacak di halaman detail pesanan di
          akun kamu.
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
}
