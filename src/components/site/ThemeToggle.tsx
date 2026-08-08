import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const hasDark = document.documentElement.classList.contains('dark');
    setIsDark(hasDark);
  }, []);

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    if (isCurrentlyDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-surface text-foreground-secondary transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus"
    >
      {isDark ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4 text-foreground-secondary" />}
    </button>
  );
};
