import React, { useState } from 'react';
import { formatJson, minifyJson } from '../../lib/jsonEngine';
import { encodeBase64, decodeBase64 } from '../../lib/base64Engine';

export interface CodeEditorToolProps {
  toolType: 'json' | 'base64';
  inputLabel?: string;
  outputLabel?: string;
}

export const CodeEditorTool: React.FC<CodeEditorToolProps> = ({
  toolType,
  inputLabel = 'Input',
  outputLabel = 'Output'
}) => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleJsonFormat = () => {
    setError(null);
    const res = formatJson(input);
    if (res.success) {
      setOutput(res.output);
    } else {
      setError(res.error || 'Invalid JSON syntax');
    }
  };

  const handleJsonMinify = () => {
    setError(null);
    const res = minifyJson(input);
    if (res.success) {
      setOutput(res.output);
    } else {
      setError(res.error || 'Invalid JSON syntax');
    }
  };

  const handleBase64Process = (targetMode: 'encode' | 'decode') => {
    setError(null);
    setMode(targetMode);
    if (targetMode === 'encode') {
      const res = encodeBase64(input);
      if (res.success) setOutput(res.output);
      else setError(res.error || 'Encoding error');
    } else {
      const res = decodeBase64(input);
      if (res.success) setOutput(res.output);
      else setError(res.error || 'Decoding error');
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
    <div className="space-y-6">
      {/* Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          {toolType === 'json' ? (
            <>
              <button
                onClick={handleJsonFormat}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-lg shadow-blue-500/20"
              >
                ✨ Format JSON
              </button>
              <button
                onClick={handleJsonMinify}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 transition-all"
              >
                ⚡ Minify JSON
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleBase64Process('encode')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'encode'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                🔒 Encode Base64
              </button>
              <button
                onClick={() => handleBase64Process('decode')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'decode'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                🔓 Decode Base64
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <span className="font-bold">⚠️ Error:</span> {error}
        </div>
      )}

      {/* Editors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex justify-between">
            <span>{inputLabel}</span>
            <span className="text-slate-500 font-mono">{input.length} chars</span>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              toolType === 'json'
                ? 'Paste raw JSON here (e.g. {"name": "ShadTools", "active": true})'
                : 'Enter text or Base64 string...'
            }
            className="w-full h-72 p-4 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 font-mono text-xs focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>{outputLabel}</span>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-40 transition-colors"
            >
              {copied ? '✅ Copied!' : 'Copy Result 📋'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted result will appear here..."
            className="w-full h-72 p-4 rounded-xl bg-slate-950/80 border border-white/10 text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
