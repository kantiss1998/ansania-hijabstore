'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, Settings, ArrowRight } from 'lucide-react';

export default function AdminJubelioPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync] = useState('22 Okt 2023, 10:45 WIB');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black font-heading text-gray-900">Sinkronisasi Jubelio</h1>
        <p className="text-gray-500 mt-1">Integrasi inventaris dan pesanan Omnichannel dengan Jubelio.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <RefreshCw className={`h-6 w-6 ${isSyncing ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Sinkronisasi Manual</h2>
                <p className="text-sm text-gray-500">Tarik data produk & pesanan terbaru.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-500">Status Koneksi</span>
                <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Terhubung</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Sinkronisasi Terakhir</span>
                <span className="font-semibold text-gray-900">{lastSync}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full btn-primary py-3 rounded-xl shadow-lg shadow-primary-500/20 disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isSyncing ? (
              <>Meningkronkan Data...</>
            ) : (
              <>Mulai Sinkronisasi <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div className="card p-6 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" /> Konfigurasi Auto-Sync
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Sync Produk & Stok</p>
                  <p className="text-xs text-gray-500">Otomatis update setiap 15 menit</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                  <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition" />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Sync Pesanan Masuk</p>
                  <p className="text-xs text-gray-500">Kirim pesanan baru seketika</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                  <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition" />
                </div>
              </label>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex gap-3 text-orange-800 text-sm">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-orange-500" />
            <div>
              <p className="font-bold mb-1">Catatan Penting</p>
              <p>Pastikan pemetaan SKU produk di sistem web sama persis dengan SKU yang ada di dashboard Jubelio agar stok terhubung dengan benar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
