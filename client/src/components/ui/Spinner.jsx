import { cn } from '../../utils/cn';

const Spinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'border-2 border-sony-light border-t-sony-black rounded-full animate-spin',
          sizes[size]
        )}
      />
    </div>
  );
};

export default Spinner;
