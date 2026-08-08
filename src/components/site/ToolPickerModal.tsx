import React, { useState } from 'react';
import { Check, Plus, Search } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import type { ToolItem } from '@/components/site/DashboardIsland';
import { getNamespaceVisual } from '@/components/site/tool-visuals';

interface ToolPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTools: ToolItem[];
  pinnedIds: string[];
  onTogglePin: (toolId: string) => void;
  limit?: number;
}

export const ToolPickerModal: React.FC<ToolPickerModalProps> = ({
  isOpen,
  onClose,
  allTools,
  pinnedIds,
  onTogglePin,
  limit = 6,
}) => {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const filtered = allTools.filter((tool) => !normalized || `${tool.name} ${tool.namespace} ${tool.summary}`.toLowerCase().includes(normalized));

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Customize quick access"
      description={`Choose up to ${limit} tools. Your choices stay in this browser.`}
      className="max-w-xl p-0"
    >
      <div className="border-y border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a tool"
            className="h-10 w-full rounded-md border border-border bg-surface-input pl-10 pr-3 text-sm text-foreground outline-none focus:border-border-strong focus:ring-2 focus:ring-focus/20"
            autoFocus
          />
        </div>
      </div>
      <div className="max-h-[420px] divide-y divide-border overflow-y-auto">
        {filtered.map((tool) => {
          const pinned = pinnedIds.includes(tool.id);
          const disabled = !pinned && pinnedIds.length >= limit;
          const visual = getNamespaceVisual(tool.namespace);
          const Icon = visual.icon;
          return (
            <div key={tool.id} className="flex items-center gap-3 px-4 py-3">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${visual.soft} ${visual.color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{tool.name}</p>
                <p className="truncate text-xs text-foreground-muted">{tool.summary}</p>
              </div>
              <button
                type="button"
                onClick={() => onTogglePin(tool.id)}
                disabled={disabled}
                aria-label={pinned ? `Remove ${tool.name}` : `Add ${tool.name}`}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-md border ${pinned ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-surface text-foreground-secondary hover:border-border-strong'} disabled:cursor-not-allowed disabled:opacity-35`}
              >
                {pinned ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </Dialog>
  );
};
