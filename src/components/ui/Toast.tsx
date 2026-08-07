import React from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  const styles = {
    success: 'bg-emerald-950/90 border-emerald-800 text-emerald-300',
    error: 'bg-rose-950/90 border-rose-800 text-rose-300',
    info: 'bg-slate-900 border-slate-800 text-slate-200',
  };

  return (
    <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-xl border shadow-xl text-xs font-semibold ${styles[type]}`}>
      {message}
    </div>
  );
};
