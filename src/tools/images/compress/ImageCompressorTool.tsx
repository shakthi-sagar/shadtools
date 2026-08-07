import React, { useState } from 'react';
import { Download, Sliders, RefreshCw, FileImage } from 'lucide-react';
import { compressImage } from './compress-image';
import { ToolFrame } from '../../../components/tool-ui/ToolFrame';
import { FileDropzone } from '../../../components/tool-ui/FileDropzone';
import { Button } from '../../../components/ui/Button';

export const ImageCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setCompressedBlob(null);
    setCompressedUrl(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await compressImage(file, { quality });
      setCompressedBlob(res.blob);
      setCompressedUrl(res.dataUrl);
    } catch (e) {
      console.error('Compression failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || !file) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    a.download = `compressed_${file.name}`;
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
  };

  const formatSize = (bytes: number) => (bytes / 1024).toFixed(1) + ' KB';

  return (
    <ToolFrame className="p-6">
      {!file ? (
        <FileDropzone
          onFileSelect={handleFileSelect}
          title="Upload an image to compress"
          subtitle="Drop a file here or click to browse"
          hint="PNG, JPG, WebP up to 20 MB"
        />
      ) : (
        <div className="space-y-6">
          {/* File Header Status Row */}
          <div className="flex flex-wrap items-center justify-between p-3.5 rounded-md bg-surface-subtle border border-border gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-surface border border-border flex items-center justify-center text-foreground-secondary">
                <FileImage className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-foreground-muted">Original: {formatSize(file.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Choose Another
            </Button>
          </div>

          {/* Controls & Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Compression Controls */}
            <div className="space-y-4 p-4 rounded-md bg-surface border border-border">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-primary" />
                  Compression Quality
                </span>
                <span className="font-mono text-primary font-bold">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-surface-subtle rounded-lg appearance-none cursor-pointer accent-primary"
              />

              <div className="pt-2">
                <Button variant="primary" className="w-full" onClick={handleCompress} disabled={loading}>
                  {loading ? 'Compressing...' : 'Compress Image'}
                </Button>
              </div>

              {compressedBlob && (
                <div className="p-3 rounded bg-surface-subtle border border-border space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">New Size:</span>
                    <span className="font-mono font-bold text-foreground">{formatSize(compressedBlob.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Savings:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.max(0, Math.round(((file.size - compressedBlob.size) / file.size) * 100))}%
                    </span>
                  </div>
                  <div className="pt-2">
                    <Button variant="secondary" className="w-full" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-1.5" />
                      Download Compressed Image
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Image Preview */}
            <div className="flex items-center justify-center p-4 rounded-md bg-surface-subtle border border-border min-h-[220px]">
              {previewUrl && (
                <img
                  src={compressedUrl || previewUrl}
                  alt="Preview"
                  className="max-h-56 max-w-full rounded object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </ToolFrame>
  );
};
