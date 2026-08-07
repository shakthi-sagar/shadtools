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
      <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
        <span>{label}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            disabled={!value}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400 disabled:opacity-50 text-xs font-medium transition-colors"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        )}
      </div>
      <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-lg font-bold text-indigo-300 break-all">
        {value || '—'}
      </div>
    </div>
  );
};
