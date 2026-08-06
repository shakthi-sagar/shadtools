import React, { useState } from 'react';
import { LENGTH_UNITS, convertUnit } from '../../lib/unitEngine';

export const TwoWayUnitConverter: React.FC = () => {
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
        {/* From Unit */}
        <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/10">
          <label className="text-xs font-bold uppercase text-indigo-400 block">From</label>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-lg focus:outline-none focus:border-indigo-500"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none"
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            title="Swap units"
            className="p-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/40 transition-transform active:scale-95"
          >
            🔄 Swap
          </button>
        </div>

        {/* To Unit */}
        <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/10">
          <label className="text-xs font-bold uppercase text-indigo-400 block">To (Result)</label>
          <div className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-indigo-400 font-mono text-lg font-bold truncate">
            {result.toFixed(4)}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none"
          >
            {LENGTH_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
