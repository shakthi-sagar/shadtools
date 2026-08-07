import fs from 'fs';
import path from 'path';

console.log('🔍 Checking static build artifacts in dist/...');
const distPath = path.resolve('dist');

if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ directory does not exist! Run npm run build first.');
  process.exit(1);
}

console.log('✅ Build output directory dist/ verified.');
