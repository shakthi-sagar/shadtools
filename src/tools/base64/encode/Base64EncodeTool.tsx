import React, { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { encodeBase64, decodeBase64 } from './encode-base64';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';
import { Button } from '../../../components/ui/Button';

export interface Base64EncodeToolProps {
  config?: any;
}

export const Base64EncodeTool: React.FC<Base64EncodeToolProps> = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('Hello World!');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Live instant transformation effect
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
    <ToolFrame>
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between p-2.5 bg-surface-subtle/50 border-b border-border flex-wrap gap-2">
        {/* Segmented Mode Toggle (Encode | Decode) */}
        <div className="flex items-center gap-1 p-0.5 rounded-md bg-surface border border-border">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
              mode === 'encode'
                ? 'bg-surface-subtle text-foreground font-semibold border border-border shadow-xs'
                : 'text-foreground-secondary hover:text-foreground'
            }`}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
              mode === 'decode'
                ? 'bg-surface-subtle text-foreground font-semibold border border-border shadow-xs'
                : 'text-foreground-secondary hover:text-foreground'
            }`}
          >
            Decode
          </button>
        </div>

        {/* Reset Action */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={!input && !output}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset
        </Button>
      </div>

      {/* 50/50 Workspace Grid (Aligned Headers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[160px] max-h-[240px]">
        {/* Input Pane */}
        <div className="flex flex-col">
          <div className="h-9 px-3.5 bg-surface-subtle/30 border-b border-border flex items-center justify-between shrink-0">
            <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider font-mono">
              INPUT ({mode.toUpperCase()})
            </span>
            <span className="text-[11px] font-mono text-foreground-muted">
              {input.length} chars
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Paste Base64 string to decode...'}
            className="flex-1 w-full p-3.5 bg-surface-input text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none border-none min-h-[120px]"
            autoFocus
          />
        </div>

        {/* Output Pane */}
        <div className="flex flex-col">
          <div className="h-9 px-3.5 bg-surface-subtle/30 border-b border-border flex items-center justify-between shrink-0">
            <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider font-mono">
              OUTPUT RESULT
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!output}
              leftIcon={copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              className="px-2 text-[11px] h-6 min-h-[24px]"
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          {error ? (
            <div className="p-3.5 text-xs font-mono text-danger bg-danger/5 flex-1 leading-relaxed">
              ⚠️ {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Instant Base64 output will appear here as you type..."
              className="flex-1 w-full p-3.5 bg-surface-input text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none border-none min-h-[120px]"
            />
          )}
        </div>
      </div>
    </ToolFrame>
  );
};
