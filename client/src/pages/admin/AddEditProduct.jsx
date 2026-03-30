import { Save } from 'lucide-react';
import Button from '../../components/ui/Button';

const AddEditProduct = () => {
  return (
    <div className="sony-container py-10">
      <h1 className="text-3xl font-display font-semibold mb-8">Add / Edit Product</h1>

      <div className="max-w-2xl border border-sony-light p-8">
        <p className="text-sony-mid mb-6">
          Product form with fields for name, slug, description, category, price,
          stock, images, and specs. Ready for feature implementation.
        </p>
        <Button disabled>
          <Save size={16} className="mr-1" /> Save Product
        </Button>
      </div>
    </div>
  );
};

export default AddEditProduct;
