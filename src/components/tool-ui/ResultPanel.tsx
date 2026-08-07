import React, { useState } from 'react';

interface ResultPanelProps {
  label: string;
  value: string;
  copyable?: boolean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ label, value, copyable = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-semibold text-foreground-secondary">
        <span>{label}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            disabled={!value}
            className="px-2.5 py-1 rounded-md bg-surface border border-border hover:bg-surface-subtle text-accent disabled:opacity-50 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        )}
      </div>
      <div className="p-4 rounded-md bg-surface-subtle border border-border font-mono text-lg font-bold text-accent break-all tabular-nums">
        {value || '—'}
      </div>
    </div>
  );
};
