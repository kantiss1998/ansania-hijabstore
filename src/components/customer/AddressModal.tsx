'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, MapPin } from 'lucide-react';
import type { Address } from '@/types/user.types';
import { getProvinces, getCities, getDistricts } from '@/services/api/shipping';

interface AddressFormData {
  label: string;
  recipient_name: string;
  phone: string;
  province_id: string;
  province_name: string;
  city_id: string;
  city_name: string;
  district: string;
  postal_code: string;
  full_address: string;
  is_primary: boolean;
  [key: string]: string | boolean | undefined;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  initialData?: Address | null;
}

export function AddressModal({ isOpen, onClose, onSubmit, initialData }: AddressModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const [formData, setFormData] = useState<AddressFormData>({
    label: 'Utama',
    recipient_name: '',
    phone: '',
    province_id: '',
    province_name: '',
    city_id: '',
    city_name: '',
    district: '',
    postal_code: '',
    full_address: '',
    is_primary: false,
  });

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data || []);
      } catch (err) {
        console.error('Failed to load provinces', err);
      }
    };
    if (isOpen) {
      loadProvinces();
    }
  }, [isOpen]);

  useEffect(() => {
    const loadCities = async () => {
      if (!formData.province_id) {
        setCities([]);
        return;
      }
      try {
        const data = await getCities(formData.province_id);
        setCities(data || []);
      } catch (err) {
        console.error('Failed to load cities', err);
      }
    };
    loadCities();
  }, [formData.province_id]);

  useEffect(() => {
    const loadDistricts = async () => {
      if (!formData.city_id) {
        setDistricts([]);
        return;
      }
      try {
        const data = await getDistricts(formData.city_id);
        setDistricts(data || []);
      } catch (err) {
        console.error('Failed to load districts', err);
      }
    };
    loadDistricts();
  }, [formData.city_id]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          label: initialData.label || 'Utama',
          recipient_name: initialData.recipientName || '',
          phone: initialData.phone || '',
          province_id: initialData.provinceId || '',
          province_name: initialData.province || '',
          city_id: initialData.cityId || '',
          city_name: initialData.city || '',
          district: initialData.addressLine2 || '',
          postal_code: initialData.postalCode || '',
          full_address: initialData.addressLine1 || '',
          is_primary: initialData.isDefault || false,
        });
      } else {
        setFormData({
          label: 'Utama',
          recipient_name: '',
          phone: '',
          province_id: '',
          province_name: '',
          city_id: '',
          city_name: '',
          district: '',
          postal_code: '',
          full_address: '',
          is_primary: false,
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleProvinceChange = (provId: string) => {
    const prov = provinces.find(p => String(p.province_id) === provId);
    setFormData(prev => ({
      ...prev,
      province_id: provId,
      province_name: prov ? prov.province : '',
      city_id: '',
      city_name: '',
      district: '',
      postal_code: ''
    }));
  };

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => String(c.city_id) === cityId);
    setFormData(prev => ({
      ...prev,
      city_id: cityId,
      city_name: city ? `${city.type} ${city.city_name}` : '',
      district: '',
      postal_code: city ? city.postal_code : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit address', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-black/5">
          <div className="flex items-center gap-2 text-[#0A0A0A]">
            <div className="p-2 bg-primary-50 text-primary-500 rounded-xl">
              <MapPin className="h-4 w-4" />
            </div>
            <h2 className="font-display font-black uppercase tracking-wider text-sm">
              {initialData ? 'Ubah Alamat' : 'Tambah Alamat Baru'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto p-5 sm:p-6">
          <form id="address-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nama Penerima</label>
                <input
                  type="text"
                  required
                  value={formData.recipient_name}
                  onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                  placeholder="Misal: Budi"
                />
              </div>
              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nomor Telepon</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300"
                  placeholder="Misal: 08123456789"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Negara</label>
                <select
                  required
                  className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all"
                  defaultValue="Indonesia"
                >
                  <option value="Indonesia">Indonesia</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Provinsi</label>
                <select
                  required
                  value={formData.province_id}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all"
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((prov) => (
                    <option key={prov.province_id} value={prov.province_id}>
                      {prov.province}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Kota / Kabupaten</label>
                <select
                  required
                  disabled={!formData.province_id}
                  value={formData.city_id}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all disabled:opacity-50"
                >
                  <option value="">Pilih Kota</option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.type} {city.city_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Kecamatan</label>
                <select
                  required
                  disabled={!formData.city_id}
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all disabled:opacity-50"
                >
                  <option value="">Pilih Kecamatan</option>
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Kode Pos</label>
              <select
                required
                disabled={!formData.city_id}
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-4 py-2.5 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all disabled:opacity-50"
              >
                <option value="">Pilih Kode Pos</option>
                {formData.postal_code && (
                  <option value={formData.postal_code}>{formData.postal_code}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-1.5">Alamat Lengkap</label>
              <textarea
                required
                value={formData.full_address}
                onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300 resize-none"
                placeholder="Nama jalan, gedung, no. rumah, dll"
              />
            </div>

            <label className="flex items-center gap-3 p-4 rounded-xl border border-black/5 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={formData.is_primary}
                  onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                  className="peer appearance-none w-5 h-5 rounded border-2 border-gray-300 checked:border-[#F52D6E] checked:bg-[#F52D6E] transition-all cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-xs uppercase tracking-wider text-gray-900">Jadikan Alamat Utama</p>
                <p className="text-[10px] text-gray-500 font-body">Gunakan alamat ini sebagai prioritas pengiriman</p>
              </div>
            </label>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-black/5 bg-gray-50/80 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-display font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            form="address-form"
            disabled={isLoading}
            className="btn-pill-brand h-10 px-8 gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            Simpan Alamat
          </button>
        </div>
      </div>
    </div>
  );
}
