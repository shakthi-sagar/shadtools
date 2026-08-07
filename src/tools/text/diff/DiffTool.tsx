import React, { useState } from 'react';
import { RotateCcw, ArrowLeftRight, Check, Copy, FileText, Code } from 'lucide-react';
import { computeLineDiff } from '@/tools/text/diff/diff';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { CodeEditorPane } from '@/components/tool-ui/CodeEditorPane';
import { Button } from '@/components/ui/Button';

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
      <ToolFrame className="shadow-xs border-border">
        {/* IDE Master Control Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-foreground tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Text Diff Comparison
            </span>
            <div className="flex items-center gap-1.5 ml-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-success/15 text-success font-semibold border border-success/20">
                +{diffResult.additionsCount} additions
              </span>
              <span className="px-2 py-0.5 rounded-full bg-danger/15 text-danger font-semibold border border-danger/20">
                -{diffResult.deletionsCount} deletions
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSwap}
              leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}
              className="h-8 text-xs font-medium"
            >
              Swap Text
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="h-8 text-xs font-medium text-foreground-muted hover:text-foreground"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* 50/50 Dual Editor Workspaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[240px]">
          <CodeEditorPane
            label="ORIGINAL TEXT"
            icon={<Code className="w-3.5 h-3.5 text-foreground-muted" />}
            value={original}
            onChange={setOriginal}
            placeholder="Paste original text here..."
            minHeightClass="min-h-[180px]"
          />

          <CodeEditorPane
            label="MODIFIED TEXT"
            icon={<Code className="w-3.5 h-3.5 text-foreground-muted" />}
            value={modified}
            onChange={setModified}
            placeholder="Paste modified text here..."
            minHeightClass="min-h-[180px]"
          />
        </div>
      </ToolFrame>

      {/* Visual Unified Line Diff Output Panel */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden shadow-xs">
        <div className="h-10 px-4 bg-surface-subtle border-b border-border flex items-center justify-between">
          <span className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
            UNIFIED LINE DIFF OUTPUT
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyDiff}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            className="px-2.5 h-7 text-xs font-medium"
          >
            {copied ? 'Copied Unified Diff' : 'Copy Unified Diff'}
          </Button>
        </div>

        <div className="p-3.5 bg-surface-input font-mono text-xs overflow-x-auto max-h-80 divide-y divide-border/40">
          {diffResult.lines.length === 0 ? (
            <div className="text-foreground-muted text-center py-6 text-xs">No text to compare</div>
          ) : (
            diffResult.lines.map((line, idx) => (
              <div
                key={idx}
                className={`py-1.5 px-2.5 flex items-start gap-3 rounded-xs transition-colors ${
                  line.type === 'added'
                    ? 'bg-success/12 text-success font-medium'
                    : line.type === 'removed'
                    ? 'bg-danger/12 text-danger line-through opacity-85'
                    : 'text-foreground-secondary'
                }`}
              >
                <span className="w-5 select-none font-bold text-center shrink-0">
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
