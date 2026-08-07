import React from 'react';

export interface ToolFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const ToolFrame: React.FC<ToolFrameProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`border border-border bg-surface rounded-lg overflow-hidden transition-colors ${className}`}
    >
      {children}
    </div>
  );
};
