import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart as clearServerCart,
} from '../api/cart';

// The server cart is the single source of truth for authenticated users.
// Guests have no server cart, so their cart lives only in this (persisted) store.
const isAuthed = () => !!localStorage.getItem('token');

// Map a populated server cart ({ items: [{ product, quantity }] }) to the flat
// shape the UI expects ({ ...product, quantity }). Products that were deleted
// server-side come back as null and are dropped.
const mapServerCart = (cart) =>
  (cart?.items || [])
    .filter((i) => i.product)
    .map((i) => ({ ...i.product, quantity: i.quantity }));

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Replace the local cart with the authoritative server cart.
      hydrateFromServer: async () => {
        if (!isAuthed()) return;
        try {
          const { data } = await getCart();
          set({ items: mapServerCart(data.cart) });
        } catch {
          // Network/server error — keep whatever we have locally.
        }
      },

      // After login: push every guest item into the user's server cart
      // (quantities are summed + stock-capped server-side), then hydrate.
      mergeGuestCart: async () => {
        if (!isAuthed()) return;
        const guestItems = get().items;
        try {
          for (const item of guestItems) {
            await addToCart(item._id, item.quantity);
          }
          await get().hydrateFromServer();
        } catch {
          // Even if a merge call fails, reconcile with whatever the server has.
          await get().hydrateFromServer();
        }
      },

      addItem: async (product, quantity = 1) => {
        // Optimistic local update (works for guests too).
        set((state) => {
          const existing = state.items.find((i) => i._id === product._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i._id === product._id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity }] };
        });
        if (isAuthed()) {
          try {
            const { data } = await addToCart(product._id, quantity);
            set({ items: mapServerCart(data.cart) });
          } catch {
            // Keep the optimistic state on failure.
          }
        }
      },

      updateQuantity: async (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i._id === productId ? { ...i, quantity } : i
          ),
        }));
        if (isAuthed()) {
          try {
            const { data } = await updateCartQuantity(productId, quantity);
            set({ items: mapServerCart(data.cart) });
          } catch {
            // Keep optimistic state.
          }
        }
      },

      removeItem: async (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i._id !== productId),
        }));
        if (isAuthed()) {
          try {
            const { data } = await removeFromCart(productId);
            set({ items: mapServerCart(data.cart) });
          } catch {
            // Keep optimistic state.
          }
        }
      },

      clearCart: async () => {
        set({ items: [] });
        if (isAuthed()) {
          try {
            await clearServerCart();
          } catch {
            // Local cart already cleared.
          }
        }
      },

      // Local-only reset used on logout — must NOT touch the server cart,
      // otherwise it would wipe the account's cart on the way out.
      resetCart: () => set({ items: [] }),

      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'guest-cart',
      // Only persist the items; drawer open-state should not survive refreshes.
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
