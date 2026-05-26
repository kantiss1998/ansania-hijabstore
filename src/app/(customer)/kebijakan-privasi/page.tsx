import type { Metadata } from 'next';
import { InfoPageLayout } from '@/components/customer/InfoPageLayout';
import { InfoSection } from '@/components/customer/InfoSection';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | ansania',
  description: 'Kebijakan privasi dan perlindungan data ansania.',
};

export default function KebijakanPrivasiPage() {
  return (
    <InfoPageLayout
      eyebrow="Privacy"
      title="Kebijakan Privasi"
      description="Data kamu aman — ini cara kami kumpulkan, pakai, dan lindungi."
    >
      <InfoSection title="Pengumpulan data">
        <p>
          Kami kumpulkan info yang kamu berikan saat daftar, checkout, atau hubungi CS — nama,
          email, telepon, dan alamat pengiriman.
        </p>
      </InfoSection>

      <InfoSection title="Penggunaan data">
        <p>
          Dipakai untuk proses pesanan, update pengiriman, retur, dan promo yang relevan (bisa
          opt-out kapan saja).
        </p>
      </InfoSection>

      <InfoSection title="Keamanan">
        <p>
          Langkah keamanan fisik, elektronik, dan manajerial diterapkan untuk cegah akses tidak sah
          ke data pribadi kamu.
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
}
