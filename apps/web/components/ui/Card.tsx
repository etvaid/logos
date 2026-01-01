'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg';

    const variants = {
      default: '',
      hover: 'hover:border-[#C9A962]/40 hover:bg-[#C9A962]/10 transition-all',
      interactive: 'hover:border-[#C9A962]/60 hover:bg-[#C9A962]/10 cursor-pointer transition-all active:scale-[0.99]',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
