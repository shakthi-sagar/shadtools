import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 rounded-md bg-surface-input border border-border text-foreground placeholder:text-foreground-muted text-sm font-sans min-h-[40px] focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
