import React from 'react';

export interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Disclosure: React.FC<DisclosureProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
}) => {
  return (
    <details
      open={defaultOpen}
      className={`group rounded-md border border-border bg-surface transition-colors ${className}`}
    >
      <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-focus rounded-md select-none">
        <span>{title}</span>
        <svg
          className="h-4 w-4 text-foreground-muted transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="p-4 pt-0 text-sm text-foreground-secondary leading-relaxed border-t border-border/50">
        {children}
      </div>
    </details>
  );
};
