import { X, Trash2 } from 'lucide-react';
import useCompareStore from '../store/compareStore';
import { formatPrice } from '../utils/formatPrice';
import Button from '../components/ui/Button';

const Compare = () => {
  const { items, removeFromCompare, clearCompare } = useCompareStore();

  const allSpecs = items.length > 0
    ? [...new Set(items.flatMap((p) => Object.keys(p.specs || {})))]
    : [];

  return (
    <div className="sony-container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-semibold">Compare Cameras</h1>
        {items.length > 0 && (
          <Button variant="ghost" onClick={clearCompare} size="sm">
            <Trash2 size={14} className="mr-1" /> Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sony-mid text-lg">
            Add up to 3 cameras to compare their specs side by side.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-sony-light">
            <thead>
              <tr>
                <th className="p-4 text-left text-sm font-medium text-sony-mid border-b border-sony-light bg-sony-light/30">
                  Feature
                </th>
                {items.map((product) => (
                  <th key={product._id} className="p-4 border-b border-sony-light text-center relative">
                    <button
                      onClick={() => removeFromCompare(product._id)}
                      className="absolute top-2 right-2 text-sony-mid hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                    <img src={product.images?.[0]} alt={product.name} className="w-24 h-24 object-cover mx-auto mb-2" />
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-sm font-bold mt-1">{formatPrice(product.price)}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allSpecs.map((spec) => (
                <tr key={spec} className="border-b border-sony-light">
                  <td className="p-3 text-sm font-medium text-sony-dark capitalize bg-sony-light/30">
                    {spec}
                  </td>
                  {items.map((product) => (
                    <td key={product._id} className="p-3 text-sm text-center text-sony-black">
                      {product.specs?.[spec] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compare;
