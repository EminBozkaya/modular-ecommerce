import { create } from 'zustand';

interface BasketUiState {
    isDrawerOpen: boolean;
    lastAddedProductId: string | null;
}

interface BasketUiActions {
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
    setLastAdded: (productId: string | null) => void;
}

export const useBasketUiStore = create<BasketUiState & BasketUiActions>((set) => ({
    isDrawerOpen: false,
    lastAddedProductId: null,
    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
    setLastAdded: (productId) => set({ lastAddedProductId: productId }),
}));
