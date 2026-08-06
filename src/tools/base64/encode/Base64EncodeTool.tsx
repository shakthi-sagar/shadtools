import React, { useState } from 'react';
import { encodeBase64, decodeBase64 } from '../../../lib/base64Engine';

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
      <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800">
        <button
          onClick={() => handleProcess('encode')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'encode' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Encode Base64
        </button>
        <button
          onClick={() => handleProcess('decode')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'decode' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Decode Base64
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or Base64 string..."
            className="w-full h-80 p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>Result</span>
            <button onClick={handleCopy} disabled={!output} className="text-purple-400 hover:text-purple-300 text-xs">
              {copied ? 'Copied ✓' : 'Copy 📋'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Base64 result will appear here..."
            className="w-full h-80 p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-purple-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
