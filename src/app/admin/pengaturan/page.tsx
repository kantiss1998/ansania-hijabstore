'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Save, Store, Globe, MapPin, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { getAdminSettings, updateSetting } from '@/services/api/admin';
import toast from 'react-hot-toast';

interface SettingItem {
  setting_key: string;
  value: string | null;
}

export default function AdminPengaturanPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State Map
  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: '',
    store_tagline: '',
    store_description: '',
    contact_email: '',
    contact_phone: '',
    store_address: '',
    shipping_province: '',
    shipping_city: '',
    shipping_postal_code: '',
    social_instagram: '',
    social_facebook: '',
    store_logo: ''
  });

  // Track initial settings to only update modified ones
  const [initialSettings, setInitialSettings] = useState<Record<string, string>>({});

  // Image Upload State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminSettings();
      const map: Record<string, string> = {};
      
      if (Array.isArray(data)) {
        data.forEach((item: SettingItem) => {
          map[item.setting_key] = item.value || '';
        });
      }
      
      setSettings(prev => ({ ...prev, ...map }));
      setInitialSettings(map);
      if (map.store_logo) {
        setLogoPreview(map.store_logo);
      }
    } catch {
      toast.error('Gagal memuat pengaturan toko');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran logo maksimal 2MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Check text settings that changed
      const changedKeys = Object.keys(settings).filter(
        (key) => settings[key] !== initialSettings[key] && key !== 'store_logo'
      );

      // Save each changed key
      for (const key of changedKeys) {
        const formData = new FormData();
        formData.append('value', settings[key]);
        // Also provide labels/group info so the DB registers them cleanly if they don't exist
        formData.append('group_name', getGroupForKey(key));
        formData.append('label', getLabelForKey(key));
        await updateSetting(key, formData);
      }

      // 2. Save logo if uploaded
      if (logoFile) {
        const formData = new FormData();
        formData.append('image', logoFile);
        formData.append('group_name', 'general');
        formData.append('label', 'Logo Toko');
        await updateSetting('store_logo', formData);
      }

      toast.success('Pengaturan berhasil disimpan');
      setLogoFile(null);
      fetchSettings(); // Refresh settings state
    } catch {
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper metadata functions for site_settings Joi alignment
  const getGroupForKey = (key: string) => {
    if (key.startsWith('social_')) return 'social';
    if (key.startsWith('shipping_') || key === 'store_address') return 'shipping';
    return 'general';
  };

  const getLabelForKey = (key: string) => {
    const labels: Record<string, string> = {
      store_name: 'Nama Toko',
      store_tagline: 'Slogan / Tagline',
      store_description: 'Deskripsi Singkat',
      contact_email: 'Email Kontak',
      contact_phone: 'Nomor Telepon / WhatsApp',
      store_address: 'Alamat Lengkap',
      shipping_province: 'Provinsi',
      shipping_city: 'Kota / Kabupaten',
      shipping_postal_code: 'Kode Pos',
      social_instagram: 'Instagram URL',
      social_facebook: 'Facebook URL'
    };
    return labels[key] || key;
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-body">
      <div>
        <h1 className="text-2xl font-black font-heading text-gray-900">Pengaturan Toko</h1>
        <p className="text-gray-500 mt-1">Kelola preferensi umum, informasi toko, dan pengaturan sistem.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info Section */}
        <div className="card p-6 border border-gray-100 bg-white rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <Store className="h-5 w-5 text-primary-500" />
            <h2 className="font-bold text-gray-900">Informasi Dasar</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500">Nama Toko *</label>
                <input
                  type="text"
                  required
                  value={settings.store_name}
                  onChange={(e) => handleChange('store_name', e.target.value)}
                  className="input w-full py-2 text-sm"
                  placeholder="Ansania"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500">Slogan / Tagline</label>
                <input
                  type="text"
                  value={settings.store_tagline}
                  onChange={(e) => handleChange('store_tagline', e.target.value)}
                  className="input w-full py-2 text-sm"
                  placeholder="Fashion Muslim Premium Indonesia"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500">Deskripsi Singkat</label>
              <textarea
                rows={3}
                value={settings.store_description}
                onChange={(e) => handleChange('store_description', e.target.value)}
                className="input w-full py-2 text-sm"
                placeholder="Deskripsi singkat toko untuk SEO..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500">Email Kontak</label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="input w-full py-2 text-sm"
                  placeholder="halo@ansania.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={settings.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="input w-full py-2 text-sm"
                  placeholder="+62 812 3456 7890"
                />
              </div>
            </div>

            {/* Logo Upload Field */}
            <div className="space-y-2 pt-2 border-t border-gray-50">
              <label className="block text-xs font-bold text-gray-500">Logo Toko</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                  {logoPreview ? (
                    <Image
                      src={
                        logoPreview.startsWith('data:') || logoPreview.startsWith('blob:')
                          ? logoPreview
                          : logoPreview.startsWith('http')
                          ? logoPreview
                          : `http://localhost:3001${logoPreview}`
                      }
                      alt="Logo Toko"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-outline py-1.5 px-3 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Pilih Logo Baru
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-[10px] text-gray-400 font-semibold">Format JPG/PNG, ukuran maks 2MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="card p-6 border border-gray-100 bg-white rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <MapPin className="h-5 w-5 text-primary-500" />
            <h2 className="font-bold text-gray-900">Alamat Pengiriman Default (Asal Pengiriman)</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500">Alamat Lengkap</label>
              <textarea
                rows={2}
                value={settings.store_address}
                onChange={(e) => handleChange('store_address', e.target.value)}
                className="input w-full py-2 text-sm"
                placeholder="Alamat lengkap toko / gudang asal..."
              />
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500">Provinsi</label>
                <input
                  type="text"
                  value={settings.shipping_province}
                  onChange={(e) => handleChange('shipping_province', e.target.value)}
                  className="input w-full py-2 text-sm"
                  placeholder="DKI Jakarta"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={settings.shipping_city}
                  onChange={(e) => handleChange('shipping_city', e.target.value)}
                  className="input w-full py-2 text-sm"
                  placeholder="Jakarta Selatan"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500">Kode Pos</label>
                <input
                  type="text"
                  value={settings.shipping_postal_code}
                  onChange={(e) => handleChange('shipping_postal_code', e.target.value)}
                  className="input w-full py-2 text-sm font-mono"
                  placeholder="12190"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="card p-6 border border-gray-100 bg-white rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <Globe className="h-5 w-5 text-primary-500" />
            <h2 className="font-bold text-gray-900">Sosial Media & Tautan</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500">Instagram URL</label>
              <input
                type="url"
                value={settings.social_instagram}
                onChange={(e) => handleChange('social_instagram', e.target.value)}
                className="input w-full py-2 text-sm font-mono"
                placeholder="https://instagram.com/ansania"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500">Facebook URL</label>
              <input
                type="url"
                value={settings.social_facebook}
                onChange={(e) => handleChange('social_facebook', e.target.value)}
                className="input w-full py-2 text-sm font-mono"
                placeholder="https://facebook.com/ansania"
              />
            </div>
          </div>
        </div>

        {/* Form Action */}
        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary py-3 px-8 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 transition-all text-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" /> Simpan Pengaturan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
