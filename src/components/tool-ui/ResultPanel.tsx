import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ResultPanelProps {
  label: string;
  value: string;
  copyable?: boolean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ label, value, copyable = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg bg-surface-subtle border border-border overflow-hidden">
      <div className="min-h-10 px-4 py-2 border-b border-border/70 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground-muted">
          {label}
        </span>
        {copyable && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            disabled={!value}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            className="h-7"
          >
            {copied ? 'Copied' : 'Copy result'}
          </Button>
        )}
      </div>
      <div className="px-4 py-4 font-mono text-xl sm:text-2xl leading-tight font-medium text-accent break-words tabular-nums">
        {value || '—'}
      </div>
    </div>
  );
};
