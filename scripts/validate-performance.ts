import fs from 'fs';
import path from 'path';

/**
 * Lightweight Bundle & Performance Guard Script
 * Inspects build artifacts in dist/_astro/ to ensure lightweight asset delivery.
 */

console.log('⚡ Running ShadTools Performance & Bundle Guard...\n');

const distAstroDir = path.join(process.cwd(), 'dist', '_astro');

if (!fs.existsSync(distAstroDir)) {
  console.warn('⚠️  dist/_astro/ directory does not exist yet. Run `npm run build:astro` before validating performance.');
  process.exit(0);
}

const jsFiles = fs.readdirSync(distAstroDir).filter((f) => f.endsWith('.js'));
const MAX_JS_BUNDLE_BYTES = 300 * 1024; // 300 KB raw max per chunk

const oversizedFiles: string[] = [];

for (const file of jsFiles) {
  const filePath = path.join(distAstroDir, file);
  const stats = fs.statSync(filePath);

  if (stats.size > MAX_JS_BUNDLE_BYTES) {
    oversizedFiles.push(`${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

if (oversizedFiles.length > 0) {
  console.error('❌ Performance Guard Failed: Oversized JavaScript bundles detected:');
  oversizedFiles.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
} else {
  console.log(`✅ Performance Guard passed cleanly! Checked ${jsFiles.length} JavaScript bundles (all under ${(MAX_JS_BUNDLE_BYTES / 1024).toFixed(0)}KB raw threshold).`);
}
