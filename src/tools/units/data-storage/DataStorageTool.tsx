import React, { useState, useEffect } from 'react';
import { ConverterLayout } from '@/components/tool-ui/archetypes/ConverterLayout';
import { DATA_STORAGE_UNITS, convertDataStorage } from './data-storage';
import { parseUrlParams, updateUrlParams } from '@/lib/url-state';
import { track } from '@/lib/analytics';

export interface DataStorageToolProps {
  initialAmount?: number;
  initialFromId?: string;
  initialToId?: string;
}

export const DataStorageTool: React.FC<DataStorageToolProps> = ({
  initialAmount = 1,
  initialFromId = 'gigabyte',
  initialToId = 'megabyte',
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [fromId, setFromId] = useState<string>(initialFromId);
  const [toId, setToId] = useState<string>(initialToId);

  useEffect(() => {
    const params = parseUrlParams();
    if (params.value && !isNaN(Number(params.value))) {
      setAmount(Number(params.value));
    }
    if (params.from && DATA_STORAGE_UNITS.some((u) => u.id === params.from)) {
      setFromId(params.from);
    }
    if (params.to && DATA_STORAGE_UNITS.some((u) => u.id === params.to)) {
      setToId(params.to);
    }
    track('tool_open', { tool_key: 'units/data-storage', category: 'units' });
  }, []);

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
    updateUrlParams({ value: newAmount, from: fromId, to: toId });
  };

  const handleFromChange = (newFrom: string) => {
    setFromId(newFrom);
    updateUrlParams({ value: amount, from: newFrom, to: toId });
  };

  const handleToChange = (newTo: string) => {
    setToId(newTo);
    updateUrlParams({ value: amount, from: fromId, to: newTo });
  };

  const handleSwap = () => {
    const nextFrom = toId;
    const nextTo = fromId;
    setFromId(nextFrom);
    setToId(nextTo);
    updateUrlParams({ value: amount, from: nextFrom, to: nextTo });
  };

  const result = convertDataStorage(amount, fromId, toId);
  const fromUnit = DATA_STORAGE_UNITS.find((u) => u.id === fromId) || DATA_STORAGE_UNITS[4];
  const toUnit = DATA_STORAGE_UNITS.find((u) => u.id === toId) || DATA_STORAGE_UNITS[3];

  const formatValue = (num: number): string => {
    if (Number.isInteger(num)) return num.toLocaleString('en-US');
    return parseFloat(num.toPrecision(7)).toLocaleString('en-US', {
      maximumFractionDigits: 7,
    });
  };

  const formattedResult = `${formatValue(result)} ${toUnit.symbol}`;
  const factor = convertDataStorage(1, fromId, toId);
  const formula = `1 ${fromUnit.symbol} = ${formatValue(factor)} ${toUnit.symbol}`;
  const steps = `${amount} ${fromUnit.symbol} × ${formatValue(factor)} = ${formattedResult}`;

  const units = DATA_STORAGE_UNITS.map((u) => ({
    id: u.id,
    name: u.name,
    symbol: u.symbol,
  }));

  return (
    <ConverterLayout
      title="Data Storage Converter"
      amount={amount}
      onAmountChange={handleAmountChange}
      fromId={fromId}
      onFromChange={handleFromChange}
      toId={toId}
      onToChange={handleToChange}
      units={units}
      result={result}
      formattedResult={formattedResult}
      formula={formula}
      steps={steps}
      onSwap={handleSwap}
    />
  );
};
