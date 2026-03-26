import { X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import CartItem from './CartItem';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';

const CartDrawer = () => {
  const { items, isOpen, toggleDrawer, total } = useCartStore();
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={toggleDrawer} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sony-light">
          <div className="flex items-center space-x-2">
            <ShoppingBag size={20} />
            <h2 className="text-lg font-semibold">Cart ({items.length})</h2>
          </div>
          <button onClick={toggleDrawer} className="p-1 hover:opacity-70 transition-opacity">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-sony-light mb-4" />
              <p className="text-sony-mid">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => <CartItem key={item._id} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-sony-light space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <Link to="/checkout" onClick={toggleDrawer}>
              <Button className="w-full" size="lg">
                Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
