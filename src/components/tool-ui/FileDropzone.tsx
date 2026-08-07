import React from 'react';
import { UploadCloud, ShieldCheck } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  selectedFileName?: string;
  maxSizeText?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  accept = 'image/png, image/jpeg, image/webp',
  selectedFileName,
  maxSizeText = 'PNG, JPEG or WebP · Maximum 20 MB',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 text-center cursor-pointer relative hover:border-slate-500 transition-colors group">
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        aria-label="Upload file"
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
      <div className="space-y-3 pointer-events-none flex flex-col items-center">
        <div className="p-3 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
          {selectedFileName ? selectedFileName : 'Drop file here or click to browse'}
        </p>
        <p className="text-xs text-slate-400">{maxSizeText}</p>
        <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Processed 100% locally inside your browser tab</span>
        </p>
      </div>
    </div>
  );
};
