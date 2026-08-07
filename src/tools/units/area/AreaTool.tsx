import React, { useState, useEffect } from 'react';
import { ConverterLayout } from '@/components/tool-ui/archetypes/ConverterLayout';
import { AREA_UNITS, convertArea } from './area';

export interface AreaToolProps {
  initialValue?: number;
  initialFrom?: string;
  initialTo?: string;
}

export const AreaTool: React.FC<AreaToolProps> = ({
  initialValue = 1,
  initialFrom = 'sqm',
  initialTo = 'sqft',
}) => {
  const [amount, setAmount] = useState<number>(initialValue);
  const [fromId, setFromId] = useState<string>(initialFrom);
  const [toId, setToId] = useState<string>(initialTo);

  // Sync state with URL parameters (Shareable Tool State)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlVal = params.get('value');
    const urlFrom = params.get('from');
    const urlTo = params.get('to');

    if (urlVal && !isNaN(parseFloat(urlVal))) setAmount(parseFloat(urlVal));
    if (urlFrom && AREA_UNITS.some((u) => u.id === urlFrom)) setFromId(urlFrom);
    if (urlTo && AREA_UNITS.some((u) => u.id === urlTo)) setToId(urlTo);
  }, []);

  const updateUrlState = (val: number, from: string, to: string) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.set('value', val.toString());
    params.set('from', from);
    params.set('to', to);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleAmountChange = (val: number) => {
    setAmount(val);
    updateUrlState(val, fromId, toId);
  };

  const handleFromChange = (from: string) => {
    setFromId(from);
    updateUrlState(amount, from, toId);
  };

  const handleToChange = (to: string) => {
    setToId(to);
    updateUrlState(amount, fromId, to);
  };

  const handleSwap = () => {
    const prevFrom = fromId;
    const prevTo = toId;
    setFromId(prevTo);
    setToId(prevFrom);
    updateUrlState(amount, prevTo, prevFrom);
  };

  const result = convertArea(amount, fromId, toId);

  const formatNumber = (n: number) => {
    if (Number.isInteger(n)) return n.toLocaleString('en-US');
    return parseFloat(n.toPrecision(6)).toLocaleString('en-US', { maximumFractionDigits: 6 });
  };

  const fromUnit = AREA_UNITS.find((u) => u.id === fromId) || AREA_UNITS[0];
  const toUnit = AREA_UNITS.find((u) => u.id === toId) || AREA_UNITS[1];

  const formattedResult = `${formatNumber(amount)} ${fromUnit.symbol} = ${formatNumber(result)} ${toUnit.symbol}`;
  const factor = convertArea(1, fromId, toId);
  const formula = `1 ${fromUnit.name} = ${formatNumber(factor)} ${toUnit.name}`;
  const steps = `${formatNumber(amount)} × ${formatNumber(factor)} = ${formatNumber(result)}`;

  return (
    <ConverterLayout
      amount={amount}
      fromId={fromId}
      toId={toId}
      units={AREA_UNITS}
      result={result}
      formattedResult={formattedResult}
      formula={formula}
      steps={steps}
      onAmountChange={handleAmountChange}
      onFromChange={handleFromChange}
      onToChange={handleToChange}
      onSwap={handleSwap}
      onCopyStateUrl={() => navigator.clipboard.writeText(window.location.href)}
    />
  );
};
