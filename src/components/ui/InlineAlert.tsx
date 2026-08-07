import React from 'react';

export interface InlineAlertProps {
  title?: string;
  message: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
}

export const InlineAlert: React.FC<InlineAlertProps> = ({ title, message, variant = 'error' }) => {
  const variantStyles = {
    error: 'bg-danger/10 border-danger/30 text-danger',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    info: 'bg-accent/10 border-accent/30 text-accent',
    success: 'bg-success/10 border-success/30 text-success',
  };

  return (
    <div className={`p-3.5 rounded-md border text-xs leading-relaxed ${variantStyles[variant]}`}>
      {title && <span className="font-bold block mb-0.5">{title}</span>}
      <span>{message}</span>
    </div>
  );
};
