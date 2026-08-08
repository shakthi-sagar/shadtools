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
      className="group cursor-pointer space-y-3 rounded-lg border border-dashed border-border bg-surface-subtle/40 p-8 text-center transition-colors hover:border-accent/60 hover:bg-surface-subtle sm:p-12"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        className="hidden"
      />
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-foreground-secondary transition-colors group-hover:border-accent/40 group-hover:text-primary">
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
