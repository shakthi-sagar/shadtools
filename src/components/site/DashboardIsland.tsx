import React, { useState, useEffect } from 'react';
import { Pin, PinOff, RotateCcw, Clock, Plus, Settings2, Check, ArrowRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getDashboardState, saveDashboardState } from '@/lib/dashboard-store';
import { ToolPickerModal } from '@/components/site/ToolPickerModal';
import { track } from '@/lib/analytics';
import { ToolIcon } from '@/components/site/ToolIcon';

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
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isCustomizeMode, setIsCustomizeMode] = useState<boolean>(false);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Compute default fallback tools (sorted by dashboardOrder || 100)
  const sortedDefaultTools = [...allTools]
    .filter((t) => t.featured || (t.dashboardOrder && t.dashboardOrder < 100))
    .sort((a, b) => (a.dashboardOrder || 100) - (b.dashboardOrder || 100));

  const defaultPinnedIds = (
    sortedDefaultTools.length > 0 ? sortedDefaultTools : allTools.slice(0, 4)
  ).slice(0, 8).map((t) => t.id);

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
    setIsLoaded(true);
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

  const reorderPinned = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const sourceIndex = pinnedIds.indexOf(sourceId);
    const targetIndex = pinnedIds.indexOf(targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const newPins = [...pinnedIds];
    const [movedId] = newPins.splice(sourceIndex, 1);
    newPins.splice(targetIndex, 0, movedId);
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
      {/* Section Header Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs font-semibold text-accent uppercase tracking-wider">Your workspace</p>
          <h2 className="mt-1 text-2xl font-bold text-foreground tracking-tight">My tools</h2>
          <p className="mt-1 text-sm text-foreground-muted">Keep your go-to utilities one click away.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPickerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Tools
          </Button>

          <Button
            variant={isCustomizeMode ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setIsCustomizeMode(!isCustomizeMode)}
            leftIcon={isCustomizeMode ? <Check className="w-3.5 h-3.5" /> : <Settings2 className="w-3.5 h-3.5" />}
          >
            {isCustomizeMode ? 'Done' : 'Customize'}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pinnedToolItems.map((tool, idx) => {
          if (isCustomizeMode) {
            // CUSTOMIZE MODE TILE
            return (
              <div
                key={tool.id}
                draggable
                onDragStart={(event) => {
                  setDraggedId(tool.id);
                  event.dataTransfer.effectAllowed = 'move';
                  event.dataTransfer.setData('text/plain', tool.id);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const sourceId = draggedId || event.dataTransfer.getData('text/plain');
                  if (sourceId) reorderPinned(sourceId, tool.id);
                  setDraggedId(null);
                }}
                onDragEnd={() => setDraggedId(null)}
                className={`group p-5 min-h-44 rounded-lg bg-surface border flex flex-col justify-between transition-all cursor-grab active:cursor-grabbing ${
                  draggedId === tool.id
                    ? 'border-accent opacity-50 scale-[0.98]'
                    : 'border-accent/40 hover:border-accent'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <ToolIcon id={tool.id} namespace={tool.namespace} />
                    <div className="flex items-center gap-1">
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Drag to reorder ${tool.name}`}
                        title="Drag to reorder"
                        onKeyDown={(event) => {
                          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                            event.preventDefault();
                            movePinned(idx, 'up');
                          } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                            event.preventDefault();
                            movePinned(idx, 'down');
                          }
                        }}
                        className="p-1.5 rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-focus cursor-grab"
                      >
                        <GripVertical className="w-4 h-4" />
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePin(tool.id)}
                        aria-label={`Unpin ${tool.name}`}
                        title="Remove from dashboard"
                        className="p-1.5 rounded-md text-foreground-muted hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-focus"
                      >
                        <PinOff className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <span className="mt-4 block text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">
                    {tool.namespace}
                  </span>
                  <h3 className="mt-1 font-semibold text-foreground text-base">{tool.name}</h3>
                  <p className="mt-1.5 text-xs text-foreground-secondary line-clamp-2 leading-relaxed">
                    {tool.summary}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted">
                  <GripVertical className="h-3.5 w-3.5" /> Drag to reorder
                </span>
              </div>
            );
          }

          // NORMAL MODE TILE: Single Clean Launch Block Target
          return (
            <a
              key={tool.id}
              href={tool.url}
              className="group p-5 min-h-44 rounded-lg bg-surface border border-border hover:border-accent/40 hover:-translate-y-1 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <ToolIcon id={tool.id} namespace={tool.namespace} />
                <span className="mt-4 block text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">
                  {tool.namespace}
                </span>
                <h3 className="mt-1 font-semibold text-foreground text-base group-hover:text-accent transition-colors">
                  {tool.name}
                </h3>
                <p className="mt-1.5 text-xs text-foreground-secondary line-clamp-2 leading-relaxed">
                  {tool.summary}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent opacity-80 group-hover:opacity-100">
                Open tool <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          );
        })}
      </div>

      {/* Recently Used Tools Row (if any) */}
      {recentToolItems.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-border">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Recently Used</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentToolItems.slice(0, 4).map((tool) => (
              <div
                key={tool.id}
                className="p-3 rounded-lg bg-surface border border-border flex items-center justify-between gap-3"
              >
                <ToolIcon id={tool.id} namespace={tool.namespace} className="h-9 w-9" />
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
