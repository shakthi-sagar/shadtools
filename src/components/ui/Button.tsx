import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors select-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed gap-1.5 whitespace-nowrap';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs h-7 min-h-[28px]',
    md: 'px-3.5 py-1.5 text-sm h-9 min-h-[36px]',
    lg: 'px-4 py-2 text-sm font-semibold h-11 min-h-[44px]',
  };

  const variantStyles = {
    primary: 'bg-action text-action-foreground hover:bg-action-hover active:bg-action-hover',
    secondary: 'bg-surface border border-border text-foreground hover:bg-surface-subtle hover:border-border-strong',
    ghost: 'text-foreground-secondary hover:bg-surface-subtle hover:text-foreground',
    danger: 'bg-action-danger text-action-danger-foreground hover:bg-action-danger-hover active:bg-action-danger-hover',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-3.5 w-3.5 text-current shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
};
