import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export interface SearchTriggerProps {
  onClick?: () => void;
}

export const SearchTrigger: React.FC<SearchTriggerProps> = ({ onClick }) => {
  const [shortcutText, setShortcutText] = useState<string>('Ctrl K');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
      setShortcutText(isMac ? '⌘ K' : 'Ctrl K');
    }
  }, []);

  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Search tools"
      className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-md bg-surface-subtle border border-border text-xs text-foreground-secondary hover:text-foreground hover:border-border-strong transition-colors sm:min-w-[200px] md:min-w-[240px] justify-center sm:justify-between focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
    >
      <span className="flex items-center gap-2">
        <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-foreground-muted" />
        <span className="hidden sm:inline">Search tools...</span>
      </span>
      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-foreground-muted select-none">
        {shortcutText}
      </kbd>
    </button>
  );
};
