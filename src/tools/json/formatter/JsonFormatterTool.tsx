import React, { useState } from 'react';
import { Copy, Check, Download, RotateCcw, Sliders, AlertCircle } from 'lucide-react';
import { formatJson, minifyJson } from './format-json';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';
import { ToolToolbar } from '../../../components/tool-ui/ToolToolbar';
import { Button } from '../../../components/ui/Button';

export const JsonFormatterTool: React.FC<{ config?: any }> = () => {
  const [input, setInput] = useState<string>('{\n  "name": "ShadTools",\n  "status": "active",\n  "version": 1.0\n}');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [indent, setIndent] = useState<string>('2');

  const handleFormat = () => {
    const res = formatJson(input, indent === 'tab' ? 'tab' : parseInt(indent, 10));
    if (res.success) {
      setOutput(res.output);
      setError(null);
    } else {
      setError(res.error || 'Invalid JSON syntax');
    }
  };

  const handleMinify = () => {
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
    <div className="space-y-4">
      <ToolFrame>
        {/* Toolbar */}
        <ToolToolbar>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={handleFormat}>
              Format
            </Button>
            <Button variant="secondary" size="sm" onClick={handleMinify}>
              Minify
            </Button>
            <div className="flex items-center gap-1.5 ml-2 text-xs text-foreground-secondary">
              <Sliders className="w-3.5 h-3.5" />
              <span>Indent:</span>
              <select
                aria-label="Indentation spacing"
                value={indent}
                onChange={(e) => setIndent(e.target.value)}
                className="bg-surface border border-border rounded px-1.5 py-0.5 text-xs font-sans text-foreground cursor-pointer focus:outline-none focus:border-border-strong"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="tab">1 tab</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
              {copied ? <Check className="w-3.5 h-3.5 mr-1 text-success" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} disabled={!output}>
              <Download className="w-3.5 h-3.5 mr-1" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          </div>
        </ToolToolbar>

        {/* 50/50 Code Editor Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[420px]">
          {/* Input Pane */}
          <div className="flex flex-col">
            <div className="px-3 py-1.5 bg-surface-subtle/40 border-b border-border flex items-center justify-between">
              <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider font-sans">INPUT JSON</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste JSON string here..."
              className="flex-1 w-full p-4 bg-surface-input text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none border-none"
            />
          </div>

          {/* Output Pane */}
          <div className="flex flex-col">
            <div className="px-3 py-1.5 bg-surface-subtle/40 border-b border-border flex items-center justify-between">
              <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider font-sans">OUTPUT</span>
            </div>
            {error ? (
              <div className="p-4 text-xs font-mono text-danger bg-danger/5 flex-1 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
                <span>Error parsing JSON: {error}</span>
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                placeholder="Formatted JSON result will appear here..."
                className="flex-1 w-full p-4 bg-surface-input text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none border-none"
              />
            )}
          </div>
        </div>
      </ToolFrame>
    </div>
  );
};
