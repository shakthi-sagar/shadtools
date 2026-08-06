import QRCode from 'qrcode';

export interface QrOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export async function generateQrDataUrl(text: string, options?: QrOptions): Promise<string> {
  if (!text) return '';
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: options?.width || 300,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#ffffff'
      }
    });
    return dataUrl;
  } catch (err: unknown) {
    console.error('QR Generation failed:', err);
    throw new Error('Failed to generate QR code');
  }
}
