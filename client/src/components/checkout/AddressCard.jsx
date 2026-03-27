import { cn } from '../../utils/cn';
import { MapPin, Check } from 'lucide-react';

const AddressCard = ({ address, selected, onSelect, onEdit, onDelete }) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'p-4 border-2 cursor-pointer transition-all',
        selected ? 'border-sony-black' : 'border-sony-light hover:border-sony-mid'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <MapPin size={18} className="text-sony-mid mt-0.5 flex-shrink-0" />
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-semibold text-sony-black">
                {address.label}
              </span>
              {address.isDefault && (
                <span className="text-[10px] bg-sony-black text-white px-1.5 py-0.5 font-medium">
                  DEFAULT
                </span>
              )}
            </div>
            <p className="text-sm text-sony-dark">{address.line1}</p>
            <p className="text-sm text-sony-dark">
              {address.city}, {address.state} — {address.pincode}
            </p>
            {address.phone && (
              <p className="text-sm text-sony-mid mt-1">📞 {address.phone}</p>
            )}
          </div>
        </div>
        {selected && (
          <Check size={20} className="text-sony-black flex-shrink-0" />
        )}
      </div>
    </div>
  );
};

export default AddressCard;
