import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const namespace = args[0];
const slug = args[1];
const name = args[2] || `${slug.charAt(0).toUpperCase() + slug.slice(1)} Tool`;

if (!namespace || !slug) {
  console.error('❌ Usage: npm run create-tool <namespace> <slug> [name]');
  console.error('   Example: npm run create-tool text diff "Text Diff Checker"');
  process.exit(1);
}

const toolKey = `${namespace}/${slug}`;
const pascalName = slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
const componentName = `${pascalName}Tool`;

const toolDir = path.join(process.cwd(), 'src', 'tools', namespace, slug);
const contentDir = path.join(process.cwd(), 'src', 'content', 'tools', namespace);

if (fs.existsSync(toolDir)) {
  console.error(`❌ Tool implementation directory already exists at ${toolDir}`);
  process.exit(1);
}

fs.mkdirSync(toolDir, { recursive: true });
fs.mkdirSync(contentDir, { recursive: true });

// 1. config.ts
fs.writeFileSync(
  path.join(toolDir, 'config.ts'),
  `import { z } from 'astro/zod';

export const ${slug.replace(/-/g, '')}ConfigSchema = z.object({});
export type Config = z.infer<typeof ${slug.replace(/-/g, '')}ConfigSchema>;
`
);

// 2. index.ts
fs.writeFileSync(
  path.join(toolDir, 'index.ts'),
  `import type { ToolModule } from '../../tool-module';
import { ${slug.replace(/-/g, '')}ConfigSchema } from './config';

export const toolModule = {
  key: '${toolKey}',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: ${slug.replace(/-/g, '')}ConfigSchema,
} satisfies ToolModule;
`
);

// 3. Renderer.astro
fs.writeFileSync(
  path.join(toolDir, 'Renderer.astro'),
  `---
import { ${componentName} } from './${componentName}';

interface Props {
  config?: any;
}

const { config } = Astro.props;
---

<${componentName} client:load config={config} />
`
);

// 4. React Tool Component
fs.writeFileSync(
  path.join(toolDir, `${componentName}.tsx`),
  `import React from 'react';
import { process${pascalName} } from './${slug}';

export const ${componentName}: React.FC<{ config?: any }> = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white">${name}</h3>
      <p className="text-sm text-slate-300">Tool implementation coming soon.</p>
    </div>
  );
};
`
);

// 5. Pure Engine Function
fs.writeFileSync(
  path.join(toolDir, `${slug}.ts`),
  `export function process${pascalName}(input: string): string {
  return input;
}
`
);

// 6. Unit Test
fs.writeFileSync(
  path.join(toolDir, `${slug}.test.ts`),
  `import { describe, it, expect } from 'vitest';
import { process${pascalName} } from './${slug}';

describe('${name} Engine', () => {
  it('processes input correctly', () => {
    expect(process${pascalName}('test')).toBe('test');
  });
});
`
);

// 7. Content Markdown File
fs.writeFileSync(
  path.join(contentDir, `${slug}.md`),
  `---
id: ${toolKey}
name: ${name}
namespace: ${namespace}
status: published
renderer: ${toolKey}
pattern: code-editor

summary: Free online ${name.toLowerCase()} tool processing locally inside your browser tab.

aliases:
  - ${slug.replace(/-/g, ' ')}

seo:
  title: ${name} – Free Online Utility
  description: Perform ${name.toLowerCase()} operations locally inside your web browser.
  primaryKeyword: ${slug.replace(/-/g, ' ')}
  keywords:
    - ${slug.replace(/-/g, ' ')}
  noindex: false

privacy:
  processing: local
  message: Processed 100% locally in your browser memory.

config: {}

features:
  - process

examples:
  - title: Example calculation
    input: "Sample input"
    output: "Sample output"

faq:
  - question: Is my data uploaded to any server?
    answer: No, all calculations execute locally in your browser memory.

relatedTools: []
featured: false
updatedAt: 2026-08-07
---

## How it works

The ${name} executes directly inside your browser.
`
);

console.log(`✅ Successfully scaffolded tool '${toolKey}':`);
console.log(`   - ${toolDir}/config.ts`);
console.log(`   - ${toolDir}/index.ts`);
console.log(`   - ${toolDir}/Renderer.astro`);
console.log(`   - ${toolDir}/${componentName}.tsx`);
console.log(`   - ${toolDir}/${slug}.ts`);
console.log(`   - ${toolDir}/${slug}.test.ts`);
console.log(`   - ${contentDir}/${slug}.md\n`);
