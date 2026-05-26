import type { Metadata } from 'next';
import { InfoPageLayout } from '@/components/customer/InfoPageLayout';
import { InfoSteps } from '@/components/customer/InfoSection';

export const metadata: Metadata = {
  title: 'Cara Belanja | ansania',
  description: 'Panduan lengkap cara berbelanja di ansania.',
};

const STEPS = [
  {
    title: 'Pilih produk',
    description:
      'Jelajahi koleksi lewat beranda, kategori, atau search. Filter sesuai mood kamu.',
  },
  {
    title: 'Masukkan ke keranjang',
    description:
      'Tap "+ Keranjang", pilih varian & jumlah. Cek wishlist kalau masih ragu.',
  },
  {
    title: 'Checkout',
    description:
      'Pilih alamat, kurir, dan voucher kalau ada. Review ringkasan sebelum bayar.',
  },
  {
    title: 'Bayar & track',
    description:
      'Selesaikan via transfer, VA, e-wallet, atau kartu. Lacak pesanan di akun kamu.',
  },
];

export default function CaraBelanjaPage() {
  return (
    <InfoPageLayout
      eyebrow="Shopping guide"
      title="Cara Belanja"
      description="Belanja di ansania gampang banget — ikuti 4 langkah ini."
    >
      <InfoSteps steps={STEPS} />
    </InfoPageLayout>
  );
}
