import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'secondary' | 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 p-1.5 text-xs',
    md: 'w-10 h-10 p-2 text-sm',
    lg: 'w-11 h-11 p-2.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-surface border border-border text-foreground hover:bg-surface-subtle hover:border-border-strong',
    ghost: 'text-foreground-secondary hover:bg-surface-subtle hover:text-foreground',
  };

  return (
    <button
      aria-label={label}
      title={label}
      className={`rounded-md transition-colors inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
