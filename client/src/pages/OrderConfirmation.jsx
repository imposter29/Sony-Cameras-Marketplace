import { Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import Button from '../components/ui/Button';

const OrderConfirmation = () => {
  return (
    <div className="sony-container py-20 text-center">
      <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
      <h1 className="text-3xl font-display font-bold mb-3">Order Placed!</h1>
      <p className="text-sony-mid text-lg mb-8 max-w-md mx-auto">
        Thank you for your purchase. Your order has been confirmed and will be
        shipped shortly.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/orders">
          <Button>
            <Package size={16} className="mr-2" /> View My Orders
          </Button>
        </Link>
        <Link to="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
