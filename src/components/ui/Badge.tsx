import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    neutral: 'bg-surface-subtle border-border text-foreground-secondary',
    accent: 'bg-accent-subtle border-accent/20 text-accent font-medium',
    info: 'bg-accent-subtle border-accent/20 text-accent font-medium',
    success: 'bg-success/10 border-success/30 text-success font-medium',
    warning: 'bg-warning/10 border-warning/30 text-warning font-medium',
    danger: 'bg-danger/10 border-danger/30 text-danger font-medium',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium tracking-wide font-sans ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
