import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, Ruler } from 'lucide-react';
import { LENGTH_UNITS, convertUnit } from '@/tools/units/length/convert-length';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { Button } from '@/components/ui/Button';

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
    navigator.clipboard.writeText(`${formattedResult} ${toUnit}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fromUnitObj = LENGTH_UNITS.find((u) => u.id === fromUnit);
  const toUnitObj = LENGTH_UNITS.find((u) => u.id === toUnit);

  return (
    <ToolFrame className="shadow-xs border-border">
      {/* Top IDE Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border flex-wrap gap-2">
        <span className="text-xs font-bold text-foreground tracking-tight flex items-center gap-2">
          <Ruler className="w-4 h-4 text-accent" />
          Length & Distance Converter
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleSwap}
          leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}
          className="h-8 text-xs font-medium"
        >
          Swap Units
        </Button>
      </div>

      <div className="p-5 sm:p-6 bg-surface space-y-6">
        {/* Converter Controls Grid - Clean 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          {/* From Value Input */}
          <div className="space-y-1.5">
            <label htmlFor="length-val" className="text-xs font-bold text-foreground-secondary block">
              Distance Value
            </label>
            <input
              id="length-val"
              type="number"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Enter value..."
              className="w-full h-10 px-3.5 rounded-md bg-surface-input border border-border text-foreground font-mono text-sm focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {/* From Unit Select */}
          <div className="space-y-1.5">
            <label htmlFor="length-from" className="text-xs font-bold text-foreground-secondary block">
              From
            </label>
            <select
              id="length-from"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-surface border border-border text-foreground text-xs font-medium focus:outline-none focus:border-border-strong cursor-pointer"
            >
              {LENGTH_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* To Unit Select */}
          <div className="space-y-1.5">
            <label htmlFor="length-to" className="text-xs font-bold text-foreground-secondary block">
              To
            </label>
            <select
              id="length-to"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-surface border border-border text-foreground text-xs font-medium focus:outline-none focus:border-border-strong cursor-pointer"
            >
              {LENGTH_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
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
            {formattedResult} <span className="text-base text-foreground font-sans font-normal">{toUnitObj?.id}</span>
          </div>

          <div className="text-xs font-mono text-foreground-muted border-t border-border/50 pt-2 mt-2">
            Formula: 1 {fromUnitObj?.id} = {convertUnit(1, fromUnit, toUnit, LENGTH_UNITS).toFixed(4)} {toUnitObj?.id}
          </div>
        </div>
      </div>
    </ToolFrame>
  );
};
