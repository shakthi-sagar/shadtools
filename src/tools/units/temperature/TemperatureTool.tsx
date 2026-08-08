import React, { useEffect, useState } from 'react';
import { Thermometer } from 'lucide-react';
import { ConverterLayout } from '@/components/tool-ui/archetypes/ConverterLayout';
import { convertTemperature } from '@/tools/units/temperature/temperature';
import { parseUrlParams, updateUrlParams } from '@/lib/url-state';
import { track } from '@/lib/analytics';

export interface TemperatureToolProps {
  config?: unknown;
  initialValue?: number;
  initialFrom?: string;
  initialTo?: string;
}

const TEMPERATURE_UNITS = [
  { id: 'C', name: 'Celsius', symbol: '°C' },
  { id: 'F', name: 'Fahrenheit', symbol: '°F' },
  { id: 'K', name: 'Kelvin', symbol: 'K' },
];

const formatValue = (value: number): string => {
  if (Number.isInteger(value)) return value.toLocaleString('en-US');
  return Number(value.toPrecision(8)).toLocaleString('en-US', { maximumFractionDigits: 8 });
};

export const TemperatureTool: React.FC<TemperatureToolProps> = ({
  initialValue = 0,
  initialFrom = 'C',
  initialTo = 'F',
}) => {
  const [amount, setAmount] = useState(initialValue);
  const [fromUnit, setFromUnit] = useState(initialFrom);
  const [toUnit, setToUnit] = useState(initialTo);

  useEffect(() => {
    const params = parseUrlParams();
    if (params.value && !Number.isNaN(Number(params.value))) setAmount(Number(params.value));
    if (params.from && TEMPERATURE_UNITS.some((unit) => unit.id === params.from)) setFromUnit(params.from);
    if (params.to && TEMPERATURE_UNITS.some((unit) => unit.id === params.to)) setToUnit(params.to);
    track('tool_open', { tool_key: 'units/temperature', category: 'units' });
  }, []);

  const updateStateUrl = (value: number, from: string, to: string) => {
    updateUrlParams({ value, from, to });
  };

  const result = convertTemperature(amount, fromUnit, toUnit);
  const fromSymbol = TEMPERATURE_UNITS.find((unit) => unit.id === fromUnit)?.symbol ?? fromUnit;
  const toSymbol = TEMPERATURE_UNITS.find((unit) => unit.id === toUnit)?.symbol ?? toUnit;
  const formattedResult = `${formatValue(result)} ${toSymbol}`;

  return (
    <ConverterLayout
      title="Temperature converter"
      icon={<Thermometer className="w-4 h-4 text-accent" aria-hidden="true" />}
      amount={amount}
      fromId={fromUnit}
      toId={toUnit}
      units={TEMPERATURE_UNITS}
      result={result}
      formattedResult={formattedResult}
      formula={`${formatValue(amount)} ${fromSymbol} = ${formattedResult}`}
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
      onSwap={() => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
        updateStateUrl(amount, toUnit, fromUnit);
      }}
      onCopy={() => track('tool_copy', { tool_key: 'units/temperature', category: 'units' })}
    />
  );
};
