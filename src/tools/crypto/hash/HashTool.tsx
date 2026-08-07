import React, { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, Lock } from 'lucide-react';
import { generateHashes, type HashResults } from './hash';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';
import { Button } from '../../../components/ui/Button';

export interface HashToolProps {
  config?: any;
}

export const HashTool: React.FC<HashToolProps> = () => {
  const [input, setInput] = useState<string>('ShadTools 2026');
  const [hashes, setHashes] = useState<HashResults>({ sha256: '', sha512: '', sha1: '' });
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    generateHashes(input).then(setHashes);
  }, [input]);

  const handleCopy = (key: string, value: string) => {
    if (!value) return;
    const finalValue = uppercase ? value.toUpperCase() : value;
    navigator.clipboard.writeText(finalValue);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReset = () => {
    setInput('');
  };

  const formatHash = (val: string) => (uppercase ? val.toUpperCase() : val);

  return (
    <ToolFrame className="p-5 sm:p-6 space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between p-2.5 bg-surface-subtle/50 border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-accent" />
            Live Cryptographic Hash Generator
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUppercase(!uppercase)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
              uppercase
                ? 'bg-accent-subtle text-accent border border-accent/30 font-bold'
                : 'bg-surface border border-border text-foreground-secondary hover:text-foreground'
            }`}
          >
            {uppercase ? 'UPPERCASE' : 'lowercase'}
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!input}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Input Text Area */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold text-foreground-secondary">
          <label htmlFor="hash-input">Input String</label>
          <span className="font-mono text-foreground-muted">{input.length} chars</span>
        </div>
        <textarea
          id="hash-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste plain text to generate cryptographic hashes..."
          className="w-full p-3.5 rounded-md bg-surface-input border border-border text-foreground font-mono text-xs leading-relaxed focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus min-h-[100px] resize-none"
          autoFocus
        />
      </div>

      {/* Calculated Hash Output Panels */}
      <div className="space-y-3.5">
        {/* SHA-256 */}
        <div className="p-3.5 rounded-md bg-surface border border-border space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground font-mono">SHA-256 (256 bits)</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy('sha256', hashes.sha256)}
              disabled={!hashes.sha256}
              leftIcon={copiedKey === 'sha256' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              className="py-0 px-1.5 text-[11px] h-5 min-h-[20px]"
            >
              {copiedKey === 'sha256' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="p-2.5 rounded bg-surface-subtle border border-border text-accent font-mono text-xs font-bold break-all tabular-nums">
            {formatHash(hashes.sha256) || '—'}
          </div>
        </div>

        {/* SHA-512 */}
        <div className="p-3.5 rounded-md bg-surface border border-border space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground font-mono">SHA-512 (512 bits)</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy('sha512', hashes.sha512)}
              disabled={!hashes.sha512}
              leftIcon={copiedKey === 'sha512' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              className="py-0 px-1.5 text-[11px] h-5 min-h-[20px]"
            >
              {copiedKey === 'sha512' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="p-2.5 rounded bg-surface-subtle border border-border text-foreground-secondary font-mono text-xs font-semibold break-all tabular-nums max-h-24 overflow-y-auto">
            {formatHash(hashes.sha512) || '—'}
          </div>
        </div>

        {/* SHA-1 */}
        <div className="p-3.5 rounded-md bg-surface border border-border space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground font-mono">SHA-1 (160 bits)</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy('sha1', hashes.sha1)}
              disabled={!hashes.sha1}
              leftIcon={copiedKey === 'sha1' ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              className="py-0 px-1.5 text-[11px] h-5 min-h-[20px]"
            >
              {copiedKey === 'sha1' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="p-2.5 rounded bg-surface-subtle border border-border text-foreground-secondary font-mono text-xs font-semibold break-all tabular-nums">
            {formatHash(hashes.sha1) || '—'}
          </div>
        </div>
      </div>
    </ToolFrame>
  );
};
