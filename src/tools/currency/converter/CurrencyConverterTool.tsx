import React, { useState, useEffect } from 'react';
import { fetchExchangeRates, convertCurrency, type CurrencyRateData } from '../../../lib/currencyEngine';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CNY', 'BRL'];

export const CurrencyConverterTool: React.FC = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('INR');
  const [rateData, setRateData] = useState<CurrencyRateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchExchangeRates().then((data) => {
      setRateData(data);
      setLoading(false);
    });
  }, []);

  const numAmount = parseFloat(amount) || 0;
  const converted = rateData ? convertCurrency(numAmount, fromCurr, toCurr, rateData.rates) : 0;

  const handleSwap = () => {
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-400">Live Forex Rates</span>
          {rateData && <span className="text-slate-400 font-mono text-[10px]">Provider: {rateData.provider}</span>}
        </div>

        {loading ? (
          <div className="py-4 text-center text-xs text-slate-400">Loading rates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Amount & Currency</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-white font-mono text-base"
              />
              <select
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button onClick={handleSwap} className="p-2.5 rounded bg-slate-800 text-emerald-400 hover:bg-slate-700 text-xs font-bold">
                🔄 Swap
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Converted Amount</label>
              <div className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-lg font-bold truncate">
                {converted.toFixed(2)} {toCurr}
              </div>
              <select
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
