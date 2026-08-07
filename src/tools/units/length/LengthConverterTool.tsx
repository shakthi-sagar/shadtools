import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { LENGTH_UNITS, convertUnit } from './convert-length';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';

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

  const numVal = parseFloat(val) || 0;
  const result = convertUnit(numVal, fromUnit, toUnit, LENGTH_UNITS);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <ToolFrame className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
        {/* From Field */}
        <div className="space-y-2">
          <label htmlFor="length-val" className="text-xs font-medium text-foreground-secondary block">
            From Value
          </label>
          <input
            id="length-val"
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-surface-input border border-border text-foreground font-mono text-base focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus min-h-[40px]"
          />
          <select
            aria-label="From Unit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-surface-input border border-border text-foreground text-sm cursor-pointer focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus min-h-[40px]"
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center pt-2 md:pt-4">
          <button
            onClick={handleSwap}
            aria-label="Swap Units"
            title="Swap Units"
            className="p-2.5 rounded-md bg-surface border border-border hover:bg-surface-subtle hover:border-border-strong text-foreground-secondary hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Result Display */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground-secondary block">Converted Result</span>
          <div className="w-full px-3 py-2 rounded-md bg-surface-subtle border border-border text-primary font-mono text-2xl font-semibold tabular-nums truncate min-h-[40px] flex items-center">
            {result.toFixed(4)}
          </div>
          <select
            aria-label="To Unit"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-surface-input border border-border text-foreground text-sm cursor-pointer focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus min-h-[40px]"
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>
    </ToolFrame>
  );
};
