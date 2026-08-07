import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(process.cwd(), 'src');

const BANNED_PATTERNS = [
  { pattern: /\bslate-[0-9/]+\b/g, name: 'stale slate color token (use surface/border/foreground/muted)' },
  { pattern: /\bindigo-[0-9/]+\b/g, name: 'stale indigo accent token (use accent/action)' },
  { pattern: /\bemerald-[0-9/]+\b/g, name: 'stale emerald color token (use success/accent)' },
  { pattern: /\brose-[0-9/]+\b/g, name: 'stale rose color token (use danger/action-danger)' },
  { pattern: /\brounded-xl\b/g, name: 'overly rounded corner radius (max rounded-lg / 10px)' },
  { pattern: /\brounded-2xl\b/g, name: 'overly rounded corner radius (max rounded-lg / 10px)' },
  { pattern: /\bshadow-lg\b/g, name: 'excessive elevation shadow (use flat border or popover shadow)' },
  { pattern: /\bshadow-2xl\b/g, name: 'excessive elevation shadow (use flat border or popover shadow)' },
];

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (/\.(astro|tsx|ts|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function validateStyles() {
  console.log('🎨 Running ShadTools Stale Style & Token Validator...');
  const files = getAllFiles(SRC_DIR);
  let totalErrors = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(process.cwd(), file);

    for (const { pattern, name } of BANNED_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        console.error(`❌ ${relativePath}: Found ${matches.length} instance(s) of ${name}: ${Array.from(new Set(matches)).join(', ')}`);
        totalErrors += matches.length;
      }
    }
  }

  if (totalErrors > 0) {
    console.error(`\n❌ Failed style validation with ${totalErrors} stale styling error(s). Use semantic design system tokens.`);
    process.exit(1);
  }

  console.log('✅ All UI files passed style & design system token validation!\n');
}

validateStyles();
