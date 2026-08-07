import React from 'react';

interface CalculatorLayoutProps {
  inputs: React.ReactNode;
  result: React.ReactNode;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ inputs, result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-4 p-5 rounded-lg bg-surface border border-border">{inputs}</div>
      <div className="space-y-4 p-5 rounded-lg bg-surface border border-border">{result}</div>
    </div>
  );
};
