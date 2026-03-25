import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-sony-black text-white hover:bg-sony-dark',
  secondary: 'bg-sony-light text-sony-black hover:bg-sony-mid hover:text-white',
  outline: 'border-2 border-sony-black text-sony-black hover:bg-sony-black hover:text-white',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-sony-dark hover:bg-sony-light',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sony-dark focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
