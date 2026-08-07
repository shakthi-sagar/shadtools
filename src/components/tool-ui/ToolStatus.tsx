import React from 'react';

interface ToolStatusProps {
  type?: 'success' | 'error' | 'info';
  message: string;
}

export const ToolStatus: React.FC<ToolStatusProps> = ({ type = 'info', message }) => {
  if (!message) return null;

  const colorStyles = {
    success: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
    error: 'bg-rose-950/60 border-rose-800 text-rose-300',
    info: 'bg-sky-950/60 border-sky-800 text-sky-300',
  }[type];

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`p-3 rounded-lg border text-sm font-medium leading-relaxed ${colorStyles}`}
    >
      {message}
    </div>
  );
};
