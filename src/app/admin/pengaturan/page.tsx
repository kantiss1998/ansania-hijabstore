'use client';

import { Save, Store, Globe, MapPin, Receipt, Shield } from 'lucide-react';

export default function AdminPengaturanPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black font-heading text-gray-900">Pengaturan Toko</h1>
        <p className="text-gray-500 mt-1">Kelola preferensi umum, informasi toko, dan pengaturan sistem.</p>
      </div>

      <div className="card p-6 border border-gray-100">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
          <Store className="h-5 w-5 text-gray-400" />
          <h2 className="font-bold text-gray-900">Informasi Dasar</h2>
        </div>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Nama Toko</label>
              <input type="text" defaultValue="ansania" className="input w-full" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Slogan / Tagline</label>
              <input type="text" defaultValue="Fashion Muslim Premium Indonesia" className="input w-full" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Deskripsi Singkat</label>
            <textarea 
              className="input w-full min-h-[100px] py-3" 
              defaultValue="Temukan koleksi hijab, gamis, mukena, dan fashion muslim premium terbaik. Kualitas terjamin, pengiriman cepat ke seluruh Indonesia."
            ></textarea>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Email Kontak</label>
              <input type="email" defaultValue="halo@ansania.com" className="input w-full" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Nomor Telepon / WhatsApp</label>
              <input type="tel" defaultValue="+62 812 3456 7890" className="input w-full" />
            </div>
          </div>
        </form>
      </div>

      <div className="card p-6 border border-gray-100">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
          <MapPin className="h-5 w-5 text-gray-400" />
          <h2 className="font-bold text-gray-900">Alamat Pengiriman Default (Asal Pengiriman)</h2>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Alamat Lengkap</label>
            <textarea 
              className="input w-full min-h-[80px] py-3" 
              defaultValue="Gedung Fashion Plaza Lt. 5, Jl. Jend. Sudirman Kav. 12"
            ></textarea>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Provinsi</label>
              <select className="input w-full">
                <option>DKI Jakarta</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Kota / Kabupaten</label>
              <select className="input w-full">
                <option>Jakarta Selatan</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Kode Pos</label>
              <input type="text" defaultValue="12190" className="input w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 border border-gray-100">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
          <Globe className="h-5 w-5 text-gray-400" />
          <h2 className="font-bold text-gray-900">Sosial Media & Tautan</h2>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Instagram URL</label>
            <input type="url" defaultValue="https://instagram.com/ansania" className="input w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Facebook URL</label>
            <input type="url" defaultValue="https://facebook.com/ansania" className="input w-full" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 pb-12">
        <button className="btn-primary py-3 px-8 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-all">
          <Save className="h-5 w-5" />
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}
