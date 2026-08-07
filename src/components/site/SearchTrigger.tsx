import React from 'react';
import { Search } from 'lucide-react';

export const SearchTrigger: React.FC = () => {
  return (
    <a
      href="/search"
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
    >
      <Search className="w-3.5 h-3.5 text-slate-400" />
      <span>Search</span>
      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 rounded text-slate-400 border border-slate-800">Ctrl+K</kbd>
    </a>
  );
};
