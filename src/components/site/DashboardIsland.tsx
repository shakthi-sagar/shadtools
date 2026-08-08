import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Clock3,
  LayoutGrid,
  ListFilter,
  RotateCcw,
  Settings2,
  Star,
} from 'lucide-react';
import { getDashboardState, saveDashboardState } from '@/lib/dashboard-store';
import { ToolPickerModal } from '@/components/site/ToolPickerModal';
import { getNamespaceVisual } from '@/components/site/tool-visuals';
import { track } from '@/lib/analytics';

export interface ToolItem {
  id: string;
  name: string;
  namespace: string;
  slug: string;
  summary: string;
  featured?: boolean;
  dashboardOrder?: number;
  url: string;
}

export interface ToolCollection {
  slug: string;
  name: string;
  summary: string;
  toolCount: number;
}

interface DashboardIslandProps {
  allTools: ToolItem[];
  collections: ToolCollection[];
}

const preferredQuickAccess = [
  'json/formatter',
  'base64/encode',
  'images/compress',
  'units/length',
  'crypto/hash',
  'percentage/calculator',
];

const firstVisitRecents = ['text/word-counter', 'units/time', 'json/validator', 'crypto/uuid'];

function quickLabel(name: string) {
  return name
    .replace('JSON Formatter & Validator', 'JSON Formatter')
    .replace('Base64 Encoder & Decoder', 'Base64 Encoder')
    .replace('Length Unit Converter', 'Length Converter');
}

export const DashboardIsland: React.FC<DashboardIslandProps> = ({ allTools, collections }) => {
  const defaultIds = useMemo(() => {
    const preferred = preferredQuickAccess.filter((id) => allTools.some((tool) => tool.id === id));
    const fallback = allTools
      .filter((tool) => tool.featured && !preferred.includes(tool.id))
      .sort((a, b) => (a.dashboardOrder || 100) - (b.dashboardOrder || 100))
      .map((tool) => tool.id);
    return [...preferred, ...fallback].slice(0, 6);
  }, [allTools]);

  const [pinnedIds, setPinnedIds] = useState(defaultIds);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [customizing, setCustomizing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [browseMode, setBrowseMode] = useState<'category' | 'az'>('category');

  useEffect(() => {
    const state = getDashboardState();
    if (!state) return;
    const validPinned = state.pinnedToolIds.filter((id) => allTools.some((tool) => tool.id === id));
    const validRecent = state.recentToolIds.filter((id) => allTools.some((tool) => tool.id === id));
    setPinnedIds(validPinned.length ? validPinned.slice(0, 6) : defaultIds);
    setRecentIds(validRecent);
  }, [allTools, defaultIds]);

  const persist = (pins: string[], recents = recentIds) => {
    setPinnedIds(pins);
    setRecentIds(recents);
    saveDashboardState(pins, recents);
  };

  const togglePin = (toolId: string) => {
    const pinned = pinnedIds.includes(toolId);
    track(pinned ? 'dashboard_unpin' : 'dashboard_pin', { tool_key: toolId });
    if (pinned) persist(pinnedIds.filter((id) => id !== toolId));
    else if (pinnedIds.length < 6) persist([...pinnedIds, toolId]);
  };

  const quickTools = pinnedIds
    .map((id) => allTools.find((tool) => tool.id === id))
    .filter((tool): tool is ToolItem => Boolean(tool));

  const actualRecents = recentIds
    .map((id) => allTools.find((tool) => tool.id === id))
    .filter((tool): tool is ToolItem => Boolean(tool));
  const suggestedRecents = firstVisitRecents
    .map((id) => allTools.find((tool) => tool.id === id))
    .filter((tool): tool is ToolItem => Boolean(tool));
  const recentTools = (actualRecents.length ? actualRecents : suggestedRecents).slice(0, 4);

  const sortedTools = [...allTools].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-10">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.8fr)] xl:gap-5">
        <section id="quick-access" aria-labelledby="quick-access-heading" className="scroll-mt-24">
        <div className="mb-3 flex min-h-9 flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-warning" />
              <h2 id="quick-access-heading" className="text-sm font-semibold text-foreground">Quick access</h2>
              <span className="text-xs text-foreground-muted">{quickTools.length}/6</span>
            </div>
            <p className="mt-1 text-xs text-foreground-muted">Your everyday tools, stored on this device.</p>
          </div>
          <div className="flex items-center gap-2">
            {customizing && (
              <button
                type="button"
                onClick={() => persist(defaultIds, [])}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs text-foreground-muted hover:bg-surface-hover hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={() => setCustomizing((value) => !value)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium ${customizing ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-surface text-foreground-secondary hover:border-border-strong hover:text-foreground'}`}
            >
              {customizing ? <Check className="h-3.5 w-3.5" /> : <Settings2 className="h-3.5 w-3.5" />}
              {customizing ? 'Done' : 'Customize'}
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3">
            {quickTools.map((tool, index) => {
              const visual = getNamespaceVisual(tool.namespace);
              const Icon = visual.icon;
              return (
                <div
                  key={tool.id}
                  className={`group relative min-h-[112px] border-b border-border p-4 last:border-b-0 sm:min-h-[126px] sm:p-5 ${index % 3 !== 2 ? 'xl:border-r' : ''} ${index < 3 ? 'xl:border-b' : ''} ${index % 2 === 0 ? 'sm:border-r xl:border-r' : ''} ${index < 4 ? 'sm:border-b xl:border-b-0' : ''}`}
                >
                  <a href={tool.url} className="absolute inset-0" aria-label={`Open ${tool.name}`} />
                  <div className="relative flex items-start gap-3 pointer-events-none">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${visual.soft} ${visual.color}`}>
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-sm font-semibold text-foreground">{quickLabel(tool.name)}</h3>
                        <ArrowRight className="h-3.5 w-3.5 text-foreground-muted transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-foreground-muted">{tool.summary}</p>
                    </div>
                  </div>
                  {customizing && (
                    <button
                      type="button"
                      onClick={() => togglePin(tool.id)}
                      className="absolute bottom-3 right-3 z-10 rounded-md border border-border bg-surface-raised px-2 py-1 text-[11px] text-danger hover:border-danger/50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            {quickTools.length < 6 && (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="min-h-[126px] border-border p-5 text-left text-sm text-foreground-muted hover:bg-surface-subtle hover:text-foreground"
              >
                Add a tool to quick access
              </button>
            )}
          </div>
        </div>
        </section>

        <section id="recent-tools" aria-labelledby="recent-heading" className="scroll-mt-24">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-foreground-muted" />
              <h2 id="recent-heading" className="text-sm font-semibold text-foreground">
                {actualRecents.length ? 'Recent' : 'Start here'}
              </h2>
            </div>
            <p className="mt-1 text-xs text-foreground-muted">
              {actualRecents.length ? 'The tools you opened most recently.' : 'A few useful tools beyond your quick access.'}
            </p>
          </div>
        </div>
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {recentTools.map((tool) => {
            const visual = getNamespaceVisual(tool.namespace);
            const Icon = visual.icon;
            return (
              <a key={tool.id} href={tool.url} className="group flex min-h-14 items-center gap-3 px-4 py-2.5 hover:bg-surface-subtle">
                <Icon className={`h-4 w-4 shrink-0 ${visual.color}`} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{tool.name}</span>
                  <span className="block truncate text-xs text-foreground-muted">{tool.summary}</span>
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-foreground-muted group-hover:text-foreground" />
              </a>
            );
          })}
        </div>
        </section>
      </div>

      <section aria-labelledby="all-tools-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="all-tools-heading" className="text-sm font-semibold text-foreground">All tools</h2>
            <p className="mt-1 text-xs text-foreground-muted">Browse {allTools.length} utilities by category or name.</p>
          </div>
          <div className="flex rounded-md border border-border bg-surface p-0.5" aria-label="Tool browsing mode">
            <button
              type="button"
              onClick={() => setBrowseMode('category')}
              className={`inline-flex h-7 items-center gap-1.5 rounded px-2.5 text-xs ${browseMode === 'category' ? 'bg-surface-hover text-foreground' : 'text-foreground-muted'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Categories
            </button>
            <button
              type="button"
              onClick={() => setBrowseMode('az')}
              className={`inline-flex h-7 items-center gap-1.5 rounded px-2.5 text-xs ${browseMode === 'az' ? 'bg-surface-hover text-foreground' : 'text-foreground-muted'}`}
            >
              <ListFilter className="h-3.5 w-3.5" /> A-Z
            </button>
          </div>
        </div>

        {browseMode === 'category' ? (
          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {collections.map((collection) => {
              const visual = getNamespaceVisual(collection.slug);
              const Icon = visual.icon;
              const tools = sortedTools.filter((tool) => tool.namespace === collection.slug);
              return (
                <div key={collection.slug} className="grid gap-3 px-4 py-4 md:grid-cols-[220px_1fr] md:px-5">
                  <a href={`/${collection.slug}`} className="group flex items-start gap-3">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${visual.soft} ${visual.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-accent">
                        {collection.name}<ArrowRight className="h-3 w-3" />
                      </span>
                      <span className="mt-0.5 block text-xs text-foreground-muted">{collection.toolCount} tools</span>
                    </span>
                  </a>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:justify-end">
                    {tools.map((tool) => (
                      <a key={tool.id} href={tool.url} className="text-xs text-foreground-secondary hover:text-accent">{tool.name}</a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid overflow-hidden rounded-lg border border-border bg-surface sm:grid-cols-2 xl:grid-cols-3">
            {sortedTools.map((tool) => (
              <a key={tool.id} href={tool.url} className="flex min-h-12 items-center justify-between gap-3 border-b border-border px-4 text-sm text-foreground-secondary hover:bg-surface-subtle hover:text-foreground sm:border-r">
                <span className="truncate">{tool.name}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-foreground-muted" />
              </a>
            ))}
          </div>
        )}
      </section>

      <ToolPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        allTools={allTools}
        pinnedIds={pinnedIds}
        onTogglePin={togglePin}
        limit={6}
      />
    </div>
  );
};
