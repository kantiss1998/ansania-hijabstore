'use client';

import Link from 'next/link';
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
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-50">
              <ShoppingBag className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-gray-900">Keranjang</h2>
              <p className="text-xs text-gray-500">{count} item</p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all active:scale-95"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-9 w-9 text-gray-300" />
              </div>
              <p className="font-heading font-semibold text-gray-700 mb-1">Keranjang masih kosong</p>
              <p className="text-sm text-gray-400 mb-6">Yuk, temukan produk favorit kamu!</p>
              <Link
                href={ROUTES.PRODUCTS}
                onClick={closeDrawer}
                className="btn-primary rounded-full px-6 py-2.5 text-sm"
              >
                Belanja Sekarang
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-primary-100 transition-all">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={ROUTES.PRODUCT(item.productSlug)}
                    onClick={closeDrawer}
                    className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-primary-600 transition-colors"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">{item.variantName}</p>
                  <p className="font-bold text-primary-600 mt-1">{formatCurrency(item.price)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 p-1">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-all active:scale-90"
                        aria-label="Kurangi"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
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
          <div className="border-t border-gray-100 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal ({count} item)</span>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
            </div>
            <p className="text-xs text-gray-400">Ongkir & pajak dihitung saat checkout</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={ROUTES.CART}
                onClick={closeDrawer}
                className="btn-outline rounded-full py-3 text-sm text-center"
              >
                Lihat Keranjang
              </Link>
              <Link
                href={ROUTES.CHECKOUT}
                onClick={closeDrawer}
                className="btn-primary rounded-full py-3 text-sm flex items-center justify-center gap-2"
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
