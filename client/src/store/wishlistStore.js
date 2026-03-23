import { create } from 'zustand';

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
}));

export default useWishlistStore;
