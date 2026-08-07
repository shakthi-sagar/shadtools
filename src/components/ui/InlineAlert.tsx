import React from 'react';

export interface InlineAlertProps {
  title?: string;
  message: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
}

export const InlineAlert: React.FC<InlineAlertProps> = ({ title, message, variant = 'error' }) => {
  const variantStyles = {
    error: 'bg-rose-950/40 border-rose-800/60 text-rose-300',
    warning: 'bg-amber-950/40 border-amber-800/60 text-amber-300',
    info: 'bg-indigo-950/40 border-indigo-800/60 text-indigo-300',
    success: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300',
  };

  return (
    <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${variantStyles[variant]}`}>
      {title && <span className="font-bold block mb-0.5">{title}</span>}
      <span>{message}</span>
    </div>
  );
};
