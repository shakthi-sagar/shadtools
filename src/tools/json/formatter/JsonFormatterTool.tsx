import React, { useState } from 'react';
import { formatJson, minifyJson } from './format-json';

export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFormat = () => {
    setError(null);
    const res = formatJson(input);
    if (res.success) {
      setOutput(res.output);
    } else {
      setError(res.error || 'Invalid JSON syntax');
    }
  };

  const handleMinify = () => {
    setError(null);
    const res = minifyJson(input);
    if (res.success) {
      setOutput(res.output);
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

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Format JSON
          </button>
          <button
            onClick={handleMinify}
            className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Minify JSON
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 rounded-md bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono">
          <span className="font-bold">Syntax Error:</span> {error}
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Pane */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-400 px-1">
            <span>Input JSON</span>
            <span className="font-mono text-slate-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON string here (e.g. {"name": "ShadTools", "status": "active"})'
            className="w-full h-80 p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
          />
        </div>

        {/* Output Pane */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-400 px-1">
            <span>Formatted Output</span>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 disabled:opacity-40 transition-colors"
            >
              {copied ? 'Copied to Clipboard ✓' : 'Copy Output 📋'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON result will appear here..."
            className="w-full h-80 p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default JsonFormatterTool;
