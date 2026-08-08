import React from 'react';

interface CalculatorLayoutProps {
  inputs: React.ReactNode;
  result: React.ReactNode;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ inputs, result }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 items-start">
      <div className="space-y-4 p-4 sm:p-5 rounded-[10px] bg-surface border border-border">{inputs}</div>
      <div className="space-y-4 p-4 sm:p-5 rounded-[10px] bg-surface border border-border">{result}</div>
    </div>
  );
};
