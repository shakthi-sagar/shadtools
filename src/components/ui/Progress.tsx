import React from 'react';

export interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
  const percentage = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden ${className}`}>
      <div
        className="h-full bg-indigo-500 transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
