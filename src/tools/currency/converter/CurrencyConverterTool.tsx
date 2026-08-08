import React, { useState } from 'react';
import { CircleDollarSign } from 'lucide-react';
import { ConverterLayout } from '@/components/tool-ui/archetypes/ConverterLayout';
import { CURRENCIES, convertCurrency } from '@/tools/currency/converter/convert-currency';

export interface CurrencyConverterToolProps {
  config?: unknown;
  initialValue?: number | string;
  initialFrom?: string;
  initialTo?: string;
}

export const CurrencyConverterTool: React.FC<CurrencyConverterToolProps> = ({
  initialValue = 100,
  initialFrom = 'USD',
  initialTo = 'EUR',
}) => {
  const [amount, setAmount] = useState(Number(initialValue));
  const [fromCode, setFromCode] = useState(initialFrom);
  const [toCode, setToCode] = useState(initialTo);

  const result = convertCurrency(amount, fromCode, toCode);
  const singleUnitRate = convertCurrency(1, fromCode, toCode);
  const formattedResult = `${result.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${toCode}`;
  const units = CURRENCIES.map((currency) => ({
    id: currency.code,
    name: currency.name,
    symbol: currency.code,
  }));

  return (
    <ConverterLayout
      title="Currency converter"
      icon={<CircleDollarSign className="w-4 h-4 text-accent" aria-hidden="true" />}
      amount={amount}
      fromId={fromCode}
      toId={toCode}
      units={units}
      result={result}
      formattedResult={formattedResult}
      formula={`1 ${fromCode} = ${singleUnitRate.toFixed(4)} ${toCode}`}
      amountLabel="Amount"
      fromLabel="From currency"
      toLabel="To currency"
      onAmountChange={setAmount}
      onFromChange={setFromCode}
      onToChange={setToCode}
      onSwap={() => {
        setFromCode(toCode);
        setToCode(fromCode);
      }}
    />
  );
};
