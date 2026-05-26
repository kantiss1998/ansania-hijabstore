import type { Metadata } from 'next';
import { InfoPageLayout } from '@/components/customer/InfoPageLayout';
import { InfoSection } from '@/components/customer/InfoSection';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | ansania',
  description: 'Syarat dan ketentuan layanan ansania.',
};

export default function SyaratKetentuanPage() {
  return (
    <InfoPageLayout
      eyebrow="Terms"
      title="Syarat & Ketentuan"
      description="Aturan pakai layanan ansania biar belanja tetap fair & aman."
    >
      <p className="text-sm text-gray-500 font-body leading-relaxed">
        Dengan akses & belanja di ansania, kamu dianggap setuju syarat berikut.
      </p>

      <InfoSection title="Pemesanan & pembayaran">
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Harga belum termasuk ongkir</li>
          <li>Pesanan diproses setelah pembayaran terverifikasi</li>
          <li>Tanpa bayar dalam 24 jam, pesanan dibatalkan otomatis</li>
        </ul>
      </InfoSection>

      <InfoSection title="Info produk">
        <p>
          Warna di layar bisa sedikit beda karena resolusi device — bukan cacat produk.
        </p>
      </InfoSection>

      <InfoSection title="Hak cipta">
        <p>Semua konten website (desain, logo, teks, gambar) milik ansania & dilindungi hukum.</p>
      </InfoSection>
    </InfoPageLayout>
  );
}
