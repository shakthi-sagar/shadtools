import React, { useEffect, useState } from 'react';
import {
  Clock3,
  Home,
  Menu,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
  X,
} from 'lucide-react';
import { HeaderSearch, type SearchToolItem } from '@/components/site/HeaderSearch';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { getNamespaceVisual } from '@/components/site/tool-visuals';

export interface ChromeNamespace {
  name: string;
  slug: string;
}

interface AppChromeProps {
  namespaces: ChromeNamespace[];
  tools: SearchToolItem[];
  currentPath: string;
}

export const AppChrome: React.FC<AppChromeProps> = ({ namespaces, tools, currentPath }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [currentPath]);

  const sideContent = (
    <>
      <a href="/" className="flex h-16 items-center gap-2.5 border-b border-border px-5 text-foreground">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground">
          <Wrench className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <span className="text-[15px] font-semibold">ShadTools</span>
      </a>

      <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          <a href="/" className={`app-nav-item ${currentPath === '/' ? 'app-nav-item-active' : ''}`}>
            <Home className="h-4 w-4" />
            <span>Home</span>
          </a>
          <a href="/#quick-access" className="app-nav-item">
            <Star className="h-4 w-4" />
            <span>Favorites</span>
          </a>
          <a href="/#recent-tools" className="app-nav-item">
            <Clock3 className="h-4 w-4" />
            <span>Recent</span>
          </a>
        </div>

        <p className="mb-2 mt-7 px-2 text-[10px] font-semibold uppercase text-foreground-muted">Categories</p>
        <div className="space-y-1">
          {namespaces.map((namespace) => {
            const visual = getNamespaceVisual(namespace.slug);
            const Icon = visual.icon;
            const active = currentPath === `/${namespace.slug}` || currentPath.startsWith(`/${namespace.slug}/`);
            return (
              <a
                key={namespace.slug}
                href={`/${namespace.slug}`}
                className={`app-nav-item ${active ? 'app-nav-item-active' : ''}`}
              >
                <Icon className={`h-4 w-4 ${visual.color}`} />
                <span>{namespace.slug === 'images' ? 'Images' : namespace.slug === 'units' ? 'Units' : namespace.name.replace(/ Tools$| Utilities$| Converters$/i, '')}</span>
              </a>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          <span>Local processing by default</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[236px] flex-col border-r border-border bg-sidebar lg:flex">
        {sideContent}
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur lg:left-[236px]">
        <div className="mx-auto flex h-full max-w-[1240px] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-surface text-foreground-secondary lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
          <a href="/" className="hidden items-center gap-2 text-sm font-semibold text-foreground sm:flex lg:hidden">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline">ShadTools</span>
          </a>
          <HeaderSearch tools={tools} />
          <ThemeToggle />
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative flex h-full w-[280px] max-w-[86vw] flex-col border-r border-border bg-sidebar shadow-dialog">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-md text-foreground-muted hover:bg-surface-hover hover:text-foreground"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
            {sideContent}
          </aside>
        </div>
      )}
    </>
  );
};
