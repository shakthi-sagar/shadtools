import React from 'react';

interface ToolToolbarProps {
  children: React.ReactNode;
}

export const ToolToolbar: React.FC<ToolToolbarProps> = ({ children }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
      {children}
    </div>
  );
};
