'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-[#C9A962] mb-2">{label}</label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg
            text-[#F5F3EF]
            focus:outline-none focus:border-[#C9A962] focus:ring-1 focus:ring-[#C9A962]/50
            transition-all appearance-none cursor-pointer
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23C9A962' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
