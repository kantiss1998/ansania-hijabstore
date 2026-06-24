'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Truck, Ticket, CreditCard, Loader2, ShieldCheck, ShoppingCartIcon } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { getUserAddresses } from '@/services/api/users';
import { getShippingCost } from '@/services/api/shipping';
import { validateVoucher } from '@/services/api/vouchers';
import { createOrder } from '@/services/api/orders';
import { formatCurrency, cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { PageHero } from '@/components/customer/PageHero';
import { CustomerCard } from '@/components/customer/CustomerCard';
import toast from 'react-hot-toast';
import type { Address } from '@/types/user.types';

interface ShippingOption {
  name: string;
  cost: number;
  etd: string;
}

interface AppliedVoucher {
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
}

interface WindowWithSnap extends Window {
  snap: {
    pay: (token: string, options: {
      onSuccess: (result: unknown) => void;
      onPending: (result: unknown) => void;
      onError: (result: unknown) => void;
      onClose: () => void;
    }) => void;
  };
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, syncCart, clearCart } = useCartStore();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotal();
  const shippingCost = selectedShipping?.cost || 0;
  const discountAmount = appliedVoucher ? (appliedVoucher.type === 'percentage' ? (subtotal * appliedVoucher.value / 100) : appliedVoucher.value) : 0;
  const total = subtotal + shippingCost - discountAmount;

  useEffect(() => {
    syncCart();
    // Load addresses
    getUserAddresses().then(data => {
      setAddresses(data);
      if (data.length > 0) {
        const primary = data.find((a) => a.isDefault) || data[0];
        setSelectedAddressId(primary.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch shipping cost when address changes
  useEffect(() => {
    if (selectedAddressId && items.length > 0) {
      setIsCalculatingShipping(true);
      const address = addresses.find(a => a.id === selectedAddressId);
      
      // Hitung total berat riil dari database (default fallback 300 gram)
      const totalWeight = items.reduce((sum, item) => sum + ((item.weight_gram || 300) * item.qty), 0);

      getShippingCost({
        origin: process.env.NEXT_PUBLIC_ORIGIN_POSTAL_CODE || '40111',
        destination: address?.cityId || '0',
        postal_code: address?.postalCode || '',
        weight: totalWeight
      }).then(data => {
        // Asumsi data mengembalikan array opsi kurir
        if (data && data.length > 0) {
          setShippingOptions(data);
          setSelectedShipping(data[0]); // Auto select opsi pertama
        } else {
          // Fallback dummy
          setShippingOptions([{ name: 'JNE Reguler', cost: 15000, etd: '2-3 hari' }]);
          setSelectedShipping({ name: 'JNE Reguler', cost: 15000, etd: '2-3 hari' });
        }
      }).catch(() => {
        // Fallback jika API gagal
        setShippingOptions([{ name: 'JNE Reguler', cost: 15000, etd: '2-3 hari' }]);
        setSelectedShipping({ name: 'JNE Reguler', cost: 15000, etd: '2-3 hari' });
      }).finally(() => {
        setIsCalculatingShipping(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId, items]);

  // Load Midtrans Snap script
  useEffect(() => {
    const scriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    
    const scriptTag = document.createElement('script');
    scriptTag.src = scriptUrl;
    scriptTag.setAttribute('data-client-key', clientKey || '');
    document.body.appendChild(scriptTag);
    
    return () => {
      document.body.removeChild(scriptTag);
    }
  }, []);

  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    try {
      const data = await validateVoucher(voucherCode, subtotal);
      setAppliedVoucher(data);
      toast.success('Voucher berhasil digunakan!');
    } catch (error: unknown) {
      const err = error as ApiErrorResponse;
      toast.error(err.response?.data?.message || 'Voucher tidak valid');
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error('Pilih alamat pengiriman terlebih dahulu');
      return;
    }
    if (!selectedShipping) {
      toast.error('Pilih kurir pengiriman');
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = await createOrder({
        address_id: selectedAddressId,
        courier_code: selectedShipping.name,
        courier_service: selectedShipping.name,
        shipping_cost: shippingCost,
        voucher_code: appliedVoucher?.code,
        notes: '',
      });

      // Panggil Midtrans Snap
      if (orderData.data && orderData.data.snap_token) {
        (window as unknown as WindowWithSnap).snap.pay(orderData.data.snap_token, {
          onSuccess: async function () {
            toast.success('Pembayaran berhasil!');
            await clearCart();
            router.push(`/akun/pesanan/${orderData.data.order_number}`);
          },
          onPending: async function () {
            toast.success('Pesanan dibuat. Silakan selesaikan pembayaran.');
            await clearCart();
            router.push(`/akun/pesanan/${orderData.data.order_number}`);
          },
          onError: function () {
            toast.error('Pembayaran gagal. Silakan coba lagi.');
            router.push(`/akun/pesanan/${orderData.data.order_number}`);
          },
          onClose: function () {
            toast.error('Anda menutup popup pembayaran.');
            router.push(`/akun/pesanan/${orderData.data.order_number}`);
          }
        });
      } else {
        // Fallback jika tidak pakai midtrans (misal COD)
        toast.success('Pesanan berhasil dibuat!');
        await clearCart();
        router.push(`/akun/pesanan/${orderData.data?.order_number || ''}`);
      }

    } catch (error: unknown) {
      const err = error as ApiErrorResponse;
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat memproses pesanan');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
    <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center rounded-3xl border border-primary-100 bg-white p-12 max-w-md w-full shadow-[0_24px_60px_-32px_rgba(245,45,110,0.3)]">
          <ShoppingCartIcon className="h-12 w-12 text-primary-300 mx-auto mb-4" />
          <h2 className="font-display font-black text-lg text-dark mb-2">Keranjang kosong</h2>
          <p className="text-sm text-gray-500 mb-6 font-body">Yuk isi dulu sebelum checkout ✨</p>
          <Link href={ROUTES.PRODUCTS} className="btn-pill-brand w-full h-12">
            Mulai belanja
          </Link>
        </div>
      </div>
    );
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="min-h-screen">
      <PageHero
        size="compact"
        badge="Secure"
        eyebrow="Checkout"
        title="Selesaikan pesanan"
        description="Review alamat, kurir, dan bayar dengan aman."
      />

      <div className="container-main py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 space-y-5">
            <CustomerCard
              title="Alamat pengiriman"
              icon={<MapPin className="h-4 w-4 text-primary-500" />}
              action={
                <Link href="/akun/alamat" className="text-xs font-display font-bold text-primary-600 hover:text-primary-700">
                  Ubah
                </Link>
              }
            >
              
              {selectedAddress ? (
                <div className="text-xs font-body text-gray-500 space-y-1">
                  <p className="font-display font-bold text-sm text-[#0A0A0A]">{selectedAddress.recipientName} <span className="font-body font-normal text-gray-400">| {selectedAddress.phone}</span></p>
                  <p className="leading-relaxed">{selectedAddress.addressLine1}</p>
                  <p className="uppercase text-[10px] font-bold text-gray-400">{selectedAddress.addressLine2 ? `${selectedAddress.addressLine2}, ` : ''}{selectedAddress.city}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-400 mb-3 font-body">Anda belum memilih alamat pengiriman</p>
                  <Link
                    href="/akun/alamat"
                    className="inline-flex items-center justify-center h-9 px-4 rounded-xl border border-black/10 text-gray-700 font-display font-bold uppercase tracking-wider text-[10px] hover:border-black/20 transition-colors"
                  >
                    Pilih Alamat
                  </Link>
                </div>
              )}
            </CustomerCard>

            <CustomerCard title="Produk dipesan">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <Image src={item.thumbnailUrl && typeof item.thumbnailUrl === 'string' && item.thumbnailUrl.trim() !== '' ? item.thumbnailUrl : 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop'} alt={item.productName} width={80} height={80} className="w-20 h-20 object-cover rounded-xl border border-[#0A0A0A]/[0.05]" unoptimized />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A] line-clamp-1">{item.productName}</h3>
                      <p className="text-[10px] text-gray-400 font-body mt-0.5">Varian: {item.variantName}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-400 font-body">{formatCurrency(item.price)} x {item.qty}</p>
                        <p className="font-display font-black text-xs text-[#0A0A0A]">{formatCurrency(item.price * item.qty)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CustomerCard>

            <CustomerCard
              title="Opsi pengiriman"
              icon={<Truck className="h-4 w-4 text-primary-500" />}
            >
              
              {isCalculatingShipping ? (
                <div className="flex items-center gap-2 text-xs text-gray-400 py-4 font-body">
                  <Loader2 className="h-4 w-4 animate-spin text-[#F52D6E]" /> Menghitung ongkos kirim...
                </div>
              ) : shippingOptions.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {shippingOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedShipping(opt)}
                      className={cn(
                        'flex justify-between items-center p-4 rounded-xl border text-left transition-all cursor-pointer',
                        selectedShipping?.name === opt.name
                          ? 'border-[#0A0A0A] bg-[#0A0A0A]/5 shadow-sm'
                          : 'border-black/[0.08] hover:border-black/20'
                      )}
                    >
                      <div>
                        <p className="font-display font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">{opt.name}</p>
                        <p className="text-[10px] text-gray-400 font-body mt-1">Estimasi: {opt.etd}</p>
                      </div>
                      <span className="font-display font-black text-xs text-[#F52D6E]">{formatCurrency(opt.cost)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-2 font-body">Kurir tidak tersedia untuk alamat ini.</p>
              )}
            </CustomerCard>
          </div>

          <aside className="w-full lg:w-96 flex-shrink-0">
            <CustomerCard className="sticky top-28" title="Ringkasan belanja">

              {/* Voucher */}
              <div className="mb-6 pb-6 border-b border-black/[0.06]">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                  <Ticket className="h-3.5 w-3.5 text-gray-400" /> Gunakan Voucher
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="KODE VOUCHER"
                    className="flex-1 px-4 py-2 text-xs font-body rounded-xl border border-black/10 focus:border-[#F52D6E] focus:outline-none transition-all placeholder:text-gray-300 uppercase tracking-wider"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="h-10 px-4 text-[10px] font-display font-bold uppercase tracking-wider bg-dark hover:bg-primary-600 text-white rounded-2xl transition-all cursor-pointer"
                  >
                    Terapkan
                  </button>
                </div>
                {appliedVoucher && (
                  <p className="text-[10px] text-green-600 mt-2 font-display font-bold uppercase tracking-wider flex items-center gap-1">
                    ✓ Voucher {appliedVoucher.code} berhasil dipasang
                  </p>
                )}
              </div>

              {/* Calculation */}
              <div className="space-y-3 mb-6 pb-6 border-b border-black/[0.06] text-xs">
                <div className="flex justify-between font-body text-gray-500">
                  <span>Total Harga ({items.length} Barang)</span>
                  <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body text-gray-500">
                  <span>Total Ongkos Kirim</span>
                  <span className="font-bold text-gray-900">{formatCurrency(shippingCost)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between font-body text-red-600 font-bold">
                    <span>Diskon Voucher</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-display font-bold uppercase text-xs tracking-wider text-gray-900">Total Tagihan</span>
                <span className="text-xl font-display font-black text-[#F52D6E]">{formatCurrency(total)}</span>
              </div>

              <div className="bg-gray-50 border border-black/[0.06] text-gray-400 p-3 rounded-xl flex items-start gap-2.5 mb-6 text-[10px] leading-relaxed font-body">
                <ShieldCheck className="h-4 w-4 flex-shrink-0 text-gray-400 mt-0.5" />
                <p>Transaksi Anda dilindungi oleh sistem keamanan berstandar tinggi. Data terenkripsi dengan aman.</p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || !selectedAddressId || !selectedShipping}
                className="btn-pill-brand w-full h-12 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Bayar Sekarang
                  </>
                )}
              </button>
            </CustomerCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
