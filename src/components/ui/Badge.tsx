import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'info' | 'success' | 'warning';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    neutral: 'bg-surface-subtle border-border text-foreground-secondary',
    info: 'bg-primary-subtle border-transparent text-primary',
    success: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400',
    warning: 'bg-amber-950/40 border-amber-800/40 text-amber-400',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium tracking-wide uppercase font-sans ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
