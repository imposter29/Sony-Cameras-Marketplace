import { create } from 'zustand';
import { getWishlist } from '../api/users';

const useWishlistStore = create((set, get) => ({
  items: [],

  toggleItem: (product) => {
    set((state) => {
      const exists = state.items.find((item) => item._id === product._id);
      if (exists) {
        return {
          items: state.items.filter((item) => item._id !== product._id),
        };
      }
      return { items: [...state.items, product] };
    });
  },

  isWishlisted: (productId) => {
    return get().items.some((item) => item._id === productId);
  },

  // Load the authenticated user's wishlist from the server.
  hydrateFromServer: async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const { data } = await getWishlist();
      set({ items: data.wishlist || [] });
    } catch {
      // Keep local state on failure.
    }
  },

  // Clear on logout so one account's wishlist never leaks into another.
  resetWishlist: () => set({ items: [] }),
}));

export default useWishlistStore;
