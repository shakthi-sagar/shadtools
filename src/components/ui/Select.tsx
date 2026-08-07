import React from 'react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full px-3 py-2 rounded-md bg-surface-input border border-border text-foreground text-sm font-sans min-h-[40px] cursor-pointer focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
