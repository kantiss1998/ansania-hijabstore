import type { Metadata } from 'next';
import { InfoPageLayout } from '@/components/customer/InfoPageLayout';
import { InfoSection } from '@/components/customer/InfoSection';

export const metadata: Metadata = {
  title: 'Kebijakan Retur | ansania',
  description: 'Syarat dan ketentuan pengembalian barang di ansania.',
};

export default function ReturPage() {
  return (
    <InfoPageLayout
      eyebrow="Returns"
      title="Kebijakan Retur"
      description="Retur mudah dalam 30 hari — syarat & prosesnya di sini."
    >
      <p className="text-sm text-gray-500 font-body leading-relaxed">
        Kepuasan kamu prioritas kami. Kalau ada masalah, tim CS siap bantu.
      </p>

      <InfoSection title="Syarat retur">
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Maks. 7 hari setelah barang diterima</li>
          <li>Kondisi baru, belum dicuci, tag masih terpasang</li>
          <li>Item flash sale tidak bisa retur kecuali cacat produksi</li>
        </ul>
      </InfoSection>

      <InfoSection title="Cara retur">
        <ol className="list-decimal pl-5 space-y-1.5 mt-2">
          <li>Chat CS via WhatsApp + nomor pesanan & video unboxing</li>
          <li>Ikuti instruksi alamat retur dari tim kami</li>
          <li>Kirim paket via kurir pilihan kamu</li>
          <li>Refund 3–5 hari kerja setelah barang lolos QC</li>
        </ol>
      </InfoSection>
    </InfoPageLayout>
  );
}
