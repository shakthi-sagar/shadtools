import React, { useState, useEffect } from 'react';
import { TwoPaneTransform } from '@/components/tool-ui/archetypes/TwoPaneTransform';
import { minifyJson } from './minify-json';
import { track, getPayloadSizeBucket } from '@/lib/analytics';

const SAMPLE_JSON = `{\n  "name": "ShadTools",\n  "type": "utility-workspace",\n  "features": ["local-processing", "fast", "privacy-first"],\n  "status": "published"\n}`;

export const JsonMinifierTool: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_JSON);

  useEffect(() => {
    track('tool_open', { tool_key: 'json/minifier', category: 'json' });
  }, []);

  const res = minifyJson(input);

  const handleTransform = () => {
    track('tool_execute', {
      tool_key: 'json/minifier',
      category: 'json',
      action_type: 'minify',
      success: !res.error,
      input_size_bucket: getPayloadSizeBucket(input.length),
      output_size_bucket: getPayloadSizeBucket(res.output.length),
    });
    return res.output;
  };

  return (
    <TwoPaneTransform
      input={input}
      onInputChange={setInput}
      output={res.output}
      inputTitle="Input JSON"
      outputTitle="Minified JSON"
      inputPlaceholder="Paste or type formatted JSON here..."
      outputPlaceholder="Minified JSON output will appear here..."
      onTransform={handleTransform}
      errorMessage={res.error?.message}
    />
  );
};
