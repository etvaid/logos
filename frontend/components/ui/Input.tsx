'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-[#C9A962] mb-2">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F3EF]/50">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 bg-[#0D0D0F] border rounded-lg
              text-[#F5F3EF] placeholder:text-[#F5F3EF]/30
              focus:outline-none focus:border-[#C9A962] focus:ring-1 focus:ring-[#C9A962]/50
              transition-all
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500/50' : 'border-[#C9A962]/20'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
