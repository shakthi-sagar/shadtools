import React, { useState } from 'react';
import { compressImage, type ImageCompressResult } from '../../../lib/imageEngine';

export const ImageCompressorTool: React.FC = () => {
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
    <div className="space-y-4">
      <div className="p-6 rounded-lg border border-dashed border-slate-700 bg-slate-900/50 text-center cursor-pointer relative hover:border-slate-500 transition-colors">
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="space-y-1">
          <div className="text-xl">🖼️</div>
          <p className="text-xs font-semibold text-slate-200">
            {file ? file.name : 'Select or drop an image file (PNG, JPG, WebP)'}
          </p>
          <p className="text-[11px] text-slate-400">Compressed 100% locally inside your browser</p>
        </div>
      </div>

      {file && (
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center text-xs font-medium text-slate-300">
            <span>Quality: {Math.round(quality * 100)}%</span>
            <span className="text-orange-400 font-bold">{result ? `Saved ${result.compressionRatio}% size` : ''}</span>
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

          {loading ? (
            <div className="py-4 text-center text-xs text-slate-400">Compressing...</div>
          ) : result ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
              <img src={result.dataUrl} alt="Preview" className="max-h-48 mx-auto rounded border border-slate-800 object-contain" />
              <div className="space-y-3 p-3 rounded bg-slate-950 border border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Original:</span>
                  <span className="font-mono text-slate-200">{(result.originalSize / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Compressed:</span>
                  <span className="font-mono text-emerald-400 font-bold">{(result.compressedSize / 1024).toFixed(1)} KB</span>
                </div>
                <a
                  href={result.dataUrl}
                  download={`compressed_${file.name}`}
                  className="block text-center py-2 rounded bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-colors"
                >
                  Download Image ⬇️
                </a>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
