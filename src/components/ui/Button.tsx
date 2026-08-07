import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors select-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1 text-xs min-h-[32px]',
    md: 'px-3.5 py-2 text-sm min-h-[40px]',
    lg: 'px-4 py-2.5 text-sm font-semibold min-h-[44px]',
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover',
    secondary: 'bg-surface border border-border text-foreground hover:bg-surface-subtle hover:border-border-strong',
    ghost: 'text-foreground-secondary hover:bg-surface-subtle hover:text-foreground',
    danger: 'bg-danger text-white hover:opacity-90',
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
