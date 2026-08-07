import React, { useState } from 'react';
import { Copy, Check, Download, RotateCcw, Sliders, AlertCircle } from 'lucide-react';
import { formatJson, minifyJson } from './format-json';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';
import { Button } from '../../../components/ui/Button';

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
    <ToolFrame>
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between p-2.5 bg-surface-subtle/50 border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="primary" size="sm" onClick={handleFormat}>
            Format
          </Button>
          <Button variant="secondary" size="sm" onClick={handleMinify}>
            Minify
          </Button>

          <div className="flex items-center gap-1.5 ml-1 text-xs text-foreground-secondary whitespace-nowrap">
            <Sliders className="w-3.5 h-3.5 text-foreground-muted" />
            <span className="text-[11px] font-medium">Indent:</span>
            <select
              aria-label="Indentation spacing"
              value={indent}
              onChange={(e) => setIndent(e.target.value)}
              className="bg-surface border border-border rounded px-2 py-0.5 text-xs font-sans text-foreground cursor-pointer focus:outline-none focus:border-border-strong"
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
        >
          Reset
        </Button>
      </div>

      {/* 50/50 Workspace Grid (Aligned Headers, 380px Height) */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[360px] max-h-[460px]">
        {/* Input Pane */}
        <div className="flex flex-col">
          <div className="h-9 px-3.5 bg-surface-subtle/30 border-b border-border flex items-center justify-between shrink-0">
            <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider font-mono">
              INPUT JSON
            </span>
            <span className="text-[11px] font-mono text-foreground-muted">
              {input.length} chars
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON string here..."
            className="flex-1 w-full p-3.5 bg-surface-input text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none border-none min-h-[300px]"
          />
        </div>

        {/* Output Pane */}
        <div className="flex flex-col">
          <div className="h-9 px-3.5 bg-surface-subtle/30 border-b border-border flex items-center justify-between shrink-0">
            <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider font-mono">
              OUTPUT RESULT
            </span>

            <div className="flex items-center gap-1.5">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={!output}
                leftIcon={<Download className="w-3 h-3" />}
                className="px-2 text-[11px] h-6 min-h-[24px]"
              >
                Download
              </Button>
            </div>
          </div>

          {error ? (
            <div className="p-4 text-xs font-mono text-danger bg-danger/5 flex-1 flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
              <span>Error parsing JSON: {error}</span>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Formatted or minified JSON will appear here..."
              className="flex-1 w-full p-3.5 bg-surface-input text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none border-none min-h-[300px]"
            />
          )}
        </div>
      </div>
    </ToolFrame>
  );
};
