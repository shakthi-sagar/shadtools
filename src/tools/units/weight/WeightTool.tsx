import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, Scale } from 'lucide-react';
import { convertWeight, WEIGHT_UNITS } from './weight';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { Button } from '@/components/ui/Button';

export interface WeightToolProps {
  config?: any;
}

export const WeightTool: React.FC<WeightToolProps> = () => {
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('kg');
  const [toUnit, setToUnit] = useState<string>('lb');
  const [copied, setCopied] = useState<boolean>(false);

  const numVal = parseFloat(value) || 0;
  const result = convertWeight(numVal, fromUnit, toUnit);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    const text = `${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolFrame className="shadow-xs border-border">
      {/* Top IDE Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border flex-wrap gap-2">
        <span className="text-xs font-bold text-foreground tracking-tight flex items-center gap-2">
          <Scale className="w-4 h-4 text-accent" />
          Weight & Mass Unit Converter
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
          {/* Weight Value Input */}
          <div className="space-y-1.5">
            <label htmlFor="weight-val" className="text-xs font-bold text-foreground-secondary block">
              Weight Amount
            </label>
            <input
              id="weight-val"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md bg-surface-input border border-border text-foreground font-mono text-sm focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {/* From Unit Select */}
          <div className="space-y-1.5">
            <label htmlFor="weight-from" className="text-xs font-bold text-foreground-secondary block">
              From
            </label>
            <select
              id="weight-from"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-surface border border-border text-foreground text-xs font-medium focus:outline-none focus:border-border-strong cursor-pointer"
            >
              {Object.entries(WEIGHT_UNITS).map(([key, u]) => (
                <option key={key} value={key}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* To Unit Select */}
          <div className="space-y-1.5">
            <label htmlFor="weight-to" className="text-xs font-bold text-foreground-secondary block">
              To
            </label>
            <select
              id="weight-to"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-surface border border-border text-foreground text-xs font-medium focus:outline-none focus:border-border-strong cursor-pointer"
            >
              {Object.entries(WEIGHT_UNITS).map(([key, u]) => (
                <option key={key} value={key}>
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
            {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} <span className="text-base text-foreground font-sans font-normal">{WEIGHT_UNITS[toUnit]?.name}</span>
          </div>
        </div>
      </div>
    </ToolFrame>
  );
};
