import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';

// Run immediately after a successful login (email/password OR Google), once the
// JWT is already stored. Merges the guest cart into the user's server cart and
// hydrates the wishlist from the server so the UI reflects the account's data.
export const syncAfterLogin = async () => {
  await useCartStore.getState().mergeGuestCart();
  await useWishlistStore.getState().hydrateFromServer();
};

export default syncAfterLogin;
