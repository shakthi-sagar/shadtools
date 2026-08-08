import React, { useEffect, useState } from 'react';
import { Scale } from 'lucide-react';
import { ConverterLayout } from '@/components/tool-ui/archetypes/ConverterLayout';
import { convertWeight, WEIGHT_UNITS } from '@/tools/units/weight/weight';
import { copyShareLink, parseUrlParams, updateUrlParams } from '@/lib/url-state';
import { track } from '@/lib/analytics';

export interface WeightToolProps {
  config?: unknown;
  initialValue?: number;
  initialFrom?: string;
  initialTo?: string;
}

const formatValue = (value: number): string => {
  if (Number.isInteger(value)) return value.toLocaleString('en-US');
  return Number(value.toPrecision(8)).toLocaleString('en-US', { maximumFractionDigits: 8 });
};

export const WeightTool: React.FC<WeightToolProps> = ({
  initialValue = 1,
  initialFrom = 'kg',
  initialTo = 'lb',
}) => {
  const [amount, setAmount] = useState(initialValue);
  const [fromUnit, setFromUnit] = useState(initialFrom);
  const [toUnit, setToUnit] = useState(initialTo);

  useEffect(() => {
    const params = parseUrlParams();
    if (params.value && !Number.isNaN(Number(params.value))) setAmount(Number(params.value));
    if (params.from && Object.hasOwn(WEIGHT_UNITS, params.from)) setFromUnit(params.from);
    if (params.to && Object.hasOwn(WEIGHT_UNITS, params.to)) setToUnit(params.to);
    track('tool_open', { tool_key: 'units/weight', category: 'units' });
  }, []);

  const updateStateUrl = (value: number, from: string, to: string) => {
    updateUrlParams({ value, from, to });
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    updateStateUrl(amount, toUnit, fromUnit);
  };

  const result = convertWeight(amount, fromUnit, toUnit);
  const factor = convertWeight(1, fromUnit, toUnit);
  const units = Object.entries(WEIGHT_UNITS).map(([id, unit]) => ({
    id,
    name: unit.name.replace(/\s+\([^)]*\)$/, ''),
    symbol: unit.symbol,
  }));
  const fromSymbol = WEIGHT_UNITS[fromUnit]?.symbol ?? fromUnit;
  const toSymbol = WEIGHT_UNITS[toUnit]?.symbol ?? toUnit;
  const formattedResult = `${formatValue(result)} ${toSymbol}`;

  return (
    <ConverterLayout
      title="Weight & mass converter"
      icon={<Scale className="w-4 h-4 text-accent" aria-hidden="true" />}
      amount={amount}
      fromId={fromUnit}
      toId={toUnit}
      units={units}
      result={result}
      formattedResult={formattedResult}
      formula={`1 ${fromSymbol} = ${formatValue(factor)} ${toSymbol}`}
      steps={`${formatValue(amount)} ${fromSymbol} = ${formattedResult}`}
      onAmountChange={(value) => {
        setAmount(value);
        updateStateUrl(value, fromUnit, toUnit);
      }}
      onFromChange={(value) => {
        setFromUnit(value);
        updateStateUrl(amount, value, toUnit);
      }}
      onToChange={(value) => {
        setToUnit(value);
        updateStateUrl(amount, fromUnit, value);
      }}
      onSwap={handleSwap}
      onCopy={() => track('tool_copy', { tool_key: 'units/weight', category: 'units' })}
      onCopyStateUrl={async () => {
        if (await copyShareLink()) {
          track('tool_share', { tool_key: 'units/weight', category: 'units' });
        }
      }}
    />
  );
};
