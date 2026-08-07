import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

export interface UnitOption {
  id: string;
  name: string;
  symbol: string;
}

export interface ConverterLayoutProps {
  title?: string;
  amount: number;
  fromId: string;
  toId: string;
  units: UnitOption[];
  result?: number | string;
  formattedResult: string;
  formula?: string;
  steps?: string;
  onAmountChange: (val: number) => void;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  onSwap?: () => void;
  onCopyStateUrl?: () => void;
}

export const ConverterLayout: React.FC<ConverterLayoutProps> = ({
  amount,
  fromId,
  toId,
  units,
  formattedResult,
  formula,
  steps,
  onAmountChange,
  onFromChange,
  onToChange,
  onSwap,
  onCopyStateUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (onCopyStateUrl) {
      onCopyStateUrl();
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1120px] mx-auto">
      {/* 3-Column Input Architecture (Mandatory Directive 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start bg-surface p-4 sm:p-5 rounded-lg border border-border">
        {/* Amount Input */}
        <div className="space-y-1.5 w-full">
          <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wider font-mono">
            Amount
          </label>
          <input
            type="number"
            value={isNaN(amount) ? '' : amount}
            onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
            className="w-full h-10 px-3 bg-surface-input text-foreground font-mono text-sm border border-border rounded-md outline-none ring-0 focus:outline-none focus:ring-0 focus:border-accent transition-colors"
            placeholder="Enter value..."
          />
        </div>

        {/* From Unit Selector */}
        <div className="space-y-1.5 w-full">
          <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wider font-mono">
            From
          </label>
          <select
            value={fromId}
            onChange={(e) => onFromChange(e.target.value)}
            className="w-full h-10 px-3 bg-surface-input text-foreground font-mono text-sm border border-border rounded-md outline-none ring-0 focus:outline-none focus:ring-0 focus:border-accent transition-colors cursor-pointer"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* To Unit Selector */}
        <div className="space-y-1.5 w-full">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-foreground-secondary uppercase tracking-wider font-mono">
              To
            </label>
            {onSwap && (
              <button
                type="button"
                onClick={onSwap}
                className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                title="Swap units"
              >
                ⇄ Swap
              </button>
            )}
          </div>
          <select
            value={toId}
            onChange={(e) => onToChange(e.target.value)}
            className="w-full h-10 px-3 bg-surface-input text-foreground font-mono text-sm border border-border rounded-md outline-none ring-0 focus:outline-none focus:ring-0 focus:border-accent transition-colors cursor-pointer"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Converted Result Card */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {/* Header Strip with Copy Result Button (Mandatory Directive 4) */}
        <div className="h-10 px-4 bg-surface-subtle border-b border-border flex items-center justify-between">
          <span className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wider font-mono">
            Converted Result
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-2.5 py-1 text-xs font-medium font-mono text-foreground-secondary hover:text-foreground bg-surface border border-border rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy shareable link"
            >
              {shared ? <Check className="w-3.5 h-3.5 text-success" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{shared ? 'Link Copied!' : 'Share Link'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs font-medium font-mono text-accent hover:text-accent-hover bg-accent-subtle/40 border border-accent/30 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Result'}</span>
            </button>
          </div>
        </div>

        {/* Result Body */}
        <div className="p-5 space-y-2">
          <p className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
            {formattedResult}
          </p>
          {formula && (
            <p className="text-xs font-mono text-foreground-muted">
              Formula: <span className="text-foreground">{formula}</span>
            </p>
          )}
          {steps && (
            <p className="text-xs font-mono text-foreground-muted">
              Step: <span className="text-accent font-semibold">{steps}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
