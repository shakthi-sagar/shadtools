import React, { useState } from 'react';
import { RotateCcw, ArrowLeftRight, Check, Copy } from 'lucide-react';
import { computeLineDiff } from './diff';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';
import { Button } from '../../../components/ui/Button';

export interface DiffToolProps {
  config?: any;
}

export const DiffTool: React.FC<DiffToolProps> = () => {
  const [original, setOriginal] = useState<string>('function greet() {\n  console.log("Hello World");\n}');
  const [modified, setModified] = useState<string>('function greet() {\n  console.log("Hello ShadTools");\n}');
  const [copied, setCopied] = useState<boolean>(false);

  const diffResult = computeLineDiff(original, modified);

  const handleSwap = () => {
    setOriginal(modified);
    setModified(original);
  };

  const handleReset = () => {
    setOriginal('');
    setModified('');
  };

  const handleCopyDiff = () => {
    const diffText = diffResult.lines
      .map((l) => `${l.type === 'added' ? '+' : l.type === 'removed' ? '-' : ' '} ${l.text}`)
      .join('\n');
    navigator.clipboard.writeText(diffText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <ToolFrame>
        {/* Controls Toolbar */}
        <div className="flex items-center justify-between p-2.5 bg-surface-subtle/50 border-b border-border flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">Text Diff Comparison</span>
            <div className="flex items-center gap-2 ml-2 text-[11px] font-mono">
              <span className="text-success font-medium">+{diffResult.additionsCount} additions</span>
              <span className="text-danger font-medium">-{diffResult.deletionsCount} deletions</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwap}
              leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}
            >
              Swap Text
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* 50/50 Text Input Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[220px]">
          {/* Original Input */}
          <div className="flex flex-col">
            <div className="h-9 px-3.5 bg-surface-subtle/30 border-b border-border flex items-center justify-between shrink-0">
              <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider font-mono">
                ORIGINAL TEXT
              </span>
              <span className="text-[11px] font-mono text-foreground-muted">{original.length} chars</span>
            </div>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste original text here..."
              className="flex-1 w-full p-3.5 bg-surface-input text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none border-none min-h-[160px]"
            />
          </div>

          {/* Modified Input */}
          <div className="flex flex-col">
            <div className="h-9 px-3.5 bg-surface-subtle/30 border-b border-border flex items-center justify-between shrink-0">
              <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider font-mono">
                MODIFIED TEXT
              </span>
              <span className="text-[11px] font-mono text-foreground-muted">{modified.length} chars</span>
            </div>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Paste modified text here..."
              className="flex-1 w-full p-3.5 bg-surface-input text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none border-none min-h-[160px]"
            />
          </div>
        </div>
      </ToolFrame>

      {/* Visual Line Diff Output Panel */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden space-y-0">
        <div className="h-9 px-3.5 bg-surface-subtle/50 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground font-mono uppercase tracking-wider">
            DIFF OUTPUT COMPARISON
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyDiff}
            leftIcon={copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
            className="px-2 text-[11px] h-6 min-h-[24px]"
          >
            {copied ? 'Copied Diff' : 'Copy Unified Diff'}
          </Button>
        </div>

        <div className="p-3 bg-surface-input font-mono text-xs overflow-x-auto max-h-80 divide-y divide-border/40">
          {diffResult.lines.length === 0 ? (
            <div className="text-foreground-muted text-center py-4">No text to compare</div>
          ) : (
            diffResult.lines.map((line, idx) => (
              <div
                key={idx}
                className={`py-1 px-2 flex items-start gap-3 rounded-xs ${
                  line.type === 'added'
                    ? 'bg-success/10 text-success'
                    : line.type === 'removed'
                    ? 'bg-danger/10 text-danger line-through opacity-80'
                    : 'text-foreground-secondary'
                }`}
              >
                <span className="w-4 select-none text-foreground-muted font-bold text-center">
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all">{line.text || ' '}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
