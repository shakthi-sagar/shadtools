import React from 'react';

interface ToolStatusProps {
  type?: 'success' | 'error' | 'info';
  message: string;
}

export const ToolStatus: React.FC<ToolStatusProps> = ({ type = 'info', message }) => {
  if (!message) return null;

  const colorStyles = {
    success: 'bg-success/10 border-success/30 text-success',
    error: 'bg-danger/10 border-danger/30 text-danger',
    info: 'bg-accent/10 border-accent/30 text-accent',
  }[type];

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`p-3 rounded-md border text-xs sm:text-sm font-medium leading-relaxed ${colorStyles}`}
    >
      {message}
    </div>
  );
};
