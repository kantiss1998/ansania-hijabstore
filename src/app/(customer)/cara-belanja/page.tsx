import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cara Belanja | benangbaju',
  description: 'Panduan lengkap cara berbelanja di benangbaju.',
};

export default function CaraBelanjaPage() {
  return (
    <div className="container-main py-12 min-h-[70vh]">
      <div className="max-w-3xl mx-auto card p-8 sm:p-12">
        <h1 className="text-3xl font-black font-heading text-gray-900 mb-6">Cara Belanja</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="lead">Belanja di benangbaju sangat mudah dan cepat. Ikuti langkah-langkah berikut ini:</p>
          
          <div className="space-y-6 mt-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Pilih Produk</h3>
                <p>Telusuri koleksi kami melalui halaman beranda atau gunakan fitur pencarian dan filter kategori untuk menemukan produk yang Anda inginkan.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Masukkan ke Keranjang</h3>
                <p>Klik tombol "Tambah ke Keranjang" pada produk pilihan Anda. Pastikan varian dan jumlah sudah sesuai sebelum melanjutkan.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Checkout dan Pengiriman</h3>
                <p>Pilih alamat pengiriman, opsi kurir, dan gunakan voucher jika Anda memilikinya. Periksa kembali ringkasan pesanan Anda.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Lakukan Pembayaran</h3>
                <p>Klik "Bayar Sekarang" untuk memunculkan popup pembayaran yang aman. Anda dapat membayar menggunakan Transfer Bank, Virtual Account, e-Wallet, atau Kartu Kredit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
