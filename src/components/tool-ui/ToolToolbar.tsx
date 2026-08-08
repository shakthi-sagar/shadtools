import React from 'react';

export interface ToolToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export const ToolToolbar: React.FC<ToolToolbarProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`flex min-h-[46px] flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-subtle px-4 py-2 text-sm select-none ${className}`}
    >
      {children}
    </div>
  );
};
