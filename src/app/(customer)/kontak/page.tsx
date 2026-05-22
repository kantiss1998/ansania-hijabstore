import type { Metadata } from 'next';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hubungi Kami | benangbaju',
  description: 'Hubungi tim layanan pelanggan benangbaju.',
};

export default function KontakPage() {
  return (
    <div className="container-main py-12 min-h-[70vh]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black font-heading text-gray-900 mb-2 text-center">Hubungi Kami</h1>
        <p className="text-gray-500 text-center mb-10">Tim layanan pelanggan kami siap membantu Anda setiap Senin-Jumat, Pukul 09:00 - 17:00 WIB.</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8 bg-gradient-primary text-white">
            <h2 className="text-2xl font-bold font-heading mb-6">Informasi Kontak</h2>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">Alamat Kantor</p>
                  <p className="text-primary-100 mt-1 leading-relaxed">Gedung Fashion Plaza Lt. 5<br/>Jl. Jend. Sudirman Kav. 12<br/>Jakarta Selatan 12190</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">Telepon</p>
                  <p className="text-primary-100 mt-1">+62 812 3456 7890</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">Email</p>
                  <p className="text-primary-100 mt-1">halo@benangbaju.com</p>
                </div>
              </li>
            </ul>

            <div className="mt-10">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
                <MessageCircle className="h-5 w-5" />
                Chat WhatsApp Sekarang
              </a>
            </div>
          </div>
          
          <div className="card p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" className="input" placeholder="Masukkan nama" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Email</label>
                <input type="email" className="input" placeholder="nama@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subjek Pesan</label>
                <input type="text" className="input" placeholder="Tanya stok, Lacak resi, dll" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pesan</label>
                <textarea className="input min-h-[120px] py-3" placeholder="Tulis pesan Anda secara detail..." required></textarea>
              </div>
              <button type="submit" className="btn-primary w-full py-3 rounded-xl mt-2">Kirim Pesan</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
