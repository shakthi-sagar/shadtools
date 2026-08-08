import React, { useId, useState } from 'react';
import { ArrowLeftRight, Check, Copy, Link as LinkIcon, Ruler } from 'lucide-react';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { Button } from '@/components/ui/Button';

export interface UnitOption {
  id: string;
  name: string;
  symbol: string;
}

export interface ConverterLayoutProps {
  title?: string;
  icon?: React.ReactNode;
  amount: number;
  fromId: string;
  toId: string;
  units: UnitOption[];
  result?: number | string;
  formattedResult: string;
  formula?: string;
  steps?: string;
  amountLabel?: string;
  fromLabel?: string;
  toLabel?: string;
  resultLabel?: string;
  copyValue?: string;
  onAmountChange: (value: number) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onSwap?: () => void;
  onCopyStateUrl?: () => void | Promise<void>;
  onCopy?: () => void;
}

export const ConverterLayout: React.FC<ConverterLayoutProps> = ({
  title = 'Unit converter',
  icon,
  amount,
  fromId,
  toId,
  units,
  formattedResult,
  formula,
  steps,
  amountLabel = 'Amount',
  fromLabel = 'From',
  toLabel = 'To',
  resultLabel = 'Converted result',
  copyValue,
  onAmountChange,
  onFromChange,
  onToChange,
  onSwap,
  onCopyStateUrl,
  onCopy,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const fieldId = useId();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyValue ?? formattedResult);
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (onCopyStateUrl) {
      await onCopyStateUrl();
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const controlClassName =
    'w-full h-10 px-3 rounded-md bg-surface-input border border-border text-foreground text-sm outline-none ring-0 focus:outline-none focus:ring-2 focus:ring-focus/15 focus:border-border-strong transition-colors';

  return (
    <ToolFrame>
      <div className="min-h-[50px] px-4 py-2.5 bg-surface-subtle border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
          {icon ?? <Ruler className="w-4 h-4 text-accent" aria-hidden="true" />}
          <span>{title}</span>
        </div>
        {onSwap && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onSwap}
            leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />}
            className="h-8"
          >
            Swap units
          </Button>
        )}
      </div>

      <div className="p-4 sm:p-[18px] bg-surface space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          <div className="space-y-2">
            <label htmlFor={`${fieldId}-amount`} className="block text-xs font-semibold text-foreground-secondary">
              {amountLabel}
            </label>
            <input
              id={`${fieldId}-amount`}
              type="number"
              value={Number.isNaN(amount) ? '' : amount}
              onChange={(event) => onAmountChange(Number.parseFloat(event.target.value) || 0)}
              className={`${controlClassName} font-mono tabular-nums`}
              placeholder="Enter a value"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={`${fieldId}-from`} className="block text-xs font-semibold text-foreground-secondary">
              {fromLabel}
            </label>
            <select
              id={`${fieldId}-from`}
              value={fromId}
              onChange={(event) => onFromChange(event.target.value)}
              className={`${controlClassName} cursor-pointer`}
            >
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor={`${fieldId}-to`} className="block text-xs font-semibold text-foreground-secondary">
              {toLabel}
            </label>
            <select
              id={`${fieldId}-to`}
              value={toId}
              onChange={(event) => onToChange(event.target.value)}
              className={`${controlClassName} cursor-pointer`}
            >
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg bg-surface-subtle border border-border overflow-hidden">
          <div className="min-h-10 px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-border/70">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground-muted">
                {resultLabel}
              </span>
              {formula && (
                <span className="text-[11px] font-mono text-foreground-muted truncate">
                  {formula}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onCopyStateUrl && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleShare}
                  leftIcon={shared ? <Check className="w-3.5 h-3.5 text-success" /> : <LinkIcon className="w-3.5 h-3.5" />}
                  className="h-7"
                >
                  {shared ? 'Link copied' : 'Share link'}
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                className="h-7"
              >
                {copied ? 'Copied' : 'Copy result'}
              </Button>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-5">
            <p className="font-mono text-2xl sm:text-[1.75rem] leading-tight font-medium tracking-[-0.025em] text-accent break-words tabular-nums">
              {formattedResult}
            </p>
            {steps && (
              <p className="mt-2 text-xs leading-5 font-mono text-foreground-muted">
                {steps}
              </p>
            )}
          </div>
        </div>
      </div>
    </ToolFrame>
  );
};
