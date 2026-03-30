import { Package, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ManageProducts = () => {
  return (
    <div className="sony-container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-semibold">Manage Products</h1>
        <Link to="/admin/products/new">
          <Button>
            <Plus size={16} className="mr-1" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="border border-sony-light p-12 text-center">
        <Package size={48} className="mx-auto text-sony-light mb-4" />
        <p className="text-sony-mid text-lg mb-2">Product Management</p>
        <p className="text-sm text-sony-mid">
          View, create, edit, and delete products. Ready for feature implementation.
        </p>
      </div>
    </div>
  );
};

export default ManageProducts;
