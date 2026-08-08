import React from 'react';

interface ToolShellProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const ToolShell: React.FC<ToolShellProps> = ({ title, description, children, actions }) => {
  return (
    <div className="rounded-[10px] border border-border bg-surface overflow-hidden">
      {(title || description || actions) && (
        <div className="min-h-[50px] px-4 py-3 bg-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
          <div>
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="text-xs leading-5 text-foreground-secondary mt-0.5">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};
