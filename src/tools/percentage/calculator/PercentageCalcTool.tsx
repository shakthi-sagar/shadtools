import React, { useState } from 'react';
import { calcPercentageOf } from './calculate-percentage';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';

export const PercentageCalcTool: React.FC<{ config?: any }> = () => {
  const [percent, setPercent] = useState<string>('20');
  const [total, setTotal] = useState<string>('500');

  const pNum = parseFloat(percent) || 0;
  const tNum = parseFloat(total) || 0;
  const result = calcPercentageOf(pNum, tNum);

  return (
    <ToolFrame className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Calculate X% of Y</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="space-y-1">
            <label htmlFor="pct-val" className="text-xs text-foreground-secondary block">Percentage (%)</label>
            <input
              id="pct-val"
              type="number"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-surface-input border border-border text-foreground font-mono text-sm focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus min-h-[40px]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="pct-total" className="text-xs text-foreground-secondary block">Of Total Number</label>
            <input
              id="pct-total"
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-surface-input border border-border text-foreground font-mono text-sm focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus min-h-[40px]"
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-foreground-secondary block">Calculated Result</span>
            <div className="w-full px-3 py-2 rounded-md bg-surface-subtle border border-border text-accent font-mono text-xl font-semibold tabular-nums min-h-[40px] flex items-center">
              {result.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </ToolFrame>
  );
};
