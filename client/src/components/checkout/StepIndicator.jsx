import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

const steps = ['Address', 'Payment', 'Review'];

const StepIndicator = ({ currentStep = 0 }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                index < currentStep
                  ? 'bg-sony-black text-white'
                  : index === currentStep
                  ? 'bg-sony-black text-white'
                  : 'bg-sony-light text-sony-mid'
              )}
            >
              {index < currentStep ? <Check size={16} /> : index + 1}
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                index <= currentStep ? 'text-sony-black' : 'text-sony-mid'
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-12 h-px mx-3',
                index < currentStep ? 'bg-sony-black' : 'bg-sony-light'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
