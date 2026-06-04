import { useUiStore } from '@/stores/uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUiStore.setState({
      isMobileMenuOpen: false,
      isSearchOpen: false,
      isNotificationOpen: false,
      searchQuery: '',
    });
  });

  describe('initial state', () => {
    it('should have all panels closed', () => {
      const state = useUiStore.getState();
      expect(state.isMobileMenuOpen).toBe(false);
      expect(state.isSearchOpen).toBe(false);
      expect(state.isNotificationOpen).toBe(false);
      expect(state.searchQuery).toBe('');
    });
  });

  describe('toggleMobileMenu', () => {
    it('should open mobile menu', () => {
      useUiStore.getState().toggleMobileMenu();
      expect(useUiStore.getState().isMobileMenuOpen).toBe(true);
    });

    it('should close other panels when opening mobile menu', () => {
      useUiStore.setState({ isSearchOpen: true, isNotificationOpen: true });
      useUiStore.getState().toggleMobileMenu();
      expect(useUiStore.getState().isMobileMenuOpen).toBe(true);
      expect(useUiStore.getState().isSearchOpen).toBe(false);
      expect(useUiStore.getState().isNotificationOpen).toBe(false);
    });

    it('should toggle off if already open', () => {
      useUiStore.setState({ isMobileMenuOpen: true });
      useUiStore.getState().toggleMobileMenu();
      expect(useUiStore.getState().isMobileMenuOpen).toBe(false);
    });
  });

  describe('closeMobileMenu', () => {
    it('should close mobile menu', () => {
      useUiStore.setState({ isMobileMenuOpen: true });
      useUiStore.getState().closeMobileMenu();
      expect(useUiStore.getState().isMobileMenuOpen).toBe(false);
    });
  });

  describe('toggleSearch', () => {
    it('should open search panel', () => {
      useUiStore.getState().toggleSearch();
      expect(useUiStore.getState().isSearchOpen).toBe(true);
    });

    it('should close other panels when opening search', () => {
      useUiStore.setState({ isMobileMenuOpen: true, isNotificationOpen: true });
      useUiStore.getState().toggleSearch();
      expect(useUiStore.getState().isSearchOpen).toBe(true);
      expect(useUiStore.getState().isMobileMenuOpen).toBe(false);
      expect(useUiStore.getState().isNotificationOpen).toBe(false);
    });
  });

  describe('closeSearch', () => {
    it('should close search and clear query', () => {
      useUiStore.setState({ isSearchOpen: true, searchQuery: 'hijab' });
      useUiStore.getState().closeSearch();
      expect(useUiStore.getState().isSearchOpen).toBe(false);
      expect(useUiStore.getState().searchQuery).toBe('');
    });
  });

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      useUiStore.getState().setSearchQuery('gamis premium');
      expect(useUiStore.getState().searchQuery).toBe('gamis premium');
    });
  });

  describe('toggleNotification', () => {
    it('should open notification panel', () => {
      useUiStore.getState().toggleNotification();
      expect(useUiStore.getState().isNotificationOpen).toBe(true);
    });

    it('should close other panels when opening notification', () => {
      useUiStore.setState({ isMobileMenuOpen: true, isSearchOpen: true });
      useUiStore.getState().toggleNotification();
      expect(useUiStore.getState().isNotificationOpen).toBe(true);
      expect(useUiStore.getState().isMobileMenuOpen).toBe(false);
      expect(useUiStore.getState().isSearchOpen).toBe(false);
    });
  });

  describe('closeNotification', () => {
    it('should close notification panel', () => {
      useUiStore.setState({ isNotificationOpen: true });
      useUiStore.getState().closeNotification();
      expect(useUiStore.getState().isNotificationOpen).toBe(false);
    });
  });

  describe('closeAll', () => {
    it('should close all panels', () => {
      useUiStore.setState({
        isMobileMenuOpen: true,
        isSearchOpen: true,
        isNotificationOpen: true,
      });
      useUiStore.getState().closeAll();
      expect(useUiStore.getState().isMobileMenuOpen).toBe(false);
      expect(useUiStore.getState().isSearchOpen).toBe(false);
      expect(useUiStore.getState().isNotificationOpen).toBe(false);
    });
  });
});
