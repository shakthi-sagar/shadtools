import React from 'react';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-md bg-surface-subtle border border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
            activeTab === tab.id
              ? 'bg-surface text-foreground font-semibold border border-border shadow-xs'
              : 'text-foreground-secondary hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
