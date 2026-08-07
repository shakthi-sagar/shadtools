import React, { useState } from 'react';
import { TwoPaneTransform } from '@/components/tool-ui/archetypes/TwoPaneTransform';
import { generateSlug } from './slug-generator';

export const SlugGeneratorTool: React.FC = () => {
  const [input, setInput] = useState<string>('Hello World! Building ShadTools 2026');
  const [separator, setSeparator] = useState<string>('-');
  const [lowercase, setLowercase] = useState<boolean>(true);

  const output = generateSlug(input, { separator, lowercase });

  return (
    <div className="space-y-4">
      {/* Settings Bar */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border text-xs font-mono">
        <div className="flex items-center gap-2">
          <label className="text-foreground-secondary font-semibold uppercase">Separator:</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="px-2.5 py-1 bg-surface-input border border-border rounded text-foreground outline-none"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=".">Dot (.)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-foreground">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="rounded border-border text-accent focus:ring-0"
          />
          <span>Lowercase</span>
        </label>
      </div>

      <TwoPaneTransform
        inputLabel="Raw Title / Text"
        outputLabel="URL Slug"
        input={input}
        output={output}
        onInputChange={setInput}
        onClear={() => setInput('')}
      />
    </div>
  );
};
