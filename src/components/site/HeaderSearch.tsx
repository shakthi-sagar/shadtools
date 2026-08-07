import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

export interface SearchToolItem {
  id: string;
  name: string;
  namespace: string;
  summary: string;
  url: string;
  searchWeight?: number;
}

export interface HeaderSearchProps {
  tools?: SearchToolItem[];
}

const DEFAULT_TOOLS: SearchToolItem[] = [
  {
    id: 'base64/encode',
    name: 'Base64 Encoder & Decoder',
    namespace: 'base64',
    summary: 'Encode plain text to Base64 or decode Base64 strings back to UTF-8 instantly.',
    url: '/base64/encode',
    searchWeight: 10,
  },
  {
    id: 'json/formatter',
    name: 'JSON Formatter & Minifier',
    namespace: 'json',
    summary: 'Format, validate, beautify, and minify JSON strings with custom indentation.',
    url: '/json/formatter',
    searchWeight: 9,
  },
  {
    id: 'units/length',
    name: 'Length Unit Converter',
    namespace: 'units',
    summary: 'Convert meters, feet, inches, yards, kilometers, and miles instantly.',
    url: '/units/length',
    searchWeight: 8,
  },
  {
    id: 'percentage/calculator',
    name: 'Percentage Calculator',
    namespace: 'percentage',
    summary: 'Calculate percentage of a number, percentage differences, and percentage change.',
    url: '/percentage/calculator',
    searchWeight: 8,
  },
  {
    id: 'images/compress',
    name: 'Image Compressor',
    namespace: 'images',
    summary: 'Compress PNG, JPG, and WebP images locally in browser memory.',
    url: '/images/compress',
    searchWeight: 7,
  },
  {
    id: 'currency/converter',
    name: 'Currency Converter',
    namespace: 'currency',
    summary: 'Convert global currencies with daily updated exchange rates.',
    url: '/currency/converter',
    searchWeight: 7,
  },
];

export const HeaderSearch: React.FC<HeaderSearchProps> = ({ tools = DEFAULT_TOOLS }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [shortcutText, setShortcutText] = useState<string>('⌘K');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect Mac vs Windows for shortcut display
  useEffect(() => {
    if (typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent)) {
      setShortcutText('⌘K');
    } else {
      setShortcutText('Ctrl K');
    }
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filtered = (query.trim()
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

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      window.location.href = filtered[selectedIndex].url;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm">
      {/* Search Input Bar (Mounted statically in Header) */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-foreground-muted absolute left-3 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Search tools..."
          aria-label="Search tools"
          className="w-full pl-9 pr-12 py-1.5 text-xs rounded-md bg-surface-input border border-border text-foreground placeholder:text-foreground-muted font-sans focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus transition-colors h-8"
        />
        
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear query"
            className="absolute right-2.5 text-foreground-muted hover:text-foreground p-0.5 rounded focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="absolute right-2 text-[10px] font-mono text-foreground-muted bg-surface-subtle border border-border px-1.5 py-0.5 rounded pointer-events-none select-none">
            {shortcutText}
          </kbd>
        )}
      </div>

      {/* Floating Dropdown Results Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-surface-raised border border-border shadow-popover rounded-md max-h-80 overflow-y-auto divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-3 text-center text-xs text-foreground-muted">
              No tools matching "{query}"
            </div>
          ) : (
            filtered.slice(0, 8).map((tool, idx) => (
              <a
                key={tool.id}
                href={tool.url}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between p-2.5 transition-colors group ${
                  idx === selectedIndex ? 'bg-surface-subtle border-l-2 border-l-accent' : 'hover:bg-surface-subtle'
                }`}
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground group-hover:text-accent truncate">
                      {tool.name}
                    </span>
                    <span className="text-[9px] text-accent uppercase font-mono px-1 py-0.2 rounded bg-accent-subtle shrink-0">
                      {tool.namespace}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground-muted truncate">{tool.summary}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-foreground-muted group-hover:text-accent shrink-0" />
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
};
