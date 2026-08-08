import React, { useState } from 'react';
import { ArrowLeftRight, Check, Copy, Link } from 'lucide-react';

export interface UnitOption { id: string; name: string; symbol: string; }
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
  amount, fromId, toId, units, formattedResult, formula, steps,
  onAmountChange, onFromChange, onToChange, onSwap, onCopyStateUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const copyResult = () => {
    navigator.clipboard.writeText(formattedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const copyLink = () => {
    if (onCopyStateUrl) onCopyStateUrl();
    else navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 1800);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="grid gap-4 border-b border-border p-4 sm:grid-cols-[1fr_1fr_40px_1fr] sm:items-end sm:p-5">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-foreground-secondary">Value</span>
          <input
            type="number"
            value={Number.isNaN(amount) ? '' : amount}
            onChange={(event) => onAmountChange(Number.parseFloat(event.target.value) || 0)}
            className="h-11 w-full rounded-md border border-border bg-surface-input px-3 font-mono text-sm text-foreground outline-none focus:border-border-strong focus:ring-2 focus:ring-focus/20"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-foreground-secondary">From</span>
          <select value={fromId} onChange={(event) => onFromChange(event.target.value)} className="h-11 w-full rounded-md border border-border bg-surface-input px-3 text-sm text-foreground outline-none focus:border-border-strong">
            {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>)}
          </select>
        </label>
        {onSwap && (
          <button type="button" onClick={onSwap} className="grid h-10 w-10 place-items-center rounded-md border border-border bg-surface-subtle text-foreground-secondary hover:border-border-strong hover:text-foreground" title="Swap units" aria-label="Swap units">
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        )}
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-foreground-secondary">To</span>
          <select value={toId} onChange={(event) => onToChange(event.target.value)} className="h-11 w-full rounded-md border border-border bg-surface-input px-3 text-sm text-foreground outline-none focus:border-border-strong">
            {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>)}
          </select>
        </label>
      </div>

      <div className="bg-surface-subtle/60 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase text-foreground-muted">Converted result</span>
            <p className="mt-1 break-words font-mono text-2xl font-semibold leading-tight text-foreground sm:text-3xl">{formattedResult}</p>
            {formula && <p className="mt-2 font-mono text-xs text-foreground-muted">Formula: <span className="text-foreground-secondary">{formula}</span></p>}
            {steps && <p className="mt-1 font-mono text-xs text-foreground-muted">Calculation: <span className="text-accent">{steps}</span></p>}
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={copyLink} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground-secondary hover:border-border-strong hover:text-foreground">
              {shared ? <Check className="h-3.5 w-3.5 text-success" /> : <Link className="h-3.5 w-3.5" />}{shared ? 'Copied' : 'Share'}
            </button>
            <button type="button" onClick={copyResult} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent px-2.5 text-xs font-medium text-accent-foreground hover:bg-accent-hover">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
