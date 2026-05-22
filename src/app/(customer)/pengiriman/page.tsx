import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Pengiriman | benangbaju',
  description: 'Informasi dan kebijakan pengiriman pesanan.',
};

export default function PengirimanPage() {
  return (
    <div className="container-main py-12 min-h-[70vh]">
      <div className="max-w-3xl mx-auto card p-8 sm:p-12">
        <h1 className="text-3xl font-black font-heading text-gray-900 mb-6">Kebijakan Pengiriman</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p>
            Pesanan akan diproses pada hari kerja (Senin - Jumat) tidak termasuk hari libur nasional. Pesanan yang masuk sebelum pukul 14:00 WIB akan diproses pada hari yang sama.
          </p>
          
          <h3 className="font-bold text-gray-900 mt-6 mb-2">Metode Pengiriman</h3>
          <p>Kami bekerja sama dengan berbagai kurir terpercaya seperti JNE, J&T, SiCepat, dan AnterAja untuk memastikan barang Anda sampai dengan aman dan cepat.</p>
          
          <h3 className="font-bold text-gray-900 mt-6 mb-2">Estimasi Waktu</h3>
          <ul>
            <li><strong>Jabodetabek:</strong> 1-3 hari kerja</li>
            <li><strong>Pulau Jawa:</strong> 2-4 hari kerja</li>
            <li><strong>Luar Pulau Jawa:</strong> 3-7 hari kerja</li>
          </ul>
          
          <h3 className="font-bold text-gray-900 mt-6 mb-2">Pelacakan Pesanan</h3>
          <p>Setelah pesanan dikirim, Anda akan menerima nomor resi melalui email dan dapat dilacak melalui halaman detail pesanan di dasbor akun Anda.</p>
        </div>
      </div>
    </div>
  );
}
