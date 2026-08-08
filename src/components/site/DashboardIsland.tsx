import React, { useState, useEffect } from 'react';
import { Pin, PinOff, RotateCcw, ArrowUp, ArrowDown, Clock, Star, Plus, Settings2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getDashboardState, saveDashboardState } from '@/lib/dashboard-store';
import { ToolPickerModal } from '@/components/site/ToolPickerModal';
import { track } from '@/lib/analytics';

export interface ToolItem {
  id: string;
  name: string;
  namespace: string;
  slug: string;
  summary: string;
  featured?: boolean;
  dashboardOrder?: number;
  icon?: string;
  url: string;
}

export interface DashboardIslandProps {
  allTools: ToolItem[];
}

export const DashboardIsland: React.FC<DashboardIslandProps> = ({ allTools = [] }) => {
  const sortedDefaultTools = [...allTools]
    .filter((t) => t.featured || (t.dashboardOrder && t.dashboardOrder < 100))
    .sort((a, b) => (a.dashboardOrder || 100) - (b.dashboardOrder || 100));

  const defaultPinnedIds = (
    sortedDefaultTools.length > 0 ? sortedDefaultTools : allTools.slice(0, 4)
  ).slice(0, 8).map((t) => t.id);

  const [pinnedIds, setPinnedIds] = useState<string[]>(defaultPinnedIds);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [isCustomizeMode, setIsCustomizeMode] = useState<boolean>(false);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedState = getDashboardState();
    if (storedState) {
      const validPinned = storedState.pinnedToolIds.filter((id) => allTools.some((t) => t.id === id));
      const validRecent = storedState.recentToolIds.filter((id) => allTools.some((t) => t.id === id));
      setPinnedIds(validPinned.length > 0 ? validPinned : defaultPinnedIds);
      setRecentIds(validRecent);
    } else {
      setPinnedIds(defaultPinnedIds);
      setRecentIds([]);
    }
  }, [allTools]);

  const updateState = (pins: string[], recents: string[]) => {
    setPinnedIds(pins);
    setRecentIds(recents);
    saveDashboardState(pins, recents);
  };

  const togglePin = (toolId: string) => {
    const isPinned = pinnedIds.includes(toolId);
    if (isPinned) {
      track('dashboard_unpin', { tool_key: toolId });
    } else {
      track('dashboard_pin', { tool_key: toolId });
    }
    const newPins = isPinned
      ? pinnedIds.filter((id) => id !== toolId)
      : [...pinnedIds, toolId];
    updateState(newPins, recentIds);
  };

  const movePinned = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pinnedIds.length) return;
    const newPins = [...pinnedIds];
    const temp = newPins[index];
    newPins[index] = newPins[targetIndex];
    newPins[targetIndex] = temp;
    updateState(newPins, recentIds);
  };

  const resetDefaults = () => {
    updateState(defaultPinnedIds, []);
    setIsCustomizeMode(false);
  };

  const pinnedToolItems = pinnedIds
    .map((id) => allTools.find((t) => t.id === id))
    .filter((t): t is ToolItem => Boolean(t));

  const recentToolItems = recentIds
    .map((id) => allTools.find((t) => t.id === id))
    .filter((t): t is ToolItem => Boolean(t) && !pinnedIds.includes(t!.id));

  return (
    <div className="space-y-6">
      {/* Section Header Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Pinned tools</h2>
          <span className="text-[11px] text-foreground-muted bg-surface-subtle px-2 py-0.5 rounded border border-border">
            {pinnedToolItems.length} pinned
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPickerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add tools
          </Button>

          <Button
            variant={isCustomizeMode ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setIsCustomizeMode(!isCustomizeMode)}
            leftIcon={isCustomizeMode ? <Check className="w-3.5 h-3.5" /> : <Settings2 className="w-3.5 h-3.5" />}
          >
            {isCustomizeMode ? 'Done' : 'Edit layout'}
          </Button>

          {isCustomizeMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDefaults}
              title="Reset to default pinned tools"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Pinned Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pinnedToolItems.map((tool, idx) => {
          if (isCustomizeMode) {
            // CUSTOMIZE MODE TILE
            return (
              <div
                key={tool.id}
                className="p-3.5 rounded-lg bg-surface border border-accent/40 shadow-xs flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-accent uppercase tracking-wider block">
                    {tool.namespace}
                  </span>
                  <p className="text-xs font-semibold text-foreground truncate">{tool.name}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Keyboard Reorder Up/Left */}
                  {idx > 0 && (
                    <button
                      onClick={() => movePinned(idx, 'up')}
                      aria-label={`Move ${tool.name} left`}
                      title="Move left"
                      className="p-1.5 rounded bg-surface-subtle hover:bg-surface border border-border text-foreground-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus"
                    >
                      <ArrowUp className="w-3.5 h-3.5 rotate-270" />
                    </button>
                  )}
                  {/* Keyboard Reorder Down/Right */}
                  {idx < pinnedToolItems.length - 1 && (
                    <button
                      onClick={() => movePinned(idx, 'down')}
                      aria-label={`Move ${tool.name} right`}
                      title="Move right"
                      className="p-1.5 rounded bg-surface-subtle hover:bg-surface border border-border text-foreground-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus"
                    >
                      <ArrowDown className="w-3.5 h-3.5 rotate-270" />
                    </button>
                  )}
                  {/* Unpin Action */}
                  <button
                    onClick={() => togglePin(tool.id)}
                    aria-label={`Unpin ${tool.name}`}
                    title="Unpin tool"
                    className="p-1.5 rounded bg-danger/10 text-danger hover:bg-danger/20 focus-visible:outline-2 focus-visible:outline-focus"
                  >
                    <PinOff className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          }

          // NORMAL MODE TILE: Single Clean Launch Block Target
          return (
            <a
              key={tool.id}
              href={tool.url}
              className="group flex min-h-32 flex-col justify-between rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-subtle"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-accent uppercase tracking-wider font-mono">
                  {tool.namespace}
                </span>
                <h3 className="font-semibold text-foreground text-sm group-hover:text-accent transition-colors flex items-center justify-between">
                  <span>{tool.name}</span>
                  <span className="text-xs text-foreground-muted group-hover:text-accent transition-colors group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </h3>
                <p className="mt-1.5 text-xs text-foreground-secondary line-clamp-2 leading-relaxed">
                  {tool.summary}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {pinnedToolItems.length === 0 && (
        <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-border p-5 text-center">
          <p className="text-sm font-medium text-foreground">No pinned tools yet</p>
          <p className="mt-1 text-xs text-foreground-muted">Add the utilities you use most for quick access.</p>
        </div>
      )}

      {/* Recently Used Tools Row (if any) */}
      {recentToolItems.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-border">
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
                <div className="min-w-0 pr-2">
                  <a href={tool.url} className="text-xs font-semibold text-foreground hover:text-accent transition-colors block truncate">
                    {tool.name}
                  </a>
                  <span className="text-[10px] text-foreground-muted uppercase font-mono">{tool.namespace}</span>
                </div>
                <button
                  onClick={() => togglePin(tool.id)}
                  aria-label={`Pin ${tool.name}`}
                  title="Pin to dashboard"
                  className="p-1.5 rounded hover:bg-surface-subtle text-foreground-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-focus shrink-0"
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Picker Modal */}
      <ToolPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        allTools={allTools}
        pinnedIds={pinnedIds}
        onTogglePin={togglePin}
      />
    </div>
  );
};
