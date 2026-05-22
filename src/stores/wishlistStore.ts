'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  productIds: Set<number>;
  toggle: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  init: (ids: number[]) => void;
  count: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: new Set<number>(),

      toggle: (productId) => {
        set((state) => {
          const next = new Set(state.productIds);
          if (next.has(productId)) {
            next.delete(productId);
          } else {
            next.add(productId);
          }
          return { productIds: next };
        });
      },

      isWishlisted: (productId) => get().productIds.has(productId),

      init: (ids) => set({ productIds: new Set(ids) }),

      count: () => get().productIds.size,
    }),
    {
      name: 'ansania-wishlist',
      partialize: (state) => ({ productIds: Array.from(state.productIds) }),
      merge: (persisted, current) => ({
        ...current,
        productIds: new Set(
          (persisted as { productIds: number[] }).productIds || []
        ),
      }),
    }
  )
);
