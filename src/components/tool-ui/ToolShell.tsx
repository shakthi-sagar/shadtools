import React from 'react';

interface ToolShellProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const ToolShell: React.FC<ToolShellProps> = ({ title, description, children, actions }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 space-y-4 shadow-sm">
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            {title && <h2 className="text-base font-semibold text-slate-100">{title}</h2>}
            {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
