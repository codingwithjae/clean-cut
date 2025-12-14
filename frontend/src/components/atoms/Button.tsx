import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { FaSpinner } from 'react-icons/fa';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props },
    ref,
  ) => {
    const variants = {
      primary:
        'bg-cyber-blue text-white hover:bg-cyber-blue-hover shadow-[0_0_15px_rgba(13,147,242,0.5)] border-transparent',
      secondary: 'bg-code-gray text-white hover:bg-opacity-80 border-transparent',
      outline: 'bg-transparent border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10 border',
      ghost:
        'bg-transparent text-text-secondary hover:text-white hover:bg-white/5 border-transparent',
      danger: 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20 border',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg',
      icon: 'h-10 w-10 p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95',
          variants[variant],
          sizes[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {isLoading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
