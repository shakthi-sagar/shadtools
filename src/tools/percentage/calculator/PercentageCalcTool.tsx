import React, { useState } from 'react';
import { calcPercentageOf, calcPercentageChange } from '../../../lib/percentageEngine';

export const PercentageCalcTool: React.FC = () => {
  const [percentVal, setPercentVal] = useState<string>('15');
  const [totalVal, setTotalVal] = useState<string>('200');
  const [oldVal, setOldVal] = useState<string>('50');
  const [newVal, setNewVal] = useState<string>('75');

  const res1 = calcPercentageOf(parseFloat(percentVal), parseFloat(totalVal));
  const res2 = calcPercentageChange(parseFloat(oldVal), parseFloat(newVal));

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold text-emerald-400">1. Calculate Percentage of a Number</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span>What is</span>
          <input
            type="number"
            value={percentVal}
            onChange={(e) => setPercentVal(e.target.value)}
            className="w-20 p-2 rounded bg-slate-950 border border-slate-800 text-white font-mono text-center"
          />
          <span>% of</span>
          <input
            type="number"
            value={totalVal}
            onChange={(e) => setTotalVal(e.target.value)}
            className="w-24 p-2 rounded bg-slate-950 border border-slate-800 text-white font-mono text-center"
          />
          <span>?</span>
        </div>
        <div className="p-3 rounded bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">Result:</span>
          <span className="text-xl font-bold font-mono text-emerald-400">{res1.toFixed(2)}</span>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold text-emerald-400">2. Percentage Increase / Decrease</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span>From</span>
          <input
            type="number"
            value={oldVal}
            onChange={(e) => setOldVal(e.target.value)}
            className="w-24 p-2 rounded bg-slate-950 border border-slate-800 text-white font-mono text-center"
          />
          <span>to</span>
          <input
            type="number"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            className="w-24 p-2 rounded bg-slate-950 border border-slate-800 text-white font-mono text-center"
          />
        </div>
        <div className="p-3 rounded bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">Percentage Change:</span>
          <span className={`text-xl font-bold font-mono ${res2 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {res2 >= 0 ? `+${res2.toFixed(2)}%` : `${res2.toFixed(2)}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
