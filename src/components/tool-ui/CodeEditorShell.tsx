import React from 'react';

interface CodeEditorShellProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  action?: React.ReactNode;
  heightClass?: string;
}

export const CodeEditorShell: React.FC<CodeEditorShellProps> = ({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
  action,
  heightClass = 'h-80',
}) => {
  return (
    <div className="space-y-2 flex-1">
      <div className="flex justify-between items-center text-xs font-semibold text-foreground">
        <label>{label}</label>
        {action}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-label={label}
        className={`w-full ${heightClass} p-4 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-foreground-muted font-mono text-[13px] outline-none ring-0 focus:outline-none focus:ring-0 focus:border-border-strong resize-none leading-6 shadow-none transition-colors`}
      />
    </div>
  );
};
