import { useParams } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { formatPrice } from '../utils/formatPrice';

const statusVariant = {
  placed: 'info',
  confirmed: 'info',
  shipped: 'warning',
  out_for_delivery: 'warning',
  delivered: 'success',
  cancelled: 'danger',
};

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useOrder(id);

  if (isLoading) return <Spinner className="py-20" size="lg" />;

  const order = data?.order;
  if (!order) return <div className="sony-container py-20 text-center">Order not found</div>;

  return (
    <div className="sony-container py-10">
      <h1 className="text-3xl font-display font-semibold mb-2">Order Detail</h1>
      <p className="text-sony-mid text-sm mb-8">
        Order #{order._id.slice(-8).toUpperCase()} • Placed on{' '}
        {new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center space-x-4 border border-sony-light p-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-sony-light" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-sm text-sony-mid">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="border border-sony-light p-5">
            <h3 className="font-semibold mb-3">Status</h3>
            <Badge variant={statusVariant[order.status]}>
              {order.status.replace(/_/g, ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="border border-sony-light p-5">
            <h3 className="font-semibold mb-3">Shipping Address</h3>
            <p className="text-sm text-sony-dark">{order.shippingAddress?.line1}</p>
            <p className="text-sm text-sony-dark">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
            </p>
          </div>

          <div className="border border-sony-light p-5">
            <h3 className="font-semibold mb-3">Summary</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-sony-mid">Payment</span>
                <span className="uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-sony-light">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
