import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { LENGTH_UNITS, convertUnit } from './convert-length';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';
import { Button } from '../../../components/ui/Button';

interface LengthConverterProps {
  config?: any;
  initialValue?: number;
  initialFrom?: string;
  initialTo?: string;
}

export const LengthConverterTool: React.FC<LengthConverterProps> = ({
  initialValue,
  initialFrom,
  initialTo,
}) => {
  const [val, setVal] = useState<string>(
    initialValue != null ? String(initialValue) : '1'
  );
  const [fromUnit, setFromUnit] = useState<string>(initialFrom || 'm');
  const [toUnit, setToUnit] = useState<string>(initialTo || 'ft');
  const [copied, setCopied] = useState<boolean>(false);

  const numVal = parseFloat(val) || 0;
  const result = convertUnit(numVal, fromUnit, toUnit, LENGTH_UNITS);
  const formattedResult = Number.isInteger(result) ? String(result) : result.toFixed(4).replace(/\.?0+$/, '');

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fromUnitObj = LENGTH_UNITS.find((u) => u.id === fromUnit);
  const toUnitObj = LENGTH_UNITS.find((u) => u.id === toUnit);

  return (
    <ToolFrame className="p-5 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
        {/* From Input Column */}
        <div className="space-y-2">
          <label htmlFor="length-val" className="text-xs font-semibold text-foreground-secondary block">
            From Value
          </label>
          <input
            id="length-val"
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter value..."
            className="w-full px-3.5 py-2 rounded-md bg-surface-input border border-border text-foreground font-mono text-base focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus h-10"
          />
          <select
            aria-label="From Unit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-surface-input border border-border text-foreground text-sm cursor-pointer focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus h-10"
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.id})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Action */}
        <div className="flex justify-center md:pt-6">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap Units"
            title="Swap Units"
            className="p-2.5 rounded-md bg-surface border border-border hover:bg-surface-subtle hover:border-border-strong text-foreground-secondary hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer select-none"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Converted Result Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-secondary block">Converted Result</span>
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
            {formattedResult} <span className="text-sm font-normal text-foreground-muted ml-1.5">{toUnitObj?.id}</span>
          </div>
          <select
            aria-label="To Unit"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-surface-input border border-border text-foreground text-sm cursor-pointer focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus h-10"
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-foreground-muted font-mono">
        <span>Formula: 1 {fromUnitObj?.id} = {convertUnit(1, fromUnit, toUnit, LENGTH_UNITS).toFixed(4)} {toUnitObj?.id}</span>
        <span className="text-success font-medium flex items-center gap-1">✓ Instant conversion</span>
      </div>
    </ToolFrame>
  );
};
