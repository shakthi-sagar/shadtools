import React from 'react';
import { AlertCircle } from 'lucide-react';

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
  minHeightClass = 'min-h-[220px]',
  autoFocus = false,
  showCharCount = true,
}) => {
  return (
    <div className="flex flex-col flex-1 min-w-0 bg-surface">
      <div className="min-h-10 px-4 py-2 bg-surface-subtle/70 border-b border-border flex items-center justify-between gap-3 shrink-0">
        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        <div className="flex items-center gap-2">
          {showCharCount && (
            <span className="text-[11px] tabular-nums text-foreground-muted">
              {value.length.toLocaleString()} chars
            </span>
          )}
          {actions}
        </div>
      </div>

      {error ? (
        <div className="p-4 text-[13px] font-mono text-danger bg-danger/5 flex-1 leading-6 flex gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-label={label}
          autoFocus={autoFocus}
          className={`flex-1 w-full p-4 sm:p-5 bg-surface-input text-foreground placeholder:text-foreground-muted font-mono text-[13px] leading-6 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:bg-surface-input resize-none border-none shadow-none ${minHeightClass} transition-colors`}
        />
      )}
    </div>
  );
};
