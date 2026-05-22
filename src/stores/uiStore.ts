'use client';

import { create } from 'zustand';

interface UiStore {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isNotificationOpen: boolean;
  searchQuery: string;

  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (q: string) => void;
  toggleNotification: () => void;
  closeNotification: () => void;
  closeAll: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isNotificationOpen: false,
  searchQuery: '',

  toggleMobileMenu: () =>
    set((s) => ({
      isMobileMenuOpen: !s.isMobileMenuOpen,
      isSearchOpen: false,
      isNotificationOpen: false,
    })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  toggleSearch: () =>
    set((s) => ({
      isSearchOpen: !s.isSearchOpen,
      isMobileMenuOpen: false,
      isNotificationOpen: false,
    })),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),

  setSearchQuery: (q) => set({ searchQuery: q }),

  toggleNotification: () =>
    set((s) => ({
      isNotificationOpen: !s.isNotificationOpen,
      isMobileMenuOpen: false,
      isSearchOpen: false,
    })),
  closeNotification: () => set({ isNotificationOpen: false }),

  closeAll: () =>
    set({
      isMobileMenuOpen: false,
      isSearchOpen: false,
      isNotificationOpen: false,
    }),
}));
