import React from 'react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`min-h-[40px] w-full cursor-pointer rounded-md border border-border bg-surface-input px-3 py-2 text-sm text-foreground outline-none focus:border-border-strong focus:ring-2 focus:ring-focus/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
