import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export const SearchPalette: React.FC = () => {
  const [query, setQuery] = useState<string>('');

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all tools, collections, or keywords..."
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 shadow-xl"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
