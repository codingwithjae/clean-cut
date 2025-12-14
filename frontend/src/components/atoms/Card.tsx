import { forwardRef, type HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-midnight-light border border-code-gray',
      glass: 'bg-midnight-light/60 backdrop-blur-md border border-white/10 shadow-xl',
      outline:
        'bg-transparent border border-code-gray hover:border-cyber-blue/50 transition-colors',
    };

    return (
      <div
        ref={ref}
        className={['rounded-xl p-6 text-text-primary', variants[variant], className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  },
);

Card.displayName = 'Card';

export { Card };
