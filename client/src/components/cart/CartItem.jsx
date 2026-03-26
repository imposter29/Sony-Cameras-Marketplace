import { Minus, Plus, Trash2 } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { formatPrice } from '../../utils/formatPrice';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex space-x-4">
      <div className="w-20 h-20 flex-shrink-0 bg-sony-light overflow-hidden">
        <img
          src={item.images?.[0] || '/placeholder.jpg'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-sony-black truncate">{item.name}</h4>
        <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
        <div className="flex items-center mt-2 space-x-2">
          <button
            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
            className="p-1 border border-sony-light hover:border-sony-dark transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="p-1 border border-sony-light hover:border-sony-dark transition-colors"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={() => removeItem(item._id)}
            className="p-1 text-red-500 hover:text-red-700 transition-colors ml-2"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
