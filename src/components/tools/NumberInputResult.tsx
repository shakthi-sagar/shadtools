import React, { useState } from 'react';
import { calcPercentageOf, calcPercentageChange } from '../../lib/percentageEngine';
import { intToRoman, romanToInt } from '../../lib/romanEngine';

export interface NumberInputResultProps {
  toolType: 'percentage' | 'roman';
}

export const NumberInputResult: React.FC<NumberInputResultProps> = ({ toolType }) => {
  // Percentage State
  const [percentVal, setPercentVal] = useState<string>('15');
  const [totalVal, setTotalVal] = useState<string>('200');
  const [oldVal, setOldVal] = useState<string>('50');
  const [newVal, setNewVal] = useState<string>('75');

  // Roman State
  const [arabicInput, setArabicInput] = useState<string>('2026');
  const [romanInput, setRomanInput] = useState<string>('MMXXVI');

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (toolType === 'roman') {
    const romanResult = intToRoman(parseInt(arabicInput, 10));
    const arabicResult = romanToInt(romanInput);

    return (
      <div className="space-y-8">
        {/* Number to Roman */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Integer to Roman Numeral</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Enter Number (1 - 3999)</label>
              <input
                type="number"
                min="1"
                max="3999"
                value={arabicInput}
                onChange={(e) => setArabicInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block">Roman Result</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white font-mono">{romanResult}</span>
                <button
                  onClick={() => handleCopy(romanResult)}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300"
                >
                  {copied ? '✅ Copied' : 'Copy 📋'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Roman to Number */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Roman Numeral to Integer</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Enter Roman Numeral (e.g. MMXXVI)</label>
              <input
                type="text"
                value={romanInput}
                onChange={(e) => setRomanInput(e.target.value.toUpperCase())}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-sm focus:border-purple-500 focus:outline-none uppercase"
              />
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block">Integer Result</span>
              <span className="text-2xl font-black text-white font-mono">{String(arabicResult)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Percentage Calculations
  const res1 = calcPercentageOf(parseFloat(percentVal), parseFloat(totalVal));
  const res3 = calcPercentageChange(parseFloat(oldVal), parseFloat(newVal));

  return (
    <div className="space-y-6">
      {/* Calculator 1: What is X% of Y? */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-emerald-400">1. Calculate Percentage of a Number</h3>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span>What is</span>
          <input
            type="number"
            value={percentVal}
            onChange={(e) => setPercentVal(e.target.value)}
            className="w-24 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-center focus:border-emerald-500 focus:outline-none"
          />
          <span>% of</span>
          <input
            type="number"
            value={totalVal}
            onChange={(e) => setTotalVal(e.target.value)}
            className="w-28 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-center focus:border-emerald-500 focus:outline-none"
          />
          <span>?</span>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <span className="text-xs text-slate-400 uppercase font-bold">Result:</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{res1.toFixed(2)}</span>
        </div>
      </div>

      {/* Calculator 2: Percentage Increase / Decrease */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-emerald-400">2. Percentage Increase / Decrease</h3>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span>From</span>
          <input
            type="number"
            value={oldVal}
            onChange={(e) => setOldVal(e.target.value)}
            className="w-28 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-center focus:border-emerald-500 focus:outline-none"
          />
          <span>to</span>
          <input
            type="number"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            className="w-28 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-center focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <span className="text-xs text-slate-400 uppercase font-bold">Percentage Change:</span>
          <span className={`text-2xl font-black font-mono ${res3 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {res3 >= 0 ? `+${res3.toFixed(2)}%` : `${res3.toFixed(2)}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
