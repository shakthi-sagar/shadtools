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
}) => {
  return (
    <div className="flex flex-col flex-1 bg-surface">
      {/* Pane Header Strip */}
      <div className="h-9 px-4 bg-surface-subtle/80 border-b border-border flex items-center justify-between shrink-0">
        <span className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wider font-mono flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        <div className="flex items-center gap-2">
          {showCharCount && (
            <span className="text-[11px] font-mono font-medium text-foreground-muted">
              {value.length} characters
            </span>
          )}
          {actions}
        </div>
      </div>

      {/* Editor Body or Error Message */}
      {error ? (
        <div className="p-4 text-xs font-mono text-danger bg-danger/5 flex-1 leading-relaxed border-l-2 border-danger">
          ⚠️ {error}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-label={label}
          autoFocus={autoFocus}
          className={`flex-1 w-full p-4 bg-surface-input text-foreground font-mono text-xs leading-relaxed outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:bg-surface-input resize-none border-none shadow-none ${minHeightClass} transition-colors`}
        />
      )}
    </div>
  );
};
