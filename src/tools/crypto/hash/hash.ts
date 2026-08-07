export interface HashResults {
  sha256: string;
  sha512: string;
  sha1: string;
}

export async function generateHashes(input: string): Promise<HashResults> {
  if (!input) {
    return { sha256: '', sha512: '', sha1: '' };
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  const [buffer256, buffer512, buffer1] = await Promise.all([
    crypto.subtle.digest('SHA-256', data),
    crypto.subtle.digest('SHA-512', data),
    crypto.subtle.digest('SHA-1', data),
  ]);

  return {
    sha256: bufferToHex(buffer256),
    sha512: bufferToHex(buffer512),
    sha1: bufferToHex(buffer1),
  };
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
