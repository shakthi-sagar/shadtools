import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { CURRENCIES, convertCurrency } from './convert-currency';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';

export const CurrencyConverterTool: React.FC = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('EUR');

  const numAmount = parseFloat(amount) || 0;
  const result = convertCurrency(numAmount, fromCode, toCode);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  return (
    <ToolFrame className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
        {/* From Amount */}
        <div className="space-y-2">
          <label htmlFor="curr-amount" className="text-xs font-medium text-foreground-secondary block">
            Amount
          </label>
          <input
            id="curr-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-surface-input border border-border text-foreground font-mono text-base focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus min-h-[40px]"
          />
          <select
            aria-label="From Currency"
            value={fromCode}
            onChange={(e) => setFromCode(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-surface-input border border-border text-foreground text-sm cursor-pointer focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus min-h-[40px]"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} – {c.name}</option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center pt-2 md:pt-4">
          <button
            onClick={handleSwap}
            aria-label="Swap Currencies"
            title="Swap Currencies"
            className="p-2.5 rounded-md bg-surface border border-border hover:bg-surface-subtle hover:border-border-strong text-foreground-secondary hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Converted Amount */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground-secondary block">Converted Value</span>
          <div className="w-full px-3 py-2 rounded-md bg-surface-subtle border border-border text-primary font-mono text-2xl font-semibold tabular-nums truncate min-h-[40px] flex items-center">
            {result.toFixed(2)} {toCode}
          </div>
          <select
            aria-label="To Currency"
            value={toCode}
            onChange={(e) => setToCode(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-surface-input border border-border text-foreground text-sm cursor-pointer focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus min-h-[40px]"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} – {c.name}</option>
            ))}
          </select>
        </div>
      </div>
    </ToolFrame>
  );
};
