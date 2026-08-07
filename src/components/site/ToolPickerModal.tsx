import React, { useState } from 'react';
import { Search, Pin, PinOff } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import type { ToolItem } from '@/components/site/DashboardIsland';

export interface ToolPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTools: ToolItem[];
  pinnedIds: string[];
  onTogglePin: (toolId: string) => void;
}

export const ToolPickerModal: React.FC<ToolPickerModalProps> = ({
  isOpen,
  onClose,
  allTools,
  pinnedIds,
  onTogglePin,
}) => {
  const [query, setQuery] = useState<string>('');

  const filtered = query.trim()
    ? allTools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.summary.toLowerCase().includes(query.toLowerCase()) ||
          t.namespace.toLowerCase().includes(query.toLowerCase())
      )
    : allTools;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Tools to Your Dashboard" description="Search and pin utilities to customize your personal dashboard.">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools to pin..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-surface-input border border-border text-foreground placeholder:text-foreground-muted text-sm focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus"
            autoFocus
          />
        </div>

        {/* Tools List */}
        <div className="max-h-72 overflow-y-auto rounded-md border border-border divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-foreground-muted">No tools found matching "{query}"</div>
          ) : (
            filtered.map((tool) => {
              const isPinned = pinnedIds.includes(tool.id);
              return (
                <div key={tool.id} className="flex items-center justify-between p-3 hover:bg-surface-subtle transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">{tool.name}</span>
                      <span className="text-[10px] text-accent uppercase font-mono px-1.5 py-0.2 rounded bg-accent-subtle">
                        {tool.namespace}
                      </span>
                    </div>
                    <p className="text-xs text-foreground-secondary line-clamp-1 mt-0.5">{tool.summary}</p>
                  </div>

                  <button
                    onClick={() => onTogglePin(tool.id)}
                    aria-label={isPinned ? `Unpin ${tool.name}` : `Pin ${tool.name}`}
                    className={`px-3 py-1.5 rounded text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-focus ${
                      isPinned
                        ? 'bg-accent-subtle text-accent hover:bg-accent/20 border border-accent/30'
                        : 'bg-surface border border-border text-foreground-secondary hover:text-foreground hover:bg-surface-subtle'
                    }`}
                  >
                    {isPinned ? (
                      <>
                        <PinOff className="w-3.5 h-3.5 text-accent" />
                        <span>Pinned</span>
                      </>
                    ) : (
                      <>
                        <Pin className="w-3.5 h-3.5" />
                        <span>Pin</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Dialog>
  );
};
