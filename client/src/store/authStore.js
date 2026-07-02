import { create } from 'zustand';
import useCartStore from './cartStore';
import useWishlistStore from './wishlistStore';
import useCompareStore from './compareStore';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!(localStorage.getItem('token') && localStorage.getItem('user')),

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
    // Clear all per-user client state so it never leaks into the next account.
    useCartStore.getState().resetCart();
    useWishlistStore.getState().resetWishlist();
    useCompareStore.getState().clearCompare();
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
