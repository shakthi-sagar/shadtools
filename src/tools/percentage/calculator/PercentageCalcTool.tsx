import React, { useState } from 'react';
import { Percent, TrendingUp, TrendingDown } from 'lucide-react';
import { calcPercentageOf, calcPercentageChange } from './calculate-percentage';

export const PercentageCalcTool: React.FC = () => {
  const [percentVal, setPercentVal] = useState<string>('15');
  const [totalVal, setTotalVal] = useState<string>('200');
  const [oldVal, setOldVal] = useState<string>('50');
  const [newVal, setNewVal] = useState<string>('75');

  const res1 = calcPercentageOf(parseFloat(percentVal), parseFloat(totalVal));
  const res2 = calcPercentageChange(parseFloat(oldVal), parseFloat(newVal));

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
          <Percent className="w-4 h-4" />
          <span>Calculate Percentage of a Number</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span>What is</span>
          <input
            type="number"
            aria-label="Percentage Value"
            value={percentVal}
            onChange={(e) => setPercentVal(e.target.value)}
            className="w-24 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center focus:outline-none focus:border-indigo-500"
          />
          <span>% of</span>
          <input
            type="number"
            aria-label="Total Value"
            value={totalVal}
            onChange={(e) => setTotalVal(e.target.value)}
            className="w-28 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center focus:outline-none focus:border-indigo-500"
          />
          <span>?</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-sm">
          <span className="text-slate-400 font-medium">Result:</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{res1.toFixed(2)}</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
          {res2 >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
          <span>Percentage Increase / Decrease</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span>From</span>
          <input
            type="number"
            aria-label="Old Value"
            value={oldVal}
            onChange={(e) => setOldVal(e.target.value)}
            className="w-28 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center focus:outline-none focus:border-indigo-500"
          />
          <span>to</span>
          <input
            type="number"
            aria-label="New Value"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            className="w-28 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-sm">
          <span className="text-slate-400 font-medium">Percentage Change:</span>
          <span className={`text-2xl font-bold font-mono ${res2 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {res2 >= 0 ? `+${res2.toFixed(2)}%` : `${res2.toFixed(2)}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
