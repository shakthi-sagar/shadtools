import React, { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, Binary } from 'lucide-react';
import { encodeBase64, decodeBase64 } from '@/tools/base64/encode/encode-base64';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { CodeEditorPane } from '@/components/tool-ui/CodeEditorPane';
import { Button } from '@/components/ui/Button';

export interface Base64EncodeToolProps {
  config?: any;
}

export const Base64EncodeTool: React.FC<Base64EncodeToolProps> = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('Hello World!');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }

    const res = mode === 'encode' ? encodeBase64(input) : decodeBase64(input);
    if (res.success) {
      setOutput(res.output);
      setError(null);
    } else {
      setError(res.error || 'Invalid Base64 string');
      setOutput('');
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <ToolFrame className="shadow-xs border-border">
      {/* Top IDE Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-foreground tracking-tight flex items-center gap-2">
            <Binary className="w-4 h-4 text-accent" />
            Base64 Converter
          </span>
          {/* Segmented Mode Control Pill */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface border border-border">
            <button
              type="button"
              onClick={() => setMode('encode')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all select-none cursor-pointer ${
                mode === 'encode'
                  ? 'bg-accent text-action-primary-foreground shadow-xs'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all select-none cursor-pointer ${
                mode === 'decode'
                  ? 'bg-accent text-action-primary-foreground shadow-xs'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              Decode
            </button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={!input && !output}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="h-8 text-xs font-medium text-foreground-muted hover:text-foreground"
        >
          Reset
        </Button>
      </div>

      {/* 50/50 Dual Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[180px]">
        <CodeEditorPane
          label={`INPUT (${mode.toUpperCase()})`}
          value={input}
          onChange={setInput}
          placeholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Paste Base64 string to decode...'}
          autoFocus
          minHeightClass="min-h-[140px]"
        />

        <CodeEditorPane
          label="OUTPUT RESULT"
          value={output}
          readOnly
          error={error}
          placeholder="Instant Base64 output will appear here as you type..."
          minHeightClass="min-h-[140px]"
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              disabled={!output}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              className="px-2.5 h-7 text-xs font-medium"
            >
              {copied ? 'Copied Output' : 'Copy Output'}
            </Button>
          }
        />
      </div>
    </ToolFrame>
  );
};
