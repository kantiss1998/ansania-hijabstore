import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | benangbaju',
  description: 'Kebijakan privasi dan perlindungan data benangbaju.',
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="container-main py-12 min-h-[70vh]">
      <div className="max-w-3xl mx-auto card p-8 sm:p-12">
        <h1 className="text-3xl font-black font-heading text-gray-900 mb-6">Kebijakan Privasi</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p>
            Di benangbaju, kami sangat menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
          </p>
          
          <h3 className="font-bold text-gray-900 mt-6 mb-2">1. Pengumpulan Informasi</h3>
          <p>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti saat Anda membuat akun, melakukan pemesanan, atau menghubungi layanan pelanggan. Ini termasuk nama, alamat email, nomor telepon, dan alamat pengiriman.</p>

          <h3 className="font-bold text-gray-900 mt-6 mb-2">2. Penggunaan Informasi</h3>
          <p>Informasi yang kami kumpulkan digunakan untuk memproses pesanan, mengirimkan update pengiriman, menangani retur barang, serta memberikan penawaran khusus dan rekomendasi produk.</p>

          <h3 className="font-bold text-gray-900 mt-6 mb-2">3. Keamanan Data</h3>
          <p>Kami menerapkan langkah-langkah keamanan fisik, elektronik, dan manajerial yang sesuai untuk mencegah akses tidak sah, menjaga akurasi data, dan memastikan penggunaan informasi yang benar.</p>
        </div>
      </div>
    </div>
  );
}
