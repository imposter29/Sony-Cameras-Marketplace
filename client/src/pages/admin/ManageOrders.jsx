import { ShoppingBag } from 'lucide-react';

const ManageOrders = () => {
  return (
    <div className="sony-container py-10">
      <h1 className="text-3xl font-display font-semibold mb-8">Manage Orders</h1>

      <div className="border border-sony-light p-12 text-center">
        <ShoppingBag size={48} className="mx-auto text-sony-light mb-4" />
        <p className="text-sony-mid text-lg mb-2">Order Management</p>
        <p className="text-sm text-sony-mid">
          View all orders, update statuses, and manage fulfillment. Ready for feature implementation.
        </p>
      </div>
    </div>
  );
};

export default ManageOrders;
