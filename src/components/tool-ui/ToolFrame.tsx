import React from 'react';

export interface ToolFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const ToolFrame: React.FC<ToolFrameProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`border border-border bg-surface rounded-[10px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors ${className}`}
    >
      {children}
    </div>
  );
};
