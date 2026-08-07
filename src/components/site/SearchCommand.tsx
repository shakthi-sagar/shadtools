import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Dialog } from '../ui/Dialog';

export interface CommandToolItem {
  id: string;
  name: string;
  namespace: string;
  summary: string;
  url: string;
  searchWeight?: number;
}

export interface SearchCommandProps {
  tools?: CommandToolItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

export const SearchCommand: React.FC<SearchCommandProps> = ({
  tools = [],
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}) => {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalOpen;

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalOpen(false);
    }
    setQuery('');
    setSelectedIndex(0);
  };

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          setInternalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredTools = (query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.summary.toLowerCase().includes(query.toLowerCase()) ||
          t.namespace.toLowerCase().includes(query.toLowerCase())
      )
    : tools
  ).sort((a, b) => (b.searchWeight || 1) - (a.searchWeight || 1));

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
    <Dialog isOpen={isOpen} onClose={handleClose} title="Search Tools & Calculators">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type tool name, category, or keyword..."
            aria-label="Search tools"
            className="w-full pl-10 pr-10 py-2.5 rounded-md bg-surface-input border border-border text-foreground placeholder:text-foreground-muted text-sm font-sans focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus transition-colors"
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

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto rounded-md border border-border divide-y divide-border">
          {filteredTools.length === 0 ? (
            <div className="p-4 text-center text-xs text-foreground-muted">
              No tools matching "{query}"
            </div>
          ) : (
            filteredTools.slice(0, 10).map((tool, idx) => (
              <a
                key={tool.id}
                href={tool.url}
                className={`flex items-center justify-between p-3 transition-colors ${
                  idx === selectedIndex ? 'bg-surface-subtle border-l-2 border-l-accent' : 'hover:bg-surface-subtle'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{tool.name}</span>
                    <span className="text-[10px] text-accent uppercase font-mono px-1.5 py-0.2 rounded bg-accent-subtle">
                      {tool.namespace}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-secondary line-clamp-1 mt-0.5">{tool.summary}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-foreground-muted shrink-0 ml-2" />
              </a>
            ))
          )}
        </div>
      </div>
    </Dialog>
  );
};
