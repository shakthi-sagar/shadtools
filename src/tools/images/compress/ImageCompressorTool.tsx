import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { compressImage, type ImageCompressResult } from './compress-image';
import { FileDropzone } from '../../../components/tool-ui/FileDropzone';

export const ImageCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [result, setResult] = useState<ImageCompressResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileSelect = async (selected: File) => {
    setFile(selected);
    await processImage(selected, quality);
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
      <FileDropzone
        onFileSelect={handleFileSelect}
        selectedFileName={file ? file.name : undefined}
        maxSizeText="PNG, JPEG, WebP · Up to 20 MB"
      />

      {file && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-200">
            <span>Quality: {Math.round(quality * 100)}%</span>
            <span className="text-emerald-400 font-bold font-mono">
              {result ? `Saved ${result.compressionRatio}% size` : ''}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            aria-label="Compression Quality"
            value={quality}
            onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />

          {loading ? (
            <div className="py-6 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Compressing image...</span>
            </div>
          ) : result ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center pt-2">
              <img src={result.dataUrl} alt="Compressed Preview" className="max-h-52 mx-auto rounded-xl border border-slate-800 object-contain shadow-md" />
              <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Original Size:</span>
                  <span className="font-mono text-slate-200">{(result.originalSize / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Compressed Size:</span>
                  <span className="font-mono text-emerald-400 font-bold">{(result.compressedSize / 1024).toFixed(1)} KB</span>
                </div>
                <a
                  href={result.dataUrl}
                  download={`compressed_${file.name}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </a>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
