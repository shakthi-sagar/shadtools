export function isFileSizeWithinLimit(file: File, maxMb: number): boolean {
  const maxBytes = maxMb * 1024 * 1024;
  return file.size <= maxBytes;
}
