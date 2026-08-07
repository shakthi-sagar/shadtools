import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Globe, Loader2 } from 'lucide-react';
import { fetchExchangeRates, convertCurrency, type CurrencyRateData } from './convert-currency';

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
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Live Forex Market Rates</span>
          </span>
          {rateData && <span className="text-slate-500 font-mono text-[11px]">{rateData.provider}</span>}
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Fetching exchange rates...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div className="space-y-2">
              <label htmlFor="currency-amount" className="text-xs font-semibold text-slate-300 block">Amount & Currency</label>
              <input
                id="currency-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-indigo-500"
              />
              <select
                aria-label="From Currency"
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center pt-4 md:pt-0">
              <button
                onClick={handleSwap}
                aria-label="Swap Currencies"
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 transition-colors shadow-sm"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Converted Result</span>
              <div className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-lg font-bold truncate">
                {converted.toFixed(2)} {toCurr}
              </div>
              <select
                aria-label="To Currency"
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
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
