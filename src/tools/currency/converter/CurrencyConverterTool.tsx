import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { CURRENCIES, convertCurrency } from './convert-currency';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';
import { Button } from '../../../components/ui/Button';

export interface CurrencyConverterToolProps {
  config?: any;
  initialValue?: number | string;
  initialFrom?: string;
  initialTo?: string;
}

export const CurrencyConverterTool: React.FC<CurrencyConverterToolProps> = ({
  initialValue = '100',
  initialFrom = 'USD',
  initialTo = 'EUR',
}) => {
  const [amount, setAmount] = useState<string>(String(initialValue));
  const [fromCode, setFromCode] = useState<string>(initialFrom);
  const [toCode, setToCode] = useState<string>(initialTo);
  const [copied, setCopied] = useState<boolean>(false);

  const numAmount = parseFloat(amount) || 0;
  const result = convertCurrency(numAmount, fromCode, toCode);
  const singleUnitRate = convertCurrency(1, fromCode, toCode);
  const formattedResult = result.toFixed(2);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${formattedResult} ${toCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolFrame className="p-5 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
        {/* From Amount Column */}
        <div className="space-y-2">
          <label htmlFor="curr-amount" className="text-xs font-semibold text-foreground-secondary block">
            Amount
          </label>
          <input
            id="curr-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-surface-input border border-border text-foreground font-mono text-base focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus h-10"
          />
          <select
            aria-label="From Currency"
            value={fromCode}
            onChange={(e) => setFromCode(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-surface-input border border-border text-foreground text-sm cursor-pointer focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus h-10"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} – {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Action */}
        <div className="flex justify-center md:pt-6">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap Currencies"
            title="Swap Currencies"
            className="p-2.5 rounded-md bg-surface border border-border hover:bg-surface-subtle hover:border-border-strong text-foreground-secondary hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer select-none"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Converted Result Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-secondary block">Converted Value</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              className="py-0 px-1.5 text-[11px] h-5 min-h-[20px]"
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="w-full px-3.5 py-2 rounded-md bg-surface-subtle border border-border text-accent font-mono text-2xl font-bold tabular-nums truncate h-10 flex items-center">
            {formattedResult} <span className="text-sm font-normal text-foreground-muted ml-1.5">{toCode}</span>
          </div>
          <select
            aria-label="To Currency"
            value={toCode}
            onChange={(e) => setToCode(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-surface-input border border-border text-foreground text-sm cursor-pointer focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus h-10"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} – {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-foreground-muted font-mono">
        <span>Exchange rate: 1 {fromCode} = {singleUnitRate.toFixed(4)} {toCode}</span>
        <span className="text-accent font-medium flex items-center gap-1">ℹ Cached daily exchange data</span>
      </div>
    </ToolFrame>
  );
};
