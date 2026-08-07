import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Layers } from 'lucide-react';

interface NamespaceItem {
  name: string;
  slug: string;
}

interface BrowseMenuProps {
  namespaces: NamespaceItem[];
}

export const BrowseMenu: React.FC<BrowseMenuProps> = ({ namespaces }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-focus"
        aria-expanded={isOpen}
      >
        <Layers className="w-4 h-4 text-foreground-muted" />
        <span>Browse</span>
        <ChevronDown className={`w-3.5 h-3.5 text-foreground-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 rounded-lg bg-surface border border-border shadow-popover p-1.5 z-50 animate-in fade-in duration-100">
          <div className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider px-2 py-1">
            Tool Collections
          </div>
          {namespaces.map((ns) => (
            <a
              key={ns.slug}
              href={`/${ns.slug}`}
              onClick={() => setIsOpen(false)}
              className="block px-2.5 py-1.5 rounded-md text-sm text-foreground-secondary hover:text-foreground hover:bg-surface-subtle transition-colors"
            >
              {ns.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
