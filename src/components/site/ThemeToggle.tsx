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
      className="w-8 h-8 rounded-md bg-surface border border-border hover:border-border-strong hover:bg-surface-subtle text-foreground-secondary hover:text-foreground transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus cursor-pointer select-none"
    >
      {isDark ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-foreground-secondary" />}
    </button>
  );
};
