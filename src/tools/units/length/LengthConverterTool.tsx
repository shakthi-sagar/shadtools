import React, { useEffect, useState } from 'react';
import { Ruler } from 'lucide-react';
import { ConverterLayout } from '@/components/tool-ui/archetypes/ConverterLayout';
import { LENGTH_UNITS, convertUnit } from '@/tools/units/length/convert-length';
import { copyShareLink, parseUrlParams, updateUrlParams } from '@/lib/url-state';
import { track } from '@/lib/analytics';

interface LengthConverterProps {
  config?: unknown;
  initialValue?: number;
  initialFrom?: string;
  initialTo?: string;
}

const formatValue = (value: number): string => {
  if (Number.isInteger(value)) return value.toLocaleString('en-US');
  return Number(value.toPrecision(8)).toLocaleString('en-US', { maximumFractionDigits: 8 });
};

export const LengthConverterTool: React.FC<LengthConverterProps> = ({
  initialValue = 1,
  initialFrom = 'm',
  initialTo = 'ft',
}) => {
  const [amount, setAmount] = useState(initialValue);
  const [fromUnit, setFromUnit] = useState(initialFrom);
  const [toUnit, setToUnit] = useState(initialTo);

  useEffect(() => {
    const params = parseUrlParams();
    if (params.value && !Number.isNaN(Number(params.value))) setAmount(Number(params.value));
    if (params.from && LENGTH_UNITS.some((unit) => unit.id === params.from)) setFromUnit(params.from);
    if (params.to && LENGTH_UNITS.some((unit) => unit.id === params.to)) setToUnit(params.to);
    track('tool_open', { tool_key: 'units/length', category: 'units' });
  }, []);

  const updateStateUrl = (value: number, from: string, to: string) => {
    updateUrlParams({ value, from, to });
  };

  const handleAmountChange = (value: number) => {
    setAmount(value);
    updateStateUrl(value, fromUnit, toUnit);
  };

  const handleFromChange = (value: string) => {
    setFromUnit(value);
    updateStateUrl(amount, value, toUnit);
  };

  const handleToChange = (value: string) => {
    setToUnit(value);
    updateStateUrl(amount, fromUnit, value);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    updateStateUrl(amount, toUnit, fromUnit);
  };

  const result = convertUnit(amount, fromUnit, toUnit, LENGTH_UNITS);
  const factor = convertUnit(1, fromUnit, toUnit, LENGTH_UNITS);
  const formattedResult = `${formatValue(result)} ${toUnit}`;
  const formula = `1 ${fromUnit} = ${formatValue(factor)} ${toUnit}`;
  const steps = `${formatValue(amount)} ${fromUnit} = ${formattedResult}`;
  const units = LENGTH_UNITS.map((unit) => ({
    id: unit.id,
    name: unit.name.replace(/\s+\([^)]*\)$/, ''),
    symbol: unit.id,
  }));

  return (
    <ConverterLayout
      title="Length & distance converter"
      icon={<Ruler className="w-4 h-4 text-accent" aria-hidden="true" />}
      amount={amount}
      fromId={fromUnit}
      toId={toUnit}
      units={units}
      result={result}
      formattedResult={formattedResult}
      formula={formula}
      steps={steps}
      onAmountChange={handleAmountChange}
      onFromChange={handleFromChange}
      onToChange={handleToChange}
      onSwap={handleSwap}
      onCopy={() => track('tool_copy', { tool_key: 'units/length', category: 'units' })}
      onCopyStateUrl={async () => {
        if (await copyShareLink()) {
          track('tool_share', { tool_key: 'units/length', category: 'units' });
        }
      }}
    />
  );
};
