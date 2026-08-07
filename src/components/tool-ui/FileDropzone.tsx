import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

export interface FileDropzoneProps {
  accept?: string;
  onFileSelect: (file: File) => void;
  title?: string;
  subtitle?: string;
  hint?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept = 'image/*',
  onFileSelect,
  title = 'Upload a file',
  subtitle = 'Drop a file here or click to browse',
  hint = 'PNG, JPG, WebP up to 20 MB',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => inputRef.current?.click()}
      className="p-8 sm:p-12 border-2 border-dashed border-border hover:border-border-strong rounded-lg bg-surface-subtle/30 text-center cursor-pointer transition-colors space-y-3 group"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        className="hidden"
      />
      <div className="w-10 h-10 mx-auto rounded-md bg-surface-subtle border border-border flex items-center justify-center text-foreground-secondary group-hover:text-primary group-hover:border-primary/40 transition-colors">
        <UploadCloud className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-foreground-secondary">{subtitle}</p>
      </div>
      {hint && <p className="text-[11px] text-foreground-muted font-sans">{hint}</p>}
    </div>
  );
};
