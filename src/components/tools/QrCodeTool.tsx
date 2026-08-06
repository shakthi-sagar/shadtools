import React, { useState, useEffect } from 'react';
import { generateQrDataUrl } from '../../lib/qrEngine';

export const QrCodeTool: React.FC = () => {
  const [text, setText] = useState<string>('https://shadtools.com');
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (text) {
      generateQrDataUrl(text).then((url) => setQrUrl(url));
    }
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Input Form */}
        <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-purple-400 block">QR Code Content (URL or Text)</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL or text to generate QR code..."
              className="w-full h-32 p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* QR Display & Download */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-center">
          {qrUrl ? (
            <div className="space-y-4">
              <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-xl border border-white/10 bg-white p-2" />
              <a
                href={qrUrl}
                download="qrcode.png"
                className="inline-block px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all"
              >
                Download QR Code PNG ⬇️
              </a>
            </div>
          ) : (
            <div className="py-12 text-xs text-slate-500">Enter content to generate QR Code...</div>
          )}
        </div>
      </div>
    </div>
  );
};
