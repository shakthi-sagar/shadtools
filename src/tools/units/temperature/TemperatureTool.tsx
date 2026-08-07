import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, Thermometer } from 'lucide-react';
import { convertTemperature } from '@/tools/units/temperature/temperature';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { Button } from '@/components/ui/Button';

export interface TemperatureToolProps {
  config?: any;
}

const TEMP_UNITS: Record<string, { label: string; symbol: string }> = {
  C: { label: 'Celsius (°C)', symbol: '°C' },
  F: { label: 'Fahrenheit (°F)', symbol: '°F' },
  K: { label: 'Kelvin (K)', symbol: 'K' },
};

export const TemperatureTool: React.FC<TemperatureToolProps> = () => {
  const [value, setValue] = useState<string>('0');
  const [fromUnit, setFromUnit] = useState<string>('C');
  const [toUnit, setToUnit] = useState<string>('F');
  const [copied, setCopied] = useState<boolean>(false);

  const numVal = parseFloat(value) || 0;
  const result = convertTemperature(numVal, fromUnit, toUnit);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    const text = `${result.toFixed(2)} ${TEMP_UNITS[toUnit]?.symbol}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolFrame className="shadow-xs border-border">
      {/* Top IDE Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border flex-wrap gap-2">
        <span className="text-xs font-bold text-foreground tracking-tight flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-accent" />
          Temperature Converter
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
        {/* Converter Controls Grid - Perfectly Aligned 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          {/* Temperature Value Input */}
          <div className="space-y-1.5">
            <label htmlFor="temp-val" className="text-xs font-bold text-foreground-secondary block">
              Temperature Value
            </label>
            <input
              id="temp-val"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md bg-surface-input border border-border text-foreground font-mono text-sm focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {/* From Unit Select */}
          <div className="space-y-1.5">
            <label htmlFor="temp-from" className="text-xs font-bold text-foreground-secondary block">
              From
            </label>
            <select
              id="temp-from"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-surface border border-border text-foreground text-xs font-medium focus:outline-none focus:border-border-strong cursor-pointer"
            >
              {Object.entries(TEMP_UNITS).map(([key, u]) => (
                <option key={key} value={key}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {/* To Unit Select */}
          <div className="space-y-1.5">
            <label htmlFor="temp-to" className="text-xs font-bold text-foreground-secondary block">
              To
            </label>
            <select
              id="temp-to"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-surface border border-border text-foreground text-xs font-medium focus:outline-none focus:border-border-strong cursor-pointer"
            >
              {Object.entries(TEMP_UNITS).map(([key, u]) => (
                <option key={key} value={key}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculated Result Display Card with Integrated Copy Action */}
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
            {result.toFixed(2)} <span className="text-base text-foreground font-sans font-normal">{TEMP_UNITS[toUnit]?.symbol}</span>
          </div>

          <div className="text-xs font-mono text-foreground-muted border-t border-border/50 pt-2 mt-2">
            Formula: {numVal} {TEMP_UNITS[fromUnit]?.symbol} = {result.toFixed(2)} {TEMP_UNITS[toUnit]?.symbol}
          </div>
        </div>
      </div>
    </ToolFrame>
  );
};
