import React, { useState, useEffect } from 'react';
import { ConverterLayout } from '@/components/tool-ui/archetypes/ConverterLayout';
import { VOLUME_UNITS, convertVolume } from './volume';
import { parseUrlParams, updateUrlParams } from '@/lib/url-state';
import { track } from '@/lib/analytics';

export interface VolumeToolProps {
  initialAmount?: number;
  initialFromId?: string;
  initialToId?: string;
}

export const VolumeTool: React.FC<VolumeToolProps> = ({
  initialAmount = 1,
  initialFromId = 'liter',
  initialToId = 'gallon',
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [fromId, setFromId] = useState<string>(initialFromId);
  const [toId, setToId] = useState<string>(initialToId);

  useEffect(() => {
    const params = parseUrlParams();
    if (params.value && !isNaN(Number(params.value))) {
      setAmount(Number(params.value));
    }
    if (params.from && VOLUME_UNITS.some((u) => u.id === params.from)) {
      setFromId(params.from);
    }
    if (params.to && VOLUME_UNITS.some((u) => u.id === params.to)) {
      setToId(params.to);
    }
    track('tool_open', { tool_key: 'units/volume', category: 'units' });
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

  const result = convertVolume(amount, fromId, toId);
  const fromUnit = VOLUME_UNITS.find((u) => u.id === fromId) || VOLUME_UNITS[0];
  const toUnit = VOLUME_UNITS.find((u) => u.id === toId) || VOLUME_UNITS[2];

  const formatValue = (num: number): string => {
    if (Number.isInteger(num)) return num.toLocaleString('en-US');
    return parseFloat(num.toPrecision(7)).toLocaleString('en-US', {
      maximumFractionDigits: 7,
    });
  };

  const formattedResult = `${formatValue(result)} ${toUnit.symbol}`;
  const factor = convertVolume(1, fromId, toId);
  const formula = `1 ${fromUnit.symbol} = ${formatValue(factor)} ${toUnit.symbol}`;
  const steps = `${amount} ${fromUnit.symbol} × ${formatValue(factor)} = ${formattedResult}`;

  const units = VOLUME_UNITS.map((u) => ({
    id: u.id,
    name: u.name,
    symbol: u.symbol,
  }));

  return (
    <ConverterLayout
      title="Volume Converter"
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
