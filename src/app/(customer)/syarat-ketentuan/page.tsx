import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | benangbaju',
  description: 'Syarat dan ketentuan layanan benangbaju.',
};

export default function SyaratKetentuanPage() {
  return (
    <div className="container-main py-12 min-h-[70vh]">
      <div className="max-w-3xl mx-auto card p-8 sm:p-12">
        <h1 className="text-3xl font-black font-heading text-gray-900 mb-6">Syarat & Ketentuan</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p>
            Dengan mengakses dan berbelanja di benangbaju, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan di bawah ini.
          </p>
          
          <h3 className="font-bold text-gray-900 mt-6 mb-2">Pemesanan & Pembayaran</h3>
          <ul>
            <li>Harga yang tertera pada produk belum termasuk ongkos kirim.</li>
            <li>Pesanan baru akan diproses setelah pembayaran berhasil diverifikasi oleh sistem.</li>
            <li>Jika dalam waktu 1x24 jam pembayaran belum diselesaikan, pesanan akan dibatalkan otomatis oleh sistem.</li>
          </ul>

          <h3 className="font-bold text-gray-900 mt-6 mb-2">Informasi Produk</h3>
          <p>Kami berusaha menampilkan warna produk seakurat mungkin. Namun, karena perbedaan resolusi layar perangkat, kami tidak dapat menjamin warna yang Anda lihat 100% sama dengan produk asli.</p>

          <h3 className="font-bold text-gray-900 mt-6 mb-2">Hak Cipta</h3>
          <p>Seluruh konten di website ini termasuk desain, logo, teks, dan gambar adalah milik benangbaju dan dilindungi oleh undang-undang hak cipta.</p>
        </div>
      </div>
    </div>
  );
}
