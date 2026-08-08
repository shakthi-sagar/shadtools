import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { track } from '@/lib/analytics';
import { getNamespaceVisual } from '@/components/site/tool-visuals';

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

export const HeaderSearch: React.FC<HeaderSearchProps> = ({ tools = [] }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [shortcut, setShortcut] = useState('Ctrl K');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShortcut(/Mac/i.test(navigator.userAgent) ? 'Cmd K' : 'Ctrl K');
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const normalized = query.trim().toLowerCase();
  const results = [...tools]
    .filter((tool) => !normalized || `${tool.name} ${tool.summary} ${tool.namespace}`.toLowerCase().includes(normalized))
    .sort((a, b) => (b.searchWeight || 1) - (a.searchWeight || 1) || a.name.localeCompare(b.name))
    .slice(0, 8);

  useEffect(() => {
    setSelectedIndex(0);
    if (normalized) track('search_used', { query_length: normalized.length });
  }, [normalized]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((index) => (index + 1) % Math.max(results.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((index) => (index - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
    } else if (event.key === 'Enter' && results[selectedIndex]) {
      window.location.href = results[selectedIndex].url;
    } else if (event.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-[720px]">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
      <input
        ref={inputRef}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={onInputKeyDown}
        placeholder="Search tools"
        aria-label="Search tools"
        aria-expanded={open}
        className="h-10 w-full rounded-md border border-border bg-surface-input pl-10 pr-20 text-sm text-foreground shadow-none outline-none placeholder:text-foreground-muted focus:border-border-strong focus:ring-2 focus:ring-focus/20"
      />
      {query ? (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-foreground-muted hover:bg-surface-hover hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-surface-subtle px-1.5 py-0.5 text-[10px] text-foreground-muted">
          {shortcut}
        </kbd>
      )}

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-surface-raised shadow-popover">
          <div className="border-b border-border px-3 py-2 text-[10px] font-semibold uppercase text-foreground-muted">
            {normalized ? 'Search results' : 'Popular tools'}
          </div>
          {results.length ? (
            <div className="max-h-[420px] overflow-y-auto p-1.5">
              {results.map((tool, index) => {
                const visual = getNamespaceVisual(tool.namespace);
                const Icon = visual.icon;
                return (
                  <a
                    key={tool.id}
                    href={tool.url}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${index === selectedIndex ? 'bg-surface-hover' : 'hover:bg-surface-subtle'}`}
                  >
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${visual.soft} ${visual.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{tool.name}</span>
                      <span className="block truncate text-xs text-foreground-muted">{tool.summary}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground-muted" />
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-foreground-muted">No tools found for "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
};
