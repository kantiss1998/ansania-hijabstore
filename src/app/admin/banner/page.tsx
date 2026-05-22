'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminBannerPage() {
  const [banners] = useState([
    { id: 1, title: 'Promo Kemerdekaan', position: 'Home - Hero', imageUrl: '/images/banner-1.jpg', status: 'active' },
    { id: 2, title: 'Koleksi Terbaru Hijab', position: 'Home - Middle', imageUrl: '/images/banner-2.jpg', status: 'active' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-gray-900">Manajemen Banner</h1>
          <p className="text-gray-500 mt-1">Atur gambar banner/slider untuk promosi toko.</p>
        </div>
        <button className="btn-primary py-2 px-4 flex items-center gap-2 text-sm rounded-xl">
          <Plus className="h-4 w-4" />
          Tambah Banner
        </button>
      </div>

      <div className="card border border-gray-100 p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="border border-gray-200 rounded-2xl overflow-hidden group">
              <div className="aspect-[21/9] bg-gray-100 relative">
                {/* Fallback image view */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                   <ImageIcon className="h-8 w-8 opacity-50" />
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-primary-600"><Edit2 className="h-4 w-4" /></button>
                  <button className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-gray-900 mb-1">{banner.title}</h3>
                <p className="text-xs text-gray-500 mb-2">Posisi: {banner.position}</p>
                <span className={`badge ${
                  banner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {banner.status === 'active' ? 'Ditampilkan' : 'Disembunyikan'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
