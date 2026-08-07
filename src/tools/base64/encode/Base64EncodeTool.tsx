import React, { useState } from 'react';
import { Copy, Check, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { encodeBase64, decodeBase64 } from './encode-base64';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';
import { ToolToolbar } from '../../../components/tool-ui/ToolToolbar';
import { Button } from '../../../components/ui/Button';

export const Base64EncodeTool: React.FC<{ config?: any }> = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('Hello World!');
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    const res = mode === 'encode' ? encodeBase64(input) : decodeBase64(input);
    if (res.success) {
      setOutput(res.output);
      setError(null);
    } else {
      setError(res.error || 'Base64 operation failed');
    }
  };

  const handleToggleMode = () => {
    const nextMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(nextMode);
    setInput(output || input);
    setOutput('');
    setError(null);
  };

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
      <ToolToolbar>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleProcess}>
            {mode === 'encode' ? 'Encode to Base64' : 'Decode Base64'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleToggleMode}>
            <ArrowLeftRight className="w-3.5 h-3.5 mr-1" />
            Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </ToolToolbar>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[360px]">
        {/* Input Pane */}
        <div className="flex flex-col">
          <div className="px-3 py-1.5 bg-surface-subtle/40 border-b border-border">
            <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider font-sans">
              INPUT ({mode.toUpperCase()})
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type string to encode...' : 'Paste Base64 string to decode...'}
            className="flex-1 w-full p-4 bg-surface-input text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none border-none"
          />
        </div>

        {/* Output Pane */}
        <div className="flex flex-col">
          <div className="px-3 py-1.5 bg-surface-subtle/40 border-b border-border">
            <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider font-sans">
              OUTPUT RESULT
            </span>
          </div>
          {error ? (
            <div className="p-4 text-xs font-mono text-danger bg-danger/5 flex-1">
              ⚠️ Error: {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Result will appear here..."
              className="flex-1 w-full p-4 bg-surface-input text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none border-none"
            />
          )}
        </div>
      </div>
    </ToolFrame>
  );
};
