import React from 'react';

export interface ToolToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export const ToolToolbar: React.FC<ToolToolbarProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`min-h-[50px] px-4 py-2.5 bg-surface-subtle border-b border-border flex flex-wrap items-center justify-between gap-3 text-sm select-none ${className}`}
    >
      {children}
    </div>
  );
};
