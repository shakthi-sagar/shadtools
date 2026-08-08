import React from 'react';

export interface CodeEditorPaneProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  error?: string | null;
  minHeightClass?: string;
  autoFocus?: boolean;
  showCharCount?: boolean;
}

export const CodeEditorPane: React.FC<CodeEditorPaneProps> = ({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
  actions,
  icon,
  error,
  minHeightClass = 'min-h-[160px]',
  autoFocus = false,
  showCharCount = true,
}) => (
  <div className="flex min-w-0 flex-1 flex-col bg-surface">
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-surface-subtle px-4">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-foreground-secondary">
        {icon}{label}
      </span>
      <div className="flex items-center gap-2">
        {showCharCount && <span className="text-[10px] font-mono text-foreground-muted">{value.length} chars</span>}
        {actions}
      </div>
    </div>
    {error ? (
      <div className="flex-1 border-l-2 border-danger bg-danger/5 p-4 font-mono text-xs leading-6 text-danger">{error}</div>
    ) : (
      <textarea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-label={label}
        autoFocus={autoFocus}
        className={`w-full flex-1 resize-none border-none bg-surface-input p-4 font-mono text-xs leading-6 text-foreground shadow-none outline-none placeholder:text-foreground-muted focus:bg-surface-input focus:outline-none focus:ring-0 ${minHeightClass}`}
      />
    )}
  </div>
);
