import React, { useState, useEffect } from 'react';
import { fetchExchangeRates, convertCurrency, type CurrencyRateData } from '../../lib/currencyEngine';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CNY', 'BRL'];

export const MultiFieldFinanceCalc: React.FC = () => {
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
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-emerald-400">Live Foreign Exchange Converter</h3>
          {rateData && (
            <span className="text-[10px] text-slate-400 font-mono">
              Provider: {rateData.provider} {rateData.isFallback ? '(Offline Rates)' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading exchange rates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            {/* From Currency */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-semibold">Amount & Currency</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-lg focus:outline-none focus:border-emerald-500"
              />
              <select
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-transform active:scale-95 text-xs font-bold"
              >
                🔄 Swap
              </button>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-semibold">Converted Amount</label>
              <div className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-emerald-400 font-mono text-xl font-black truncate">
                {converted.toFixed(2)} {toCurr}
              </div>
              <select
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs font-semibold focus:outline-none"
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
