'use client';

import { useState } from 'react';
import { getUserAddresses, deleteAddress, createAddress, updateAddress } from '@/services/api/users';
import { Loader2, Plus, MapPin, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AccountPageHeader } from '@/components/customer/AccountPageHeader';
import { AddressModal } from '@/components/customer/AddressModal';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { Address } from '@/types/user.types';

export default function AddressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // React Query Fetch
  const { data: addresses = [], isLoading, refetch } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: getUserAddresses,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => {
      toast.success('Alamat berhasil dihapus');
      refetch();
    },
    onError: () => {
      toast.error('Gagal menghapus alamat');
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
      } else {
        await createAddress(data);
      }
    },
    onSuccess: () => {
      toast.success(editingAddress ? 'Alamat berhasil diperbarui' : 'Alamat baru berhasil ditambahkan');
      setIsModalOpen(false);
      refetch();
    },
    onError: () => {
      toast.error('Terjadi kesalahan saat menyimpan alamat');
    }
  });

  const handleDelete = (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return;
    deleteMutation.mutate(id);
  };

  const handleOpenModal = (address?: Address) => {
    setEditingAddress(address || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    await submitMutation.mutateAsync(data);
  };

  return (
    <div>
      <AccountPageHeader
        title="Alamat pengiriman"
        description="Kelola alamat untuk checkout lebih cepat."
        action={
          <button 
            type="button" 
            onClick={() => handleOpenModal()} 
            className="btn-pill-brand h-10 px-5 text-xs gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah
          </button>
        }
      />

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-primary-100 p-6">
          <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <h3 className="font-display font-black uppercase tracking-wider text-xs text-gray-700">Belum Ada Alamat</h3>
          <p className="text-xs text-gray-400 font-body mt-1">Anda belum menambahkan alamat pengiriman apapun.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className={`p-5 rounded-2xl border ${address.isDefault ? 'border-[#0A0A0A] bg-[#0A0A0A]/5' : 'border-black/[0.06] hover:border-black/20'} transition-all relative`}>
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-[#0A0A0A] text-white font-display font-bold uppercase text-[9px] tracking-wider px-2 py-0.5 rounded">Utama</span>
              )}
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
                {address.recipientName}
                <span className="text-xs font-body font-normal text-gray-400 border-l border-black/10 pl-2">{address.phone}</span>
              </h3>
              <p className="text-xs font-body text-gray-500 mt-2 max-w-lg leading-relaxed">{address.addressLine1}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                {address.addressLine2 ? `${address.addressLine2}, ` : ''}{address.city}, {address.province} {address.postalCode}
              </p>
              
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-black/[0.06]">
                <button 
                  onClick={() => handleOpenModal(address)} 
                  className="text-xs font-display font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#F52D6E] flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Ubah
                </button>
                {!address.isDefault && (
                  <button onClick={() => handleDelete(address.id)} className="text-xs font-display font-bold uppercase tracking-wider text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingAddress}
      />
    </div>
  );
}
