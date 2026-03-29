import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import useCartStore from '../store/cartStore';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';
import { formatPrice } from '../utils/formatPrice';

const Cart = () => {
  const { items, clearCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="sony-container py-10">
      <h1 className="text-3xl font-display font-semibold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={48} className="mx-auto text-sony-light mb-4" />
          <p className="text-sony-mid text-lg mb-4">Your cart is empty</p>
          <Link to="/products">
            <Button>
              Continue Shopping <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="border border-sony-light p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-sony-mid">Subtotal ({items.length} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sony-mid">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-sony-light pt-3 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full mt-6" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
