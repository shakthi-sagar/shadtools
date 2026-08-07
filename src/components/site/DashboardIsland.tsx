import React, { useState, useEffect } from 'react';
import { Pin, PinOff, RotateCcw, ArrowUp, ArrowDown, Clock, Star } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ToolItem {
  id: string;
  name: string;
  namespace: string;
  slug: string;
  summary: string;
  featured?: boolean;
  icon?: string;
  url: string;
}

export interface DashboardIslandProps {
  allTools: ToolItem[];
}

interface DashboardPreferencesV1 {
  version: 1;
  pinnedToolIds: string[];
  recentToolIds: string[];
}

const DASHBOARD_STORAGE_KEY = 'shadtools.dashboard.v1';

export const DashboardIsland: React.FC<DashboardIslandProps> = ({ allTools = [] }) => {
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Default featured tool IDs for fallback
  const featuredTools = allTools.filter((t) => t.featured);
  const defaultPinnedIds = (featuredTools.length > 0 ? featuredTools : allTools.slice(0, 4)).map((t) => t.id);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      if (stored) {
        const parsed: DashboardPreferencesV1 = JSON.parse(stored);
        if (parsed && parsed.version === 1 && Array.isArray(parsed.pinnedToolIds)) {
          const validPinned = parsed.pinnedToolIds.filter((id) => allTools.some((t) => t.id === id));
          const validRecent = Array.isArray(parsed.recentToolIds)
            ? parsed.recentToolIds.filter((id) => allTools.some((t) => t.id === id))
            : [];
          setPinnedIds(validPinned.length > 0 ? validPinned : defaultPinnedIds);
          setRecentIds(validRecent);
          setIsLoaded(true);
          return;
        }
      }
    } catch {
      // Corrupt data or SSR environment
    }
    setPinnedIds(defaultPinnedIds);
    setRecentIds([]);
    setIsLoaded(true);
  }, [allTools]);

  const savePreferences = (pins: string[], recents: string[]) => {
    setPinnedIds(pins);
    setRecentIds(recents);
    try {
      const prefs: DashboardPreferencesV1 = {
        version: 1,
        pinnedToolIds: pins,
        recentToolIds: recents,
      };
      localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // localStorage quota or disabled
    }
  };

  const togglePin = (toolId: string) => {
    const isPinned = pinnedIds.includes(toolId);
    const newPins = isPinned
      ? pinnedIds.filter((id) => id !== toolId)
      : [...pinnedIds, toolId];
    savePreferences(newPins, recentIds);
  };

  const movePinned = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pinnedIds.length) return;
    const newPins = [...pinnedIds];
    const temp = newPins[index];
    newPins[index] = newPins[targetIndex];
    newPins[targetIndex] = temp;
    savePreferences(newPins, recentIds);
  };

  const resetDefaults = () => {
    savePreferences(defaultPinnedIds, []);
  };

  const pinnedToolItems = pinnedIds
    .map((id) => allTools.find((t) => t.id === id))
    .filter((t): t is ToolItem => Boolean(t));

  const recentToolItems = recentIds
    .map((id) => allTools.find((t) => t.id === id))
    .filter((t): t is ToolItem => {
      if (!t) return false;
      return !pinnedIds.includes(t.id);
    });

  if (!isLoaded) {
    return (
      <div className="p-6 rounded-lg bg-surface border border-border space-y-4">
        <div className="h-6 w-36 bg-surface-subtle animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 bg-surface-subtle animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-accent" />
          <h2 className="text-lg font-bold text-foreground tracking-tight">Your Toolbox</h2>
          <span className="text-xs text-foreground-muted bg-surface-subtle px-2 py-0.5 rounded border border-border">
            Local-First
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetDefaults}
          title="Reset to default pinned tools"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Defaults
        </Button>
      </div>

      {/* Pinned Tools Grid */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pinnedToolItems.map((tool, idx) => (
            <div
              key={tool.id}
              className="group relative p-4 rounded-lg bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                    {tool.namespace}
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {/* Keyboard Reorder Up */}
                    {idx > 0 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          movePinned(idx, 'up');
                        }}
                        aria-label={`Move ${tool.name} left`}
                        title="Move left"
                        className="p-1 rounded hover:bg-surface-subtle text-foreground-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus"
                      >
                        <ArrowUp className="w-3 h-3 rotate-270" />
                      </button>
                    )}
                    {/* Keyboard Reorder Down */}
                    {idx < pinnedToolItems.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          movePinned(idx, 'down');
                        }}
                        aria-label={`Move ${tool.name} right`}
                        title="Move right"
                        className="p-1 rounded hover:bg-surface-subtle text-foreground-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus"
                      >
                        <ArrowDown className="w-3 h-3 rotate-270" />
                      </button>
                    )}
                    {/* Pin / Unpin Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        togglePin(tool.id);
                      }}
                      aria-label={`Unpin ${tool.name}`}
                      title="Unpin tool"
                      className="p-1 rounded hover:bg-surface-subtle text-accent hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-focus"
                    >
                      <PinOff className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <a href={tool.url} className="block group-hover:text-accent font-semibold text-foreground text-sm transition-colors">
                  {tool.name}
                </a>
                <p className="text-xs text-foreground-secondary line-clamp-2 mt-1 leading-relaxed">
                  {tool.summary}
                </p>
              </div>

              <a
                href={tool.url}
                className="mt-3 inline-flex items-center gap-1 text-xs text-accent font-medium hover:underline"
              >
                Launch tool →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Used Tools (if any) */}
      {recentToolItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Recently Used</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentToolItems.slice(0, 4).map((tool) => (
              <div
                key={tool.id}
                className="p-3 rounded-lg bg-surface border border-border flex items-center justify-between"
              >
                <div>
                  <a href={tool.url} className="text-xs font-semibold text-foreground hover:text-accent transition-colors block">
                    {tool.name}
                  </a>
                  <span className="text-[11px] text-foreground-muted">{tool.namespace}</span>
                </div>
                <button
                  onClick={() => togglePin(tool.id)}
                  aria-label={`Pin ${tool.name}`}
                  title="Pin to dashboard"
                  className="p-1.5 rounded hover:bg-surface-subtle text-foreground-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
