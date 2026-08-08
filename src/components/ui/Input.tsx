import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`min-h-[40px] w-full rounded-md border border-border bg-surface-input px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground-muted focus:border-border-strong focus:ring-2 focus:ring-focus/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
