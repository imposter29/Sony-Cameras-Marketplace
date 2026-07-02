import { create } from 'zustand';

const useCompareStore = create((set, get) => ({
  items: [],

  addToCompare: (product) => {
    set((state) => {
      if (state.items.length >= 3) return state;
      if (state.items.find((item) => item._id === product._id)) return state;
      return { items: [...state.items, product] };
    });
  },

  removeFromCompare: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item._id !== productId),
    }));
  },

  // Reactive helper: consumers derive "can add" from the subscribed `items`
  // slice (e.g. `items.length < 3`). A plain getter here would not trigger
  // re-renders, so it has been removed.
  canAdd: () => get().items.length < 3,

  clearCompare: () => set({ items: [] }),
}));

export default useCompareStore;
