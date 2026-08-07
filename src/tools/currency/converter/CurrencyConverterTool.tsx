import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, DollarSign } from 'lucide-react';
import { CURRENCIES, convertCurrency } from '@/tools/currency/converter/convert-currency';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { Button } from '@/components/ui/Button';

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
    <ToolFrame className="shadow-xs border-border">
      {/* Top IDE Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border flex-wrap gap-2">
        <span className="text-xs font-bold text-foreground tracking-tight flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-accent" />
          Live Currency Converter
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleSwap}
          leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}
          className="h-8 text-xs font-medium"
        >
          Swap Currencies
        </Button>
      </div>

      <div className="p-5 sm:p-6 bg-surface space-y-6">
        {/* Converter Controls Grid - Clean 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          {/* Amount Input */}
          <div className="space-y-1.5">
            <label htmlFor="curr-amount" className="text-xs font-bold text-foreground-secondary block">
              Amount
            </label>
            <input
              id="curr-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md bg-surface-input border border-border text-foreground font-mono text-sm focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {/* From Currency Select */}
          <div className="space-y-1.5">
            <label htmlFor="curr-from" className="text-xs font-bold text-foreground-secondary block">
              From Currency
            </label>
            <select
              id="curr-from"
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-surface border border-border text-foreground text-xs font-medium focus:outline-none focus:border-border-strong cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* To Currency Select */}
          <div className="space-y-1.5">
            <label htmlFor="curr-to" className="text-xs font-bold text-foreground-secondary block">
              To Currency
            </label>
            <select
              id="curr-to"
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-surface border border-border text-foreground text-xs font-medium focus:outline-none focus:border-border-strong cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculated Result Display Card */}
        <div className="p-4 rounded-md bg-surface-subtle border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider font-mono">
              CONVERTED RESULT
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              className="h-7 px-2.5 text-xs font-medium"
            >
              {copied ? 'Copied Result' : 'Copy Result'}
            </Button>
          </div>

          <div className="text-2xl font-bold font-mono text-accent">
            {formattedResult} <span className="text-base text-foreground font-sans font-normal">{toCode}</span>
          </div>

          <div className="text-xs font-mono text-foreground-muted border-t border-border/50 pt-2 mt-2">
            Exchange rate: 1 {fromCode} = {singleUnitRate.toFixed(4)} {toCode}
          </div>
        </div>
      </div>
    </ToolFrame>
  );
};
