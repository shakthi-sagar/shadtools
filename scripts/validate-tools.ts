import fs from 'fs';
import path from 'path';

async function validate() {
  console.log('🔍 Running ShadTools Content & Registry Validator...\n');

  const toolsDir = path.join(process.cwd(), 'src', 'content', 'tools');
  const namespacesDir = path.join(process.cwd(), 'src', 'content', 'namespaces');
  const srcToolsDir = path.join(process.cwd(), 'src', 'tools');

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fs.existsSync(toolsDir)) {
    console.error(`❌ Tools directory missing at ${toolsDir}`);
    process.exit(1);
  }

  function getMarkdownFiles(dir: string): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...getMarkdownFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const namespaceFiles = getMarkdownFiles(namespacesDir);
  const toolFiles = getMarkdownFiles(toolsDir);

  const namespaceIds = new Set(namespaceFiles.map((f) => path.basename(f, '.md')));

  const seenToolKeys = new Set<string>();

  for (const file of toolFiles) {
    const relPath = path.relative(toolsDir, file).replace(/\\/g, '/');
    const toolKey = relPath.replace(/\.md$/, ''); // e.g. "json/formatter"

    if (seenToolKeys.has(toolKey)) {
      errors.push(`Duplicate tool key found: '${toolKey}'`);
    }
    seenToolKeys.add(toolKey);

    const parts = toolKey.split('/');
    if (parts.length !== 2) {
      errors.push(`[${relPath}] Tool file path must be in format 'namespace/slug.md'`);
      continue;
    }

    const [ns, slug] = parts;

    if (!namespaceIds.has(ns)) {
      errors.push(`[${relPath}] Namespace '${ns}' is not defined in src/content/namespaces/`);
    }

    // Verify corresponding renderer directory exists in src/tools/
    const rendererDir = path.join(srcToolsDir, ns, slug);
    const rendererAstro = path.join(rendererDir, 'Renderer.astro');
    const indexTs = path.join(rendererDir, 'index.ts');

    if (!fs.existsSync(rendererDir)) {
      errors.push(`[${relPath}] Missing tool module implementation directory: ${rendererDir}`);
    } else {
      if (!fs.existsSync(rendererAstro)) {
        errors.push(`[${relPath}] Missing 'Renderer.astro' wrapper in ${rendererDir}`);
      }
      if (!fs.existsSync(indexTs)) {
        errors.push(`[${relPath}] Missing 'index.ts' module definition in ${rendererDir}`);
      }
    }
  }

  console.log(`Verified ${namespaceIds.size} namespaces and ${seenToolKeys.size} tool modules.`);

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach((w) => console.log(`   - ${w}`));
  }

  if (errors.length > 0) {
    console.error('\n❌ CRITICAL VALIDATION ERRORS:');
    errors.forEach((e) => console.error(`   - ${e}`));
    console.error('\nBuild failed due to validation errors.');
    process.exit(1);
  }

  console.log('\n✅ All content entries, tool modules, renderers, and route keys passed validation!\n');
}

validate().catch((err) => {
  console.error(err);
  process.exit(1);
});
