import React, { useState } from 'react';
import { Code, Minimize2, RotateCcw, Copy, Check, AlertCircle } from 'lucide-react';
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Format JSON</span>
          </button>
          <button
            onClick={handleMinify}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify JSON</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-mono">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span><strong className="font-bold">Syntax Error:</strong> {error}</span>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Pane */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-300 px-1">
            <label htmlFor="json-input">Input JSON</label>
            <span className="font-mono text-slate-500 text-[11px]">{input.length} chars</span>
          </div>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON string here (e.g. {"name": "ShadTools", "status": "active"})'
            className="w-full h-80 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
          />
        </div>

        {/* Output Pane */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-300 px-1">
            <span>Formatted Output</span>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            aria-label="Formatted Output"
            placeholder="Formatted JSON result will appear here..."
            className="w-full h-80 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-emerald-400 font-mono text-sm focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default JsonFormatterTool;
