import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { track } from '@/lib/analytics';

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
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shortcutText, setShortcutText] = useState('Ctrl K');
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => {
    setIsOpen(false);
    setQuery('');
  };

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent)) {
      setShortcutText('Cmd K');
    }
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
      }
      if (event.key === 'Escape') closeSearch();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const normalizedQuery = query.trim().toLowerCase();
  const getSearchScore = (tool: SearchToolItem) => {
    const name = tool.name.toLowerCase();
    const namespace = tool.namespace.toLowerCase();
    let score = tool.searchWeight || 1;
    if (name === normalizedQuery) score += 100;
    else if (name.startsWith(normalizedQuery)) score += 60;
    else if (name.includes(normalizedQuery)) score += 40;
    if (namespace === normalizedQuery) score += 30;
    else if (namespace.includes(normalizedQuery)) score += 15;
    if (tool.summary.toLowerCase().includes(normalizedQuery)) score += 5;
    return score;
  };

  const filtered = (normalizedQuery
    ? tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(normalizedQuery) ||
          tool.summary.toLowerCase().includes(normalizedQuery) ||
          tool.namespace.toLowerCase().includes(normalizedQuery)
      )
    : [...tools]
  )
    .sort((a, b) => normalizedQuery ? getSearchScore(b) - getSearchScore(a) : (b.searchWeight || 1) - (a.searchWeight || 1))
    .slice(0, 8);

  useEffect(() => {
    setSelectedIndex(0);
    if (query.trim()) track('search_used', { query_length: query.trim().length });
  }, [query]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((current) => (current < filtered.length - 1 ? current + 1 : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((current) => (current > 0 ? current - 1 : filtered.length - 1));
    } else if (event.key === 'Enter' && filtered[selectedIndex]) {
      event.preventDefault();
      window.location.href = filtered[selectedIndex].url;
    }
  };

  return (
    <>
      <div className="w-auto sm:w-full sm:max-w-sm">
        <button
          id="cmd-k-trigger"
          type="button"
          onClick={openSearch}
          aria-label="Search tools"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground-secondary transition-colors hover:border-border-strong hover:bg-surface-subtle hover:text-foreground sm:w-full sm:justify-between sm:px-3"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Search className="h-4 w-4 shrink-0" />
            <span className="hidden truncate text-xs text-foreground-muted sm:inline">Search tools</span>
          </span>
          <kbd className="hidden rounded border border-border bg-surface-subtle px-1.5 py-0.5 font-mono text-[10px] text-foreground-muted sm:inline">
            {shortcutText}
          </kbd>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[72px] sm:pt-24" role="dialog" aria-modal="true" aria-label="Search tools">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/65 backdrop-blur-sm"
            onClick={closeSearch}
            aria-label="Close search"
          />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-lg border border-border bg-surface-raised shadow-dialog">
            <div className="relative border-b border-border">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search tools and converters..."
                aria-label="Search tools and converters"
                className="h-14 w-full bg-transparent pl-12 pr-12 text-sm text-foreground outline-none placeholder:text-foreground-muted"
              />
              <button
                type="button"
                onClick={query ? () => setQuery('') : closeSearch}
                aria-label={query ? 'Clear search' : 'Close search'}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-foreground-muted hover:bg-surface-subtle hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-foreground-muted">
                  No tools found for "{query}"
                </div>
              ) : (
                filtered.map((tool, index) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    className={`group flex items-center justify-between gap-4 rounded-md px-3 py-3 transition-colors ${
                      index === selectedIndex ? 'bg-accent-subtle' : 'hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">{tool.name}</span>
                        <span className="shrink-0 text-[10px] font-semibold uppercase text-accent">{tool.namespace}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-foreground-muted">{tool.summary}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                  </a>
                ))
              )}
            </div>

            <div className="hidden items-center justify-between border-t border-border bg-surface-subtle px-4 py-2 text-[10px] text-foreground-muted sm:flex">
              <span>Use arrow keys to navigate</span>
              <span>Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
