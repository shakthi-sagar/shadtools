import React from 'react';

export interface ToolPaneProps {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ToolPane: React.FC<ToolPaneProps> = ({
  title,
  actions,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col flex-1 min-w-0 ${className}`}>
      {title && (
        <div className="px-4 py-2 border-b border-border bg-surface-subtle/50 flex items-center justify-between">
          <span className="text-[13px] font-medium text-foreground-muted tracking-wide uppercase font-sans">
            {title}
          </span>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="flex-1 flex flex-col min-h-0 bg-surface-input">{children}</div>
    </div>
  );
};
