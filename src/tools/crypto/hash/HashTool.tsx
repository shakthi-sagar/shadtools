import React, { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, Lock } from 'lucide-react';
import { generateHashes, type HashResults } from '@/tools/crypto/hash/hash';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { Button } from '@/components/ui/Button';

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
    <ToolFrame className="shadow-xs border-border">
      {/* Top IDE Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground tracking-tight flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            Live Cryptographic Hash Generator
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUppercase(!uppercase)}
            className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all select-none cursor-pointer border ${
              uppercase
                ? 'bg-accent text-action-primary-foreground border-accent shadow-xs'
                : 'bg-surface border-border text-foreground-secondary hover:text-foreground hover:bg-surface-subtle'
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
            className="h-8 text-xs font-medium text-foreground-muted hover:text-foreground"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6 bg-surface">
        {/* Input Text Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-foreground-secondary uppercase tracking-wider font-mono">
            <label htmlFor="hash-input">Input String</label>
            <span className="font-mono text-foreground-muted">{input.length} characters</span>
          </div>
          <textarea
            id="hash-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste plain text to generate cryptographic hashes..."
            className="w-full p-4 rounded-md bg-surface-input border border-border text-foreground font-mono text-xs leading-relaxed outline-none ring-0 focus:outline-none focus:ring-0 focus:border-border-strong min-h-[110px] resize-none transition-colors shadow-none"
            autoFocus
          />
        </div>

        {/* Calculated Hash Output Panels */}
        <div className="space-y-4">
          {/* SHA-256 */}
          <div className="p-4 rounded-md bg-surface-subtle/50 border border-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-foreground font-mono uppercase tracking-wider">SHA-256 (256 bits)</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopy('sha256', hashes.sha256)}
                disabled={!hashes.sha256}
                leftIcon={copiedKey === 'sha256' ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                className="px-2.5 h-6 text-[11px] font-medium"
              >
                {copiedKey === 'sha256' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div className="p-3 rounded bg-surface border border-border text-accent font-mono text-xs font-bold break-all tabular-nums leading-relaxed">
              {formatHash(hashes.sha256) || '—'}
            </div>
          </div>

          {/* SHA-512 */}
          <div className="p-4 rounded-md bg-surface-subtle/50 border border-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-foreground font-mono uppercase tracking-wider">SHA-512 (512 bits)</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopy('sha512', hashes.sha512)}
                disabled={!hashes.sha512}
                leftIcon={copiedKey === 'sha512' ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                className="px-2.5 h-6 text-[11px] font-medium"
              >
                {copiedKey === 'sha512' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div className="p-3 rounded bg-surface border border-border text-foreground-secondary font-mono text-xs font-semibold break-all tabular-nums max-h-24 overflow-y-auto leading-relaxed">
              {formatHash(hashes.sha512) || '—'}
            </div>
          </div>

          {/* SHA-1 */}
          <div className="p-4 rounded-md bg-surface-subtle/50 border border-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-foreground font-mono uppercase tracking-wider">SHA-1 (160 bits)</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopy('sha1', hashes.sha1)}
                disabled={!hashes.sha1}
                leftIcon={copiedKey === 'sha1' ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                className="px-2.5 h-6 text-[11px] font-medium"
              >
                {copiedKey === 'sha1' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div className="p-3 rounded bg-surface border border-border text-foreground-secondary font-mono text-xs font-semibold break-all tabular-nums leading-relaxed">
              {formatHash(hashes.sha1) || '—'}
            </div>
          </div>
        </div>
      </div>
    </ToolFrame>
  );
};
