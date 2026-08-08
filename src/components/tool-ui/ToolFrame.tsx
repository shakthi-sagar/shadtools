import React from 'react';

export interface ToolFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const ToolFrame: React.FC<ToolFrameProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-border bg-surface ${className}`}
    >
      {children}
    </div>
  );
};
