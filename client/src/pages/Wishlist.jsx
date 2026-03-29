import { Heart } from 'lucide-react';
import useWishlistStore from '../store/wishlistStore';
import ProductGrid from '../components/product/ProductGrid';

const Wishlist = () => {
  const { items } = useWishlistStore();

  return (
    <div className="sony-container py-10">
      <h1 className="text-3xl font-display font-semibold mb-8">
        My Wishlist ({items.length})
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="mx-auto text-sony-light mb-4" />
          <p className="text-sony-mid text-lg">Your wishlist is empty</p>
          <p className="text-sm text-sony-mid mt-1">
            Save items you love by clicking the heart icon
          </p>
        </div>
      ) : (
        <ProductGrid products={items} loading={false} columns={4} />
      )}
    </div>
  );
};

export default Wishlist;
