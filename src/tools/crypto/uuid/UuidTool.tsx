import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Key, Link as LinkIcon } from 'lucide-react';
import { generateUuidBatch } from '@/tools/crypto/uuid/uuid';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { Button } from '@/components/ui/Button';
import { parseUrlParams, updateUrlParams, copyShareLink } from '@/lib/url-state';
import { track } from '@/lib/analytics';

export interface UuidToolProps {
  config?: any;
}

export const UuidTool: React.FC<UuidToolProps> = () => {
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    const params = parseUrlParams();
    if (params.count && !isNaN(Number(params.count))) {
      setCount(Math.min(50, Math.max(1, Number(params.count))));
    }
    if (params.uppercase !== undefined) {
      setUppercase(params.uppercase === 'true');
    }
    if (params.hyphens !== undefined) {
      setHyphens(params.hyphens === 'true');
    }
    track('tool_open', { tool_key: 'crypto/uuid', category: 'crypto' });
  }, []);

  const handleGenerate = () => {
    setUuids(generateUuidBatch(count, uppercase, hyphens));
    track('tool_execute', { tool_key: 'crypto/uuid', category: 'crypto', action_type: 'generate' });
  };

  useEffect(() => {
    handleGenerate();
  }, [count, uppercase, hyphens]);

  const handleCountChange = (newCount: number) => {
    setCount(newCount);
    updateUrlParams({ count: newCount, uppercase, hyphens });
  };

  const handleHyphensToggle = () => {
    const next = !hyphens;
    setHyphens(next);
    updateUrlParams({ count, uppercase, hyphens: next });
  };

  const handleUppercaseToggle = () => {
    const next = !uppercase;
    setUppercase(next);
    updateUrlParams({ count, uppercase: next, hyphens });
  };

  const handleCopyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    track('tool_copy', { tool_key: 'crypto/uuid', category: 'crypto', mode: 'copy-all' });
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (uuid: string, idx: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedIndex(idx);
    track('tool_copy', { tool_key: 'crypto/uuid', category: 'crypto', mode: 'copy-single' });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyLink = async () => {
    const ok = await copyShareLink();
    if (ok) {
      setCopiedLink(true);
      track('tool_share', { tool_key: 'crypto/uuid', category: 'crypto' });
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <ToolFrame className="shadow-xs border-border">
      {/* Master Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-foreground tracking-tight flex items-center gap-2">
            <Key className="w-4 h-4 text-accent" />
            UUID v4 Generator
          </span>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1 rounded-md text-xs">
              <span className="text-[11px] font-semibold text-foreground-secondary">Quantity:</span>
              <select
                aria-label="UUID quantity"
                value={count}
                onChange={(e) => handleCountChange(parseInt(e.target.value, 10))}
                className="bg-transparent font-mono font-medium text-foreground cursor-pointer focus:outline-none"
              >
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleHyphensToggle}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all select-none cursor-pointer border ${
                hyphens
                  ? 'bg-surface border-border text-foreground hover:bg-surface-subtle'
                  : 'bg-surface-subtle border-border text-foreground-muted'
              }`}
            >
              {hyphens ? 'With Hyphens' : 'No Hyphens'}
            </button>

            <button
              type="button"
              onClick={handleUppercaseToggle}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all select-none cursor-pointer border ${
                uppercase
                  ? 'bg-accent text-action-primary-foreground border-accent shadow-xs'
                  : 'bg-surface border-border text-foreground-secondary hover:text-foreground hover:bg-surface-subtle'
              }`}
            >
              {uppercase ? 'UPPERCASE' : 'lowercase'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyLink}
            leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <LinkIcon className="w-3.5 h-3.5" />}
            className="h-8 text-xs font-medium"
          >
            {copiedLink ? 'Link Copied' : 'Share Link'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyAll}
            leftIcon={copiedAll ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            className="h-8 text-xs font-medium"
          >
            {copiedAll ? 'Copied All' : 'Copy All'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerate}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="h-8 text-xs font-semibold"
          >
            Generate
          </Button>
        </div>
      </div>

      {/* UUID Results List */}
      <div className="p-5 sm:p-6 bg-surface space-y-2.5">
        {uuids.map((uuid, idx) => (
          <div
            key={idx}
            className="p-3 rounded-md bg-surface-subtle/60 border border-border flex items-center justify-between gap-3 transition-colors hover:border-border-strong"
          >
            <span className="font-mono text-xs font-bold text-accent break-all select-all tracking-wide">
              {uuid}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopySingle(uuid, idx)}
              leftIcon={copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              className="px-2.5 h-7 text-[11px] font-medium shrink-0"
            >
              {copiedIndex === idx ? 'Copied' : 'Copy'}
            </Button>
          </div>
        ))}
      </div>
    </ToolFrame>
  );
};
