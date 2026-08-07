import React, { useState } from 'react';
import { TwoPaneTransform } from '@/components/tool-ui/archetypes/TwoPaneTransform';
import { validateJson } from './validate-json';

export const JsonValidatorTool: React.FC = () => {
  const [input, setInput] = useState<string>('{\n  "name": "ShadTools",\n  "status": "active",\n  "features": ["fast", "local"]\n}');

  const result = validateJson(input);

  const outputDisplay = result.isValid
    ? result.formatted || ''
    : result.error
    ? `SYNTAX ERROR: ${result.error.message}${result.error.line ? ` (Line ${result.error.line}, Col ${result.error.column})` : ''}`
    : 'Invalid JSON';

  return (
    <TwoPaneTransform
      inputLabel="JSON Input"
      outputLabel={result.isValid ? "Validated & Formatted JSON" : "Syntax Errors"}
      input={input}
      output={outputDisplay}
      onInputChange={setInput}
      error={result.isValid ? null : result.error?.message}
      placeholder="Paste JSON content here..."
      onClear={() => setInput('')}
    />
  );
};
