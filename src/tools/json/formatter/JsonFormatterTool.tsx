import React, { useState } from 'react';
import { Copy, Check, Download, RotateCcw, Sliders, FileCode } from 'lucide-react';
import { formatJson, minifyJson } from '@/tools/json/formatter/format-json';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { CodeEditorPane } from '@/components/tool-ui/CodeEditorPane';
import { Button } from '@/components/ui/Button';

export interface JsonFormatterToolProps {
  config?: any;
}

export const JsonFormatterTool: React.FC<JsonFormatterToolProps> = () => {
  const [input, setInput] = useState<string>(
    '{\n  "name": "ShadTools",\n  "status": "active",\n  "version": 1.0\n}'
  );
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [indent, setIndent] = useState<string>('2');

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    const res = formatJson(input, indent === 'tab' ? 'tab' : parseInt(indent, 10));
    if (res.success) {
      setOutput(res.output);
      setError(null);
    } else {
      setError(res.error || 'Invalid JSON syntax');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    const res = minifyJson(input);
    if (res.success) {
      setOutput(res.output);
      setError(null);
    } else {
      setError(res.error || 'Invalid JSON syntax');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-foreground tracking-tight flex items-center gap-2 mr-1">
            <FileCode className="w-4 h-4 text-accent" />
            JSON Formatter & Validator
          </span>
          <Button variant="primary" size="sm" onClick={handleFormat} className="h-8 px-3.5 text-xs font-semibold">
            Format
          </Button>
          <Button variant="secondary" size="sm" onClick={handleMinify} className="h-8 px-3.5 text-xs font-semibold border-border">
            Minify
          </Button>

          <div className="flex items-center gap-1.5 ml-2 text-xs text-foreground-secondary whitespace-nowrap bg-surface border border-border px-2.5 py-1 rounded-md">
            <Sliders className="w-3.5 h-3.5 text-foreground-muted" />
            <span className="text-[11px] font-semibold text-foreground-secondary">Indent:</span>
            <select
              aria-label="Indentation spacing"
              value={indent}
              onChange={(e) => setIndent(e.target.value)}
              className="bg-transparent text-xs font-mono font-medium text-foreground cursor-pointer focus:outline-none"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">1 tab</option>
            </select>
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
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[360px]">
        <CodeEditorPane
          label="INPUT JSON"
          value={input}
          onChange={setInput}
          placeholder="Paste raw JSON payload here..."
          minHeightClass="min-h-[300px]"
        />

        <CodeEditorPane
          label="OUTPUT RESULT"
          value={output}
          readOnly
          error={error}
          placeholder="Formatted or minified JSON will appear here..."
          minHeightClass="min-h-[300px]"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
                leftIcon={copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                className="px-2.5 h-7 text-xs font-medium"
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                disabled={!output}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                className="px-2.5 h-7 text-xs font-medium"
              >
                Download
              </Button>
            </div>
          }
        />
      </div>
    </ToolFrame>
  );
};
