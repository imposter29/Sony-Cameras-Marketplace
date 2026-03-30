import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMyOrders } from '../hooks/useOrders';
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

const MyOrders = () => {
  const { data, isLoading } = useMyOrders();

  if (isLoading) return <Spinner className="py-20" size="lg" />;

  const orders = data?.orders || [];

  return (
    <div className="sony-container py-10">
      <h1 className="text-3xl font-display font-semibold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-sony-light mb-4" />
          <p className="text-sony-mid text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block border border-sony-light hover:border-sony-dark p-5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sony-mid">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="font-semibold mt-1">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-sony-mid mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={statusVariant[order.status]}>
                    {order.status.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                  <p className="text-xs text-sony-mid mt-2">
                    {order.items.length} item(s)
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
