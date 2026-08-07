import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(process.cwd(), 'src');

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

function convertImports(filePath: string) {
  const fileDir = path.dirname(filePath);
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Match import statements: import ... from '...' or export ... from '...'
  const importRegex = /(from\s+['"])(\.\.?[^'"]+)(['"])/g;

  const newContent = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    // Only resolve relative paths, not package imports or existing @/ aliases
    if (!importPath.startsWith('.')) {
      return match;
    }

    // Resolve absolute filepath of the import
    const absoluteImportPath = path.resolve(fileDir, importPath);

    // If it points inside src/, convert to @/ alias
    if (absoluteImportPath.startsWith(SRC_DIR)) {
      const relativeFromSrc = path.relative(SRC_DIR, absoluteImportPath).replace(/\\/g, '/');
      const aliasPath = `@/${relativeFromSrc}`;
      modified = true;
      return `${prefix}${aliasPath}${suffix}`;
    }

    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ Converted imports in: ${path.relative(process.cwd(), filePath)}`);
  }
}

function run() {
  console.log('🔄 Converting relative imports to @/ aliases across src/ ...');
  const files = getAllFiles(SRC_DIR);
  for (const file of files) {
    convertImports(file);
  }
  console.log('🎉 Done converting imports!');
}

run();
