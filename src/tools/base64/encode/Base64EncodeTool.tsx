import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check } from 'lucide-react';
import { encodeBase64, decodeBase64 } from './encode-base64';

export const Base64EncodeTool: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState<boolean>(false);

  const handleProcess = (targetMode: 'encode' | 'decode') => {
    setMode(targetMode);
    if (targetMode === 'encode') {
      const res = encodeBase64(input);
      if (res.success) setOutput(res.output);
    } else {
      const res = decodeBase64(input);
      if (res.success) setOutput(res.output);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => handleProcess('encode')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            mode === 'encode' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Encode Base64</span>
        </button>
        <button
          onClick={() => handleProcess('decode')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            mode === 'decode' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>Decode Base64</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="base64-input" className="text-xs font-semibold text-slate-300 px-1 block">Input Text</label>
          <textarea
            id="base64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter plain text or Base64 string..."
            className="w-full h-80 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-300 px-1">
            <span>Result</span>
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
            aria-label="Result"
            placeholder="Base64 result will appear here..."
            className="w-full h-80 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-indigo-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
