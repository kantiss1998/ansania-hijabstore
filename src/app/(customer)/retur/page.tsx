import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Retur | benangbaju',
  description: 'Syarat dan ketentuan pengembalian barang di benangbaju.',
};

export default function ReturPage() {
  return (
    <div className="container-main py-12 min-h-[70vh]">
      <div className="max-w-3xl mx-auto card p-8 sm:p-12">
        <h1 className="text-3xl font-black font-heading text-gray-900 mb-6">Kebijakan Retur (Pengembalian Barang)</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p>Kepuasan Anda adalah prioritas kami. Jika Anda tidak puas dengan pembelian Anda, kami siap membantu.</p>
          
          <h3 className="font-bold text-gray-900 mt-6 mb-2">Syarat Pengembalian</h3>
          <ul>
            <li>Barang dapat dikembalikan maksimal 7 hari setelah diterima.</li>
            <li>Barang harus dalam kondisi baru, belum dicuci, tidak berbau, dan tag label masih terpasang.</li>
            <li>Barang diskon atau Flash Sale tidak dapat ditukar atau dikembalikan, kecuali terdapat cacat produksi.</li>
          </ul>

          <h3 className="font-bold text-gray-900 mt-6 mb-2">Proses Retur</h3>
          <ol>
            <li>Hubungi Customer Service kami via WhatsApp dengan menyertakan Nomor Pesanan dan video unboxing.</li>
            <li>CS kami akan memberikan instruksi pengembalian beserta alamat retur.</li>
            <li>Kirim barang kembali ke alamat kami menggunakan kurir pilihan Anda.</li>
            <li>Setelah barang kami terima dan periksa, dana akan dikembalikan dalam waktu 3-5 hari kerja.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
