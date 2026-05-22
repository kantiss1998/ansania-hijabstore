'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Truck, Ticket, CreditCard, Loader2, ShieldCheck, ShoppingCartIcon } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { getUserAddresses } from '@/services/api/users';
import { getShippingCost } from '@/services/api/shipping';
import { validateVoucher } from '@/services/api/vouchers';
import { createOrder } from '@/services/api/orders';
import { formatCurrency, cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotal, syncCart, clearCart } = useCartStore();
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  
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
        const primary = data.find((a: any) => a.is_primary) || data[0];
        setSelectedAddressId(primary.id);
      }
    });
  }, []);

  // Fetch shipping cost when address changes
  useEffect(() => {
    if (selectedAddressId && items.length > 0) {
      setIsCalculatingShipping(true);
      const address = addresses.find(a => a.id === selectedAddressId);
      
      // Hitung total berat (asumsi tiap item 300 gram = 0.3 kg, disesuaikan)
      const totalWeight = items.reduce((sum, item) => sum + (300 * item.qty), 0);

      getShippingCost({
        origin: 'CITY_ID_ASAL', // Harus dikonfigurasi dari env atau backend setting
        destination: address?.city_id?.toString() || '1',
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
  }, [selectedAddressId, items]);

  // Load Midtrans Snap script
  useEffect(() => {
    const scriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    
    let scriptTag = document.createElement('script');
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Voucher tidak valid');
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
        (window as any).snap.pay(orderData.data.snap_token, {
          onSuccess: async function (result: any) {
            toast.success('Pembayaran berhasil!');
            await clearCart();
            router.push(`/akun/pesanan/${orderData.data.order_number}`);
          },
          onPending: async function (result: any) {
            toast.success('Pesanan dibuat. Silakan selesaikan pembayaran.');
            await clearCart();
            router.push(`/akun/pesanan/${orderData.data.order_number}`);
          },
          onError: function (result: any) {
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

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat memproses pesanan');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center card p-12 max-w-md w-full">
          <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-heading text-gray-900 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-6">Pilih produk favorit Anda dan selesaikan pesanan di sini.</p>
          <Link href={ROUTES.PRODUCTS} className="btn-primary w-full">Mulai Belanja</Link>
        </div>
      </div>
    );
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 lg:py-12">
      <div className="container-main">
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {/* Address */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  Alamat Pengiriman
                </h2>
                <Link href="/akun/alamat" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                  Ubah Alamat
                </Link>
              </div>
              
              {selectedAddress ? (
                <div>
                  <p className="font-bold text-gray-900">{selectedAddress.recipient_name} <span className="font-normal text-gray-500">| {selectedAddress.phone}</span></p>
                  <p className="text-sm text-gray-600 mt-1">{selectedAddress.full_address}</p>
                  <p className="text-sm text-gray-500 mt-1 uppercase text-xs font-semibold">{selectedAddress.district}, {selectedAddress.city}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">Anda belum memilih alamat pengiriman</p>
                  <Link href="/akun/alamat" className="btn-outline text-sm py-2">Pilih Alamat</Link>
                </div>
              )}
            </div>

            {/* Products */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Produk Dipesan</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.thumbnailUrl} alt={item.productName} className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-500">Varian: {item.variantName}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} x {item.qty}</p>
                        <p className="font-bold text-primary-600">{formatCurrency(item.price * item.qty)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <Truck className="h-5 w-5 text-primary-600" />
                Opsi Pengiriman
              </h2>
              
              {isCalculatingShipping ? (
                <div className="flex items-center gap-2 text-gray-500 py-4">
                  <Loader2 className="h-5 w-5 animate-spin" /> Menghitung ongkos kirim...
                </div>
              ) : shippingOptions.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {shippingOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedShipping(opt)}
                      className={cn(
                        'flex justify-between items-center p-4 rounded-xl border-2 text-left transition-all',
                        selectedShipping?.name === opt.name
                          ? 'border-primary-500 bg-primary-50/30'
                          : 'border-gray-100 hover:border-gray-200'
                      )}
                    >
                      <div>
                        <p className="font-bold text-gray-900">{opt.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Estimasi: {opt.etd}</p>
                      </div>
                      <span className="font-bold text-primary-600">{formatCurrency(opt.cost)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-2">Kurir tidak tersedia untuk alamat ini.</p>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-6">Ringkasan Belanja</h2>

              {/* Voucher */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Ticket className="h-4 w-4" /> Gunakan Voucher
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Masukkan kode promo"
                    className="input py-2"
                  />
                  <button onClick={handleApplyVoucher} className="btn-primary py-2 px-4 text-sm rounded-xl">
                    Terapkan
                  </button>
                </div>
                {appliedVoucher && (
                  <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
                    ✓ Voucher {appliedVoucher.code} berhasil dipasang
                  </p>
                )}
              </div>

              {/* Calculation */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Harga ({items.length} Barang)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Ongkos Kirim</span>
                  <span className="font-medium text-gray-900">{formatCurrency(shippingCost)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-red-600 font-medium">
                    <span>Diskon Voucher</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-gray-900">Total Tagihan</span>
                <span className="text-2xl font-black font-heading text-primary-600">{formatCurrency(total)}</span>
              </div>

              <div className="bg-blue-50 text-blue-800 p-3 rounded-xl flex items-start gap-2 mb-6 text-xs leading-relaxed">
                <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>Transaksi Anda dilindungi oleh sistem keamanan berstandar tinggi. Data terenkripsi dengan aman.</p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || !selectedAddressId || !selectedShipping}
                className="w-full btn-primary rounded-2xl py-4 text-base shadow-lg shadow-primary-500/30 flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Bayar Sekarang
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
