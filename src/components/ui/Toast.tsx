import React from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  const styles = {
    success: 'bg-success/10 border-success/30 text-success',
    error: 'bg-danger/10 border-danger/30 text-danger',
    info: 'bg-accent/10 border-accent/30 text-accent',
  };

  return (
    <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-md border shadow-popover text-xs font-semibold ${styles[type]}`}>
      {message}
    </div>
  );
};
