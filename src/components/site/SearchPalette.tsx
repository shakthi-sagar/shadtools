import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchPaletteProps {
  tools?: Array<{ id: string; name: string; summary: string; url: string }>;
}

export const SearchPalette: React.FC<SearchPaletteProps> = ({ tools = [] }) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const filteredTools = query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.summary.toLowerCase().includes(query.toLowerCase())
      )
    : tools.slice(0, 5);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
    } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
      e.preventDefault();
      window.location.href = filteredTools[selectedIndex].url;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 text-foreground-muted absolute left-4 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search all tools, collections, or keywords..."
          aria-label="Search tools"
          className="w-full pl-11 pr-10 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-foreground-muted text-sm font-sans focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus shadow-popover transition-colors"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear query"
            className="absolute right-3.5 top-3.5 text-foreground-muted hover:text-foreground p-0.5 rounded focus-visible:outline-2 focus-visible:outline-focus"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {filteredTools.length > 0 && (
        <div className="rounded-lg bg-surface border border-border overflow-hidden shadow-popover divide-y divide-border">
          {filteredTools.map((tool, idx) => (
            <a
              key={tool.id}
              href={tool.url}
              className={`block p-3.5 transition-colors ${
                idx === selectedIndex ? 'bg-surface-subtle border-l-2 border-l-accent' : 'hover:bg-surface-subtle'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground">{tool.name}</span>
                <span className="text-xs text-accent font-medium">Open →</span>
              </div>
              <p className="text-xs text-foreground-secondary line-clamp-1 mt-0.5">{tool.summary}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
