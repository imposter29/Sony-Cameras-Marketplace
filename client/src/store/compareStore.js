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

  get canAdd() {
    return get().items.length < 3;
  },

  clearCompare: () => set({ items: [] }),
}));

export default useCompareStore;
