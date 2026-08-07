import React, { useState } from 'react';
import { TwoPaneTransform } from '@/components/tool-ui/archetypes/TwoPaneTransform';
import { sortLines, type SortMode } from './sort-lines';

export const SortLinesTool: React.FC = () => {
  const [input, setInput] = useState<string>('Zebra\nApple\nMonkey\nApple\nBanana');
  const [mode, setMode] = useState<SortMode>('alphabetical-asc');
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);

  const output = sortLines(input, mode, removeDuplicates);

  return (
    <div className="space-y-4">
      {/* Options Bar */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border text-xs font-mono">
        <div className="flex items-center gap-2">
          <label className="text-foreground-secondary font-semibold uppercase">Sort Order:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as SortMode)}
            className="px-2.5 py-1 bg-surface-input border border-border rounded text-foreground outline-none"
          >
            <option value="alphabetical-asc">Alphabetical (A → Z)</option>
            <option value="alphabetical-desc">Alphabetical (Z → A)</option>
            <option value="numerical-asc">Numeric (0 → 9)</option>
            <option value="numerical-desc">Numeric (9 → 0)</option>
            <option value="length-asc">Shortest First</option>
            <option value="length-desc">Longest First</option>
            <option value="reverse">Reverse Order</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-foreground">
          <input
            type="checkbox"
            checked={removeDuplicates}
            onChange={(e) => setRemoveDuplicates(e.target.checked)}
            className="rounded border-border text-accent focus:ring-0"
          />
          <span>Deduplicate Lines</span>
        </label>
      </div>

      <TwoPaneTransform
        inputLabel="Raw Lines"
        outputLabel="Sorted Lines"
        input={input}
        output={output}
        onInputChange={setInput}
        onClear={() => setInput('')}
      />
    </div>
  );
};
