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
    <div className="space-y-1.5 flex-1">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
        <label>{label}</label>
        {action}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-label={label}
        className={`w-full ${heightClass} p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none leading-relaxed`}
      />
    </div>
  );
};
