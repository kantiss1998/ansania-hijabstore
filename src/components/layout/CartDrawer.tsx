'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { isOpen, items, closeDrawer, updateQty, removeItem, getTotal } =
    useCartStore();
  const total = getTotal();
  const count = items.length;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="relative border-b border-primary-100/80 px-6 py-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-accent-violet" />
          <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-black text-lg text-dark tracking-[-0.03em]">Keranjangmu</h2>
            <p className="text-[11px] font-body text-gray-400 mt-0.5">{count} item · checkout when ready</p>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-full hover:bg-primary-50 text-gray-500 hover:text-primary-600 transition-all active:scale-95"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-black/[0.05]">
                <ShoppingBag className="h-7 w-7 text-gray-300" />
              </div>
              <p className="font-display font-bold uppercase text-xs text-gray-700 mb-1">Keranjang masih kosong</p>
              <p className="text-xs text-gray-400 mb-6 font-body">Temukan produk favorit Anda sekarang!</p>
              <Link
                href={ROUTES.PRODUCTS}
                onClick={closeDrawer}
                className="btn-pill-brand h-11 px-8 !text-[11px]"
              >
                Belanja Sekarang
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-black/[0.06] hover:border-black/15 transition-all">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-black/[0.05]">
                  <Image
                    src={item.thumbnailUrl && typeof item.thumbnailUrl === 'string' && item.thumbnailUrl.trim() !== '' ? item.thumbnailUrl : 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop'}
                    alt={item.productName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={ROUTES.PRODUCT(item.productSlug)}
                    onClick={closeDrawer}
                    className="font-display font-bold uppercase tracking-wider text-[#0A0A0A] text-xs line-clamp-1 hover:text-[#F52D6E] transition-colors"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-[10px] text-gray-400 font-body mt-0.5">{item.variantName}</p>
                  <p className="font-display font-black text-xs text-[#F52D6E] mt-1">{formatCurrency(item.price)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-black/10 p-0.5">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-all active:scale-90"
                        aria-label="Kurangi"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-display font-bold w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        disabled={item.qty >= item.maxQty}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Tambah"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                      aria-label="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-black/[0.06] px-6 py-5 space-y-4 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-display font-bold text-[10px] uppercase tracking-wider">Subtotal ({count} item)</span>
              <span className="text-base font-display font-black text-[#0A0A0A]">{formatCurrency(total)}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-body">Ongkos kirim & pajak dihitung saat checkout</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={ROUTES.PRODUCTS}
                onClick={closeDrawer}
                className="flex items-center justify-center py-3 rounded-xl border border-black/10 text-gray-700 font-display font-bold uppercase tracking-wider text-[11px] hover:border-black/25 transition-all active:scale-[0.98]"
              >
                Belanja
              </Link>
              <Link
                href={ROUTES.CHECKOUT}
                onClick={closeDrawer}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-dark hover:bg-primary-600 text-white font-display font-bold uppercase tracking-wider text-[11px] transition-all active:scale-[0.98]"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
