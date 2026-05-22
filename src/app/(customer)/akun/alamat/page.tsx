'use client';

import { useState, useEffect } from 'react';
import { getUserAddresses, deleteAddress } from '@/services/api/users';
import { Loader2, Plus, MapPin, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await getUserAddresses();
      setAddresses(data);
    } catch (error) {
      toast.error('Gagal memuat alamat');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return;
    try {
      await deleteAddress(id);
      toast.success('Alamat berhasil dihapus');
      fetchAddresses();
    } catch (error) {
      toast.error('Gagal menghapus alamat');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-gray-900">Alamat Pengiriman</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola daftar alamat Anda untuk mempercepat proses checkout.</p>
        </div>
        <button className="btn-primary py-2 px-4 text-sm rounded-xl">
          <Plus className="h-4 w-4" />
          Tambah Alamat
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
          <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900">Belum Ada Alamat</h3>
          <p className="text-sm text-gray-500 mt-1">Anda belum menambahkan alamat pengiriman apapun.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className={`p-5 rounded-2xl border-2 ${address.is_primary ? 'border-primary-500 bg-primary-50/30' : 'border-gray-100 hover:border-gray-200'} transition-all relative`}>
              {address.is_primary && (
                <span className="absolute top-4 right-4 badge-primary">Utama</span>
              )}
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                {address.recipient_name}
                <span className="text-sm font-normal text-gray-500 border-l border-gray-300 pl-2">{address.phone}</span>
              </h3>
              <p className="text-sm text-gray-600 mt-2 max-w-lg">{address.full_address}</p>
              <p className="text-sm text-gray-500 mt-1 uppercase text-xs font-semibold">
                {address.district}, {address.city}, {address.province} {address.postal_code}
              </p>
              
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  <Edit2 className="h-3.5 w-3.5" /> Ubah
                </button>
                {!address.is_primary && (
                  <button onClick={() => handleDelete(address.id)} className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
