import React, { useState } from 'react';
import { LENGTH_UNITS, convertUnit } from '../../../lib/unitEngine';

export const LengthConverterTool: React.FC = () => {
  const [val, setVal] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  const numVal = parseFloat(val) || 0;
  const result = convertUnit(numVal, fromUnit, toUnit, LENGTH_UNITS);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center p-4 rounded-lg bg-slate-900 border border-slate-800">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-indigo-400 uppercase">From</label>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-white font-mono text-base"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs"
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button onClick={handleSwap} className="p-2.5 rounded bg-slate-800 text-indigo-400 hover:bg-slate-700 text-xs font-bold">
            🔄 Swap
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-indigo-400 uppercase">To (Result)</label>
          <div className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-base font-bold truncate">
            {result.toFixed(4)}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs"
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
