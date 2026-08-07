import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { LENGTH_UNITS, convertUnit } from './convert-length';

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="space-y-2">
          <label htmlFor="length-val" className="text-xs font-semibold text-slate-300 block">From Value</label>
          <input
            id="length-val"
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-indigo-500"
          />
          <select
            aria-label="From Unit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center pt-2 md:pt-4">
          <button
            onClick={handleSwap}
            aria-label="Swap Units"
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 transition-colors shadow-sm"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">Converted Result</span>
          <div className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-base font-bold truncate">
            {result.toFixed(4)}
          </div>
          <select
            aria-label="To Unit"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
