import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { calcPercentageOf, calcWhatPercentOf, calcPercentageChange } from './calculate-percentage';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';
import { Button } from '../../../components/ui/Button';

export const PercentageCalcTool: React.FC<{ config?: any }> = () => {
  const [mode, setMode] = useState<'of' | 'is' | 'change'>('of');
  const [valA, setValA] = useState<string>('20');
  const [valB, setValB] = useState<string>('500');
  const [copied, setCopied] = useState<boolean>(false);

  const numA = parseFloat(valA) || 0;
  const numB = parseFloat(valB) || 0;

  let result = 0;
  let formulaText = '';

  if (mode === 'of') {
    result = calcPercentageOf(numA, numB);
    formulaText = `${numA}% × ${numB} = ${result}`;
  } else if (mode === 'is') {
    result = calcWhatPercentOf(numA, numB);
    formulaText = `(${numA} ÷ ${numB}) × 100 = ${result.toFixed(2)}%`;
  } else {
    result = calcPercentageChange(numA, numB);
    formulaText = `((${numB} - ${numA}) ÷ ${numA}) × 100 = ${result.toFixed(2)}%`;
  }

  const formattedResult = Number.isInteger(result) ? String(result) : result.toFixed(2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolFrame className="p-5 sm:p-6 space-y-5">
      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-md bg-surface-subtle border border-border flex-wrap">
        <button
          type="button"
          onClick={() => setMode('of')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
            mode === 'of'
              ? 'bg-surface text-foreground font-semibold border border-border shadow-xs'
              : 'text-foreground-secondary hover:text-foreground'
          }`}
        >
          What is X% of Y?
        </button>
        <button
          type="button"
          onClick={() => setMode('is')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
            mode === 'is'
              ? 'bg-surface text-foreground font-semibold border border-border shadow-xs'
              : 'text-foreground-secondary hover:text-foreground'
          }`}
        >
          X is what % of Y?
        </button>
        <button
          type="button"
          onClick={() => setMode('change')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
            mode === 'change'
              ? 'bg-surface text-foreground font-semibold border border-border shadow-xs'
              : 'text-foreground-secondary hover:text-foreground'
          }`}
        >
          % Change (From X to Y)
        </button>
      </div>

      {/* Inputs & Result Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="space-y-1.5">
          <label htmlFor="pct-val-a" className="text-xs font-semibold text-foreground-secondary block">
            {mode === 'of' ? 'Percentage (X %)' : mode === 'is' ? 'Value X' : 'Initial Value (X)'}
          </label>
          <input
            id="pct-val-a"
            type="number"
            value={valA}
            onChange={(e) => setValA(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-surface-input border border-border text-foreground font-mono text-sm focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus h-10"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pct-val-b" className="text-xs font-semibold text-foreground-secondary block">
            {mode === 'of' ? 'Total Amount (Y)' : mode === 'is' ? 'Total Amount (Y)' : 'Final Value (Y)'}
          </label>
          <input
            id="pct-val-b"
            type="number"
            value={valB}
            onChange={(e) => setValB(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-surface-input border border-border text-foreground font-mono text-sm focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus h-10"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-secondary block">Calculated Result</span>
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
            {formattedResult} {mode !== 'of' && '%'}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-foreground-muted font-mono">
        <span>Formula: {formulaText}</span>
        <span className="text-success font-medium flex items-center gap-1">✓ Instant math</span>
      </div>
    </ToolFrame>
  );
};
