import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, label, className = '', ...props }) => {
  return (
    <button
      aria-label={label}
      title={label}
      className={`p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
