export interface ImageCompressOptions {
  quality: number; // 0.1 to 1.0
  maxWidth?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
}

export interface ImageCompressResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

export function compressImage(
  file: File,
  options: ImageCompressOptions
): Promise<ImageCompressResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (options.maxWidth && width > options.maxWidth) {
          height = Math.round((height * options.maxWidth) / width);
          width = options.maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const format = options.format || 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }
            const dataUrl = URL.createObjectURL(blob);
            const originalSize = file.size;
            const compressedSize = blob.size;
            const ratio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

            resolve({
              blob,
              dataUrl,
              originalSize,
              compressedSize,
              compressionRatio: Math.max(0, ratio),
              width,
              height
            });
          },
          format,
          options.quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
