export function createTemporaryObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeTemporaryObjectUrl(url: string): void {
  URL.revokeObjectURL(url);
}
