import React from 'react';
import { Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  return (
    <button
      aria-label="Theme mode"
      disabled
      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 opacity-80 cursor-default"
      title="Dark Mode Default"
    >
      <Moon className="w-4 h-4" />
    </button>
  );
};
