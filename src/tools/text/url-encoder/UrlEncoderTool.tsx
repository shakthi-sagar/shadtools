import React, { useState, useEffect } from 'react';
import { TwoPaneTransform } from '@/components/tool-ui/archetypes/TwoPaneTransform';
import { processUrlEncoding } from './url-encoder';
import { parseUrlParams, updateUrlParams } from '@/lib/url-state';
import { track, getPayloadSizeBucket } from '@/lib/analytics';

export interface UrlEncoderToolProps {
  initialMode?: 'encode' | 'decode';
}

export const UrlEncoderTool: React.FC<UrlEncoderToolProps> = ({
  initialMode = 'encode',
}) => {
  const [mode, setMode] = useState<'encode' | 'decode'>(initialMode);
  const [input, setInput] = useState<string>('https://shadtools.com/search?q=hello world & test!');

  useEffect(() => {
    const params = parseUrlParams();
    if (params.mode === 'encode' || params.mode === 'decode') {
      setMode(params.mode);
    }
    track('tool_open', { tool_key: 'text/url-encoder', category: 'text' });
  }, []);

  const handleModeChange = (newMode: string) => {
    const m = newMode as 'encode' | 'decode';
    setMode(m);
    updateUrlParams({ mode: m });
  };

  const res = processUrlEncoding(input, mode);

  const handleTransform = () => {
    track('tool_execute', {
      tool_key: 'text/url-encoder',
      category: 'text',
      mode,
      success: !res.error,
      input_size_bucket: getPayloadSizeBucket(input.length),
      output_size_bucket: getPayloadSizeBucket(res.output.length),
    });
    return res.output;
  };

  const modeOptions = [
    { id: 'encode', label: 'URL Encode' },
    { id: 'decode', label: 'URL Decode' },
  ];

  return (
    <TwoPaneTransform
      input={input}
      onInputChange={setInput}
      output={res.output}
      inputTitle={mode === 'encode' ? 'Plain Text / URL' : 'URL Encoded Input'}
      outputTitle={mode === 'encode' ? 'Encoded Output' : 'Decoded Plain Text'}
      inputPlaceholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Type or paste URL encoded string to decode...'}
      outputPlaceholder="Result will appear here..."
      mode={mode}
      onModeChange={handleModeChange}
      modeOptions={modeOptions}
      onTransform={handleTransform}
      errorMessage={res.error}
    />
  );
};
