import React, { useState } from 'react';
import { compressImage, type ImageCompressResult } from '../../lib/imageEngine';

export const ImageUploadPreview: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [result, setResult] = useState<ImageCompressResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      await processImage(selected, quality);
    }
  };

  const processImage = async (imgFile: File, q: number) => {
    setLoading(true);
    try {
      const res = await compressImage(imgFile, { quality: q });
      setResult(res);
    } catch (err) {
      console.error('Image compression failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQualityChange = async (newQ: number) => {
    setQuality(newQ);
    if (file) {
      await processImage(file, newQ);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Zone */}
      <div className="p-8 rounded-2xl border-2 border-dashed border-white/20 hover:border-orange-500/50 bg-white/5 transition-colors text-center cursor-pointer relative">
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 mx-auto flex items-center justify-center text-2xl font-bold">
            🖼️
          </div>
          <h3 className="text-sm font-bold text-slate-200">
            {file ? file.name : 'Drop your image here, or browse files'}
          </h3>
          <p className="text-xs text-slate-400">Supports PNG, JPG, WebP. 100% In-Browser Compression.</p>
        </div>
      </div>

      {/* Controls & Preview */}
      {file && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Compression Quality: {Math.round(quality * 100)}%</span>
              <span className="text-orange-400">
                {result ? `Saved ${result.compressionRatio}% size` : ''}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Compressing image...</div>
          ) : result ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-2 text-center">
                <img
                  src={result.dataUrl}
                  alt="Compressed preview"
                  className="max-h-56 mx-auto rounded-xl border border-white/10 shadow-lg object-contain"
                />
                <span className="text-[10px] text-slate-400 block font-mono">
                  {result.width} x {result.height} px
                </span>
              </div>

              <div className="space-y-4 p-5 rounded-xl bg-slate-900 border border-white/10">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Original Size:</span>
                    <span className="font-mono text-slate-200">{(result.originalSize / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Compressed Size:</span>
                    <span className="font-mono text-emerald-400 font-bold">{(result.compressedSize / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <a
                  href={result.dataUrl}
                  download={`compressed_${file.name}`}
                  className="block w-full text-center py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-lg shadow-orange-500/20"
                >
                  Download Compressed Image ⬇️
                </a>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
