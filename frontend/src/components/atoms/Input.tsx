import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-sm font-medium text-text-secondary ml-1">
            {label}
            {props.required && <span className="text-cyber-blue ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={[
              'flex h-10 w-full rounded-lg border border-code-gray bg-midnight-light px-3 py-2 text-sm text-white placeholder:text-text-secondary/50 focus:border-cyber-blue focus:outline-none focus:ring-1 focus:ring-cyber-blue disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
              icon ? 'pl-10' : '',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
