import fs from 'fs';
import path from 'path';

/**
 * ShadTools Automated Tool Generator Script
 * Usage:
 *   npx tsx scripts/create-tool.ts <namespace> <slug> [name] [--pattern=converter|transform|custom]
 *
 * Example:
 *   npx tsx scripts/create-tool.ts units pressure "Pressure Converter" --pattern=converter
 *   npx tsx scripts/create-tool.ts text cleaner "Text Cleaner" --pattern=transform
 */

const rawArgs = process.argv.slice(2);
let patternArg: 'converter' | 'transform' | 'custom' = 'transform';

const positionalArgs = rawArgs.filter((arg) => {
  if (arg.startsWith('--pattern=')) {
    const val = arg.split('=')[1];
    if (val === 'converter' || val === 'transform' || val === 'custom') {
      patternArg = val;
    }
    return false;
  }
  return true;
});

const namespace = positionalArgs[0];
const slug = positionalArgs[1];

if (!namespace || !slug) {
  console.error('❌ Usage: npm run create-tool <namespace> <slug> [name] [--pattern=converter|transform|custom]');
  console.error('   Example: npm run create-tool units pressure "Pressure Converter" --pattern=converter');
  console.error('   Example: npm run create-tool text cleaner "Text Cleaner" --pattern=transform');
  process.exit(1);
}

const name = positionalArgs[2] || `${slug.charAt(0).toUpperCase() + slug.slice(1)} Tool`;

// Auto-infer converter pattern if namespace is units
if (namespace === 'units' && patternArg === 'transform') {
  patternArg = 'converter';
}

const toolKey = `${namespace}/${slug}`;
const camelName = slug.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
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

const todayDate = new Date().toISOString().split('T')[0];

if (patternArg === 'converter') {
  // ==========================================
  // CONVERTER PATTERN GENERATION
  // ==========================================

  // 1. Engine
  fs.writeFileSync(
    path.join(toolDir, `${slug}.ts`),
    `export interface ${pascalName}Unit {
  id: string;
  name: string;
  symbol: string;
  factor: number;
}

export const ${pascalName.toUpperCase()}_UNITS: ${pascalName}Unit[] = [
  { id: 'base-unit', name: 'Base Unit', symbol: 'base', factor: 1 },
  { id: 'sub-unit', name: 'Sub Unit', symbol: 'sub', factor: 0.1 },
  { id: 'super-unit', name: 'Super Unit', symbol: 'super', factor: 10 },
];

export function convert${pascalName}(value: number, fromId: string, toId: string): number {
  const fromUnit = ${pascalName.toUpperCase()}_UNITS.find((u) => u.id === fromId);
  const toUnit = ${pascalName.toUpperCase()}_UNITS.find((u) => u.id === toId);

  if (!fromUnit || !toUnit) {
    throw new Error(\`Invalid unit conversion: \${fromId} to \${toId}\`);
  }

  const valueInBase = value * fromUnit.factor;
  return valueInBase / toUnit.factor;
}
`
  );

  // 2. Config Schema
  fs.writeFileSync(
    path.join(toolDir, 'config.ts'),
    `import { z } from 'zod';

export const ${camelName}ConfigSchema = z.object({
  defaultAmount: z.number().default(1),
  defaultFromUnit: z.string().default('base-unit'),
  defaultToUnit: z.string().default('sub-unit'),
});

export type ${pascalName}Config = z.infer<typeof ${camelName}ConfigSchema>;
`
  );

  // 3. SEO Provider
  fs.writeFileSync(
    path.join(toolDir, 'seo.ts'),
    `import type { SeoPageProvider, SeoSection, BreadcrumbParent } from '@/tools/tool-module';
import { convert${pascalName} } from './${slug}';

export interface ${pascalName}Variant {
  type?: 'pair' | 'exact';
  value?: number;
  fromId: string;
  toId: string;
}

interface UnitMeta {
  id: string;
  singular: string;
  plural: string;
  slug: string;
  symbol: string;
}

const UNIT_META: UnitMeta[] = [
  { id: 'base-unit', singular: 'Base Unit', plural: 'Base Units', slug: 'base-unit', symbol: 'base' },
  { id: 'sub-unit', singular: 'Sub Unit', plural: 'Sub Units', slug: 'sub-unit', symbol: 'sub' },
  { id: 'super-unit', singular: 'Super Unit', plural: 'Super Units', slug: 'super-unit', symbol: 'super' },
];

function getMeta(id: string): UnitMeta {
  const m = UNIT_META.find((u) => u.id === id);
  if (!m) throw new Error(\`Unknown unit: \${id}\`);
  return m;
}

const CONVERSION_PAIRS = [
  { from: 'base-unit', to: 'sub-unit' },
  { from: 'sub-unit', to: 'base-unit' },
  { from: 'super-unit', to: 'base-unit' },
  { from: 'base-unit', to: 'super-unit' },
];

const CURATED_VALUES = [
  ...Array.from({ length: 50 }, (_, i) => i + 1),
  100, 250, 500, 1000,
];

const SLUG_TO_ID = new Map(UNIT_META.map((u) => [u.slug, u.id]));
const EXACT_SLUG_RE = /^(\\d+(?:\\.\\d+)?)-([a-z-]+)-to-([a-z-]+)$/;
const PAIR_SLUG_RE = /^([a-z-]+)-to-([a-z-]+)$/;

function buildSlug(v: ${pascalName}Variant): string {
  const f = getMeta(v.fromId);
  const t = getMeta(v.toId);
  if (v.type === 'pair' || v.value === undefined) {
    return \`\${f.slug}-to-\${t.slug}\`;
  }
  return \`\${v.value}-\${f.slug}-to-\${t.slug}\`;
}

function parseSlug(slug: string): ${pascalName}Variant | null {
  const exactMatch = slug.match(EXACT_SLUG_RE);
  if (exactMatch) {
    const value = parseFloat(exactMatch[1]);
    if (isNaN(value) || value <= 0) return null;
    const fromId = SLUG_TO_ID.get(exactMatch[2]);
    const toId = SLUG_TO_ID.get(exactMatch[3]);
    if (!fromId || !toId || fromId === toId) return null;
    return { type: 'exact', value, fromId, toId };
  }

  const pairMatch = slug.match(PAIR_SLUG_RE);
  if (pairMatch) {
    const fromId = SLUG_TO_ID.get(pairMatch[1]);
    const toId = SLUG_TO_ID.get(pairMatch[2]);
    if (!fromId || !toId || fromId === toId) return null;
    return { type: 'pair', value: 1, fromId, toId };
  }

  return null;
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString('en-US');
  return parseFloat(n.toPrecision(6)).toLocaleString('en-US', { maximumFractionDigits: 6 });
}

export const ${camelName}SeoProvider: SeoPageProvider<${pascalName}Variant> = {
  getStaticPages(): ${pascalName}Variant[] {
    const pages: ${pascalName}Variant[] = [];
    for (const pair of CONVERSION_PAIRS) {
      pages.push({ type: 'pair', value: 1, fromId: pair.from, toId: pair.to });
      for (const value of CURATED_VALUES) {
        pages.push({ type: 'exact', value, fromId: pair.from, toId: pair.to });
      }
    }
    return pages;
  },

  parseVariant(slug: string): ${pascalName}Variant | null {
    return parseSlug(slug);
  },

  getSlug(data: ${pascalName}Variant): string {
    return buildSlug(data);
  },

  isIndexable(data: ${pascalName}Variant): boolean {
    const isPairKnown = CONVERSION_PAIRS.some((p) => p.from === data.fromId && p.to === data.toId);
    if (!isPairKnown) return false;
    if (data.type === 'pair' || data.value === undefined) return true;
    return CURATED_VALUES.includes(data.value);
  },

  getMetadata(data: ${pascalName}Variant) {
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    if (data.type === 'pair' || data.value === undefined) {
      return {
        title: \`Convert \${f.plural} to \${t.plural} – ${name}\`,
        description: \`Convert \${f.plural.toLowerCase()} to \${t.plural.toLowerCase()} instantly. Free online calculator with formulas & conversion tables.\`,
        h1: \`\${f.singular} to \${t.singular} Converter\`,
      };
    }

    const val = data.value;
    const res = convert${pascalName}(val, data.fromId, data.toId);
    const fromLabel = val === 1 ? f.singular : f.plural;
    const toLabel = res === 1 ? t.singular : t.plural;
    const fromFormatted = formatNumber(val);
    const toFormatted = formatNumber(res);

    return {
      title: \`\${fromFormatted} \${fromLabel} to \${toLabel} – ${name}\`,
      description: \`\${fromFormatted} \${fromLabel} = \${toFormatted} \${toLabel}. Convert \${f.plural.toLowerCase()} to \${t.plural.toLowerCase()} instantly with formula & conversion table.\`,
      h1: \`\${fromFormatted} \${fromLabel} to \${toLabel}\`,
    };
  },

  compute(data: ${pascalName}Variant) {
    const val = data.value ?? 1;
    const res = convert${pascalName}(val, data.fromId, data.toId);
    const factor = convert${pascalName}(1, data.fromId, data.toId);
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    const fromLabel = val === 1 ? f.singular : f.plural;
    const toLabel = res === 1 ? t.singular : t.plural;
    const fromFormatted = formatNumber(val);
    const toFormatted = formatNumber(res);
    const factorFormatted = formatNumber(factor);

    return {
      answer: \`\${fromFormatted} \${fromLabel} = \${toFormatted} \${toLabel}\`,
      formula: \`1 \${f.singular} = \${factorFormatted} \${t.plural}\`,
      steps: \`\${fromFormatted} × \${factorFormatted} = \${toFormatted}\`,
    };
  },

  getBreadcrumbParent(data: ${pascalName}Variant): BreadcrumbParent | null {
    if (data.type === 'pair' || data.value === undefined) return null;
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    return {
      slug: \`\${f.slug}-to-\${t.slug}\`,
      name: \`\${f.singular} to \${t.singular}\`,
    };
  },

  getSections(data: ${pascalName}Variant): SeoSection[] {
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    const val = data.value ?? 1;
    const isPairPage = data.type === 'pair' || data.value === undefined;

    const sections: SeoSection[] = [];
    const factor = convert${pascalName}(1, data.fromId, data.toId);
    const factorFormatted = formatNumber(factor);

    sections.push({
      title: 'How to Convert',
      type: 'cards',
      cards: [
        { label: 'Formula', value: \`1 \${f.singular} = \${factorFormatted} \${t.plural}\` },
        { label: 'Calculation', value: \`\${val} × \${factorFormatted} = \${formatNumber(convert${pascalName}(val, data.fromId, data.toId))} \${t.symbol}\` },
      ],
    });

    if (isPairPage) {
      const sampleValues = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 100];
      const rows = sampleValues.map((v) => ({
        from: \`\${v} \${f.symbol}\`,
        to: \`\${formatNumber(convert${pascalName}(v, data.fromId, data.toId))} \${t.symbol}\`,
        slug: \`\${v}-\${f.slug}-to-\${t.slug}\`,
      }));
      sections.push({
        title: \`\${f.plural} to \${t.plural} Conversion Table\`,
        type: 'table',
        table: { headers: [f.plural, t.plural], rows },
      });
    } else {
      const curIndex = CURATED_VALUES.indexOf(val);
      const start = Math.max(0, curIndex - 3);
      const nearbySlice = CURATED_VALUES.slice(start, start + 7);
      const rows = nearbySlice.map((v) => ({
        from: \`\${v} \${f.symbol}\`,
        to: \`\${formatNumber(convert${pascalName}(v, data.fromId, data.toId))} \${t.symbol}\`,
        slug: \`\${v}-\${f.slug}-to-\${t.slug}\`,
        isCurrent: v === val,
      }));
      sections.push({
        title: \`Nearby \${f.plural} to \${t.plural} Conversions\`,
        type: 'table',
        table: { headers: [f.plural, t.plural], rows },
      });
    }

    const reversePair = { from: data.toId, to: data.fromId };
    const otherPairs = CONVERSION_PAIRS.filter((p) => !(p.from === data.fromId && p.to === data.toId)).slice(0, 4);
    const linkItems = [reversePair, ...otherPairs].map((p) => {
      const fm = getMeta(p.from);
      const tm = getMeta(p.to);
      return { slug: \`\${fm.slug}-to-\${tm.slug}\`, label: \`\${fm.singular} to \${tm.singular}\` };
    });

    sections.push({
      title: 'Related Conversions',
      type: 'links',
      links: linkItems,
    });

    return sections;
  },

  getNearbyVariants(data: ${pascalName}Variant): ${pascalName}Variant[] {
    const val = data.value ?? 1;
    return CURATED_VALUES
      .filter((v) => v !== val)
      .sort((a, b) => Math.abs(a - val) - Math.abs(b - val))
      .slice(0, 6)
      .sort((a, b) => a - b)
      .map((value) => ({ type: 'exact', value, fromId: data.fromId, toId: data.toId }));
  },
};
`
  );

  // 4. React Tool Component
  fs.writeFileSync(
    path.join(toolDir, `${componentName}.tsx`),
    `import React, { useState, useEffect } from 'react';
import { ConverterLayout } from '@/components/tool-ui/archetypes/ConverterLayout';
import { ${pascalName.toUpperCase()}_UNITS, convert${pascalName} } from './${slug}';
import { parseUrlParams, updateUrlParams } from '@/lib/url-state';
import { track } from '@/lib/analytics';

export interface ${componentName}Props {
  initialAmount?: number;
  initialFromId?: string;
  initialToId?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  initialAmount = 1,
  initialFromId = 'base-unit',
  initialToId = 'sub-unit',
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [fromId, setFromId] = useState<string>(initialFromId);
  const [toId, setToId] = useState<string>(initialToId);

  useEffect(() => {
    const params = parseUrlParams();
    if (params.value && !isNaN(Number(params.value))) {
      setAmount(Number(params.value));
    }
    if (params.from && ${pascalName.toUpperCase()}_UNITS.some((u) => u.id === params.from)) {
      setFromId(params.from);
    }
    if (params.to && ${pascalName.toUpperCase()}_UNITS.some((u) => u.id === params.to)) {
      setToId(params.to);
    }
    track('tool_open', { tool_key: '${toolKey}', category: '${namespace}' });
  }, []);

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
    updateUrlParams({ value: newAmount, from: fromId, to: toId });
  };

  const handleFromChange = (newFrom: string) => {
    setFromId(newFrom);
    updateUrlParams({ value: amount, from: newFrom, to: toId });
  };

  const handleToChange = (newTo: string) => {
    setToId(newTo);
    updateUrlParams({ value: amount, from: fromId, to: newTo });
  };

  const handleSwap = () => {
    const nextFrom = toId;
    const nextTo = fromId;
    setFromId(nextFrom);
    setToId(nextTo);
    updateUrlParams({ value: amount, from: nextFrom, to: nextTo });
  };

  const result = convert${pascalName}(amount, fromId, toId);
  const fromUnit = ${pascalName.toUpperCase()}_UNITS.find((u) => u.id === fromId) || ${pascalName.toUpperCase()}_UNITS[0];
  const toUnit = ${pascalName.toUpperCase()}_UNITS.find((u) => u.id === toId) || ${pascalName.toUpperCase()}_UNITS[1];

  const formatValue = (num: number): string => {
    if (Number.isInteger(num)) return num.toLocaleString('en-US');
    return parseFloat(num.toPrecision(7)).toLocaleString('en-US', { maximumFractionDigits: 7 });
  };

  const formattedResult = \`\${formatValue(result)} \${toUnit.symbol}\`;
  const factor = convert${pascalName}(1, fromId, toId);
  const formula = \`1 \${fromUnit.symbol} = \${formatValue(factor)} \${toUnit.symbol}\`;
  const steps = \`\${amount} \${fromUnit.symbol} × \${formatValue(factor)} = \${formattedResult}\`;

  const units = ${pascalName.toUpperCase()}_UNITS.map((u) => ({
    id: u.id,
    name: u.name,
    symbol: u.symbol,
  }));

  return (
    <ConverterLayout
      title="${name}"
      amount={amount}
      onAmountChange={handleAmountChange}
      fromId={fromId}
      onFromChange={handleFromChange}
      toId={toId}
      onToChange={handleToChange}
      units={units}
      result={result}
      formattedResult={formattedResult}
      formula={formula}
      steps={steps}
      onSwap={handleSwap}
    />
  );
};
`
  );

  // 5. Index Module Definition
  fs.writeFileSync(
    path.join(toolDir, 'index.ts'),
    `import type { ToolModule } from '@/tools/tool-module';
import { ${camelName}ConfigSchema } from './config';
import { ${camelName}SeoProvider } from './seo';

export const toolModule: ToolModule = {
  key: '${toolKey}',
  pattern: 'converter',
  privacyMode: 'local',
  analytics: {
    category: '${namespace}',
    actionType: 'convert',
  },
  configSchema: ${camelName}ConfigSchema,
  seoPages: ${camelName}SeoProvider,
};
`
  );

  // 6. Renderer.astro
  fs.writeFileSync(
    path.join(toolDir, 'Renderer.astro'),
    `---
import { ${componentName} } from './${componentName}';
import type { ${pascalName}Config } from './config';

export interface Props {
  config?: ${pascalName}Config;
  variantData?: {
    value?: number;
    fromId?: string;
    toId?: string;
  };
}

const { config, variantData } = Astro.props;
---

<${componentName}
  client:load
  initialAmount={variantData?.value ?? config?.defaultAmount ?? 1}
  initialFromId={variantData?.fromId ?? config?.defaultFromUnit ?? 'base-unit'}
  initialToId={variantData?.toId ?? config?.defaultToUnit ?? 'sub-unit'}
/>
`
  );

  // 7. Unit Tests
  fs.writeFileSync(
    path.join(toolDir, `${slug}.test.ts`),
    `import { describe, it, expect } from 'vitest';
import { convert${pascalName} } from './${slug}';

describe('${name} Engine', () => {
  it('converts base unit to sub unit correctly', () => {
    const res = convert${pascalName}(1, 'base-unit', 'sub-unit');
    expect(res).toBe(10);
  });

  it('throws error for invalid unit ids', () => {
    expect(() => convert${pascalName}(1, 'base-unit', 'invalid')).toThrow();
  });
});
`
  );

  // 8. Markdown Content File
  fs.writeFileSync(
    path.join(contentDir, `${slug}.md`),
    `---
id: "${toolKey}"
name: "${name}"
namespace: "${namespace}"
summary: "Free online ${name.toLowerCase()} for precision calculations."
status: "published"
createdAt: "${todayDate}"
updatedAt: "${todayDate}"

renderer: "${toolKey}"
pattern: "converter"

seo:
  title: "${name} – Free Online Converter"
  description: "Free online ${name.toLowerCase()}. Instantly convert units with formulas, steps, and conversion tables."
  primaryKeyword: "${name.toLowerCase()}"
  keywords:
    - "${name.toLowerCase()}"
    - "${slug.replace(/-/g, ' ')}"

privacy:
  processing: "local"
  message: "All calculations are processed 100% locally inside your browser."

config:
  defaultAmount: 1
  defaultFromUnit: "base-unit"
  defaultToUnit: "sub-unit"

faq:
  - question: "Are my calculations saved or logged?"
    answer: "No. All calculations run strictly client-side inside your browser."
---

Convert units instantly with step-by-step mathematical formulas.
`
  );
} else {
  // ==========================================
  // TRANSFORM / CODE-EDITOR PATTERN GENERATION
  // ==========================================

  // 1. Engine
  fs.writeFileSync(
    path.join(toolDir, `${slug}.ts`),
    `export interface ${pascalName}Result {
  output: string;
  error?: string;
}

export function process${pascalName}(input: string): ${pascalName}Result {
  if (!input) {
    return { output: '' };
  }
  try {
    return { output: input.trim() };
  } catch (err: any) {
    return { output: '', error: err.message || 'Processing failed' };
  }
}
`
  );

  // 2. Config Schema
  fs.writeFileSync(
    path.join(toolDir, 'config.ts'),
    `import { z } from 'zod';

export const ${camelName}ConfigSchema = z.object({
  defaultInput: z.string().optional(),
});

export type ${pascalName}Config = z.infer<typeof ${camelName}ConfigSchema>;
`
  );

  // 3. React Tool Component (TwoPaneTransform Archetype)
  fs.writeFileSync(
    path.join(toolDir, `${componentName}.tsx`),
    `import React, { useState, useEffect } from 'react';
import { TwoPaneTransform } from '@/components/tool-ui/archetypes/TwoPaneTransform';
import { process${pascalName} } from './${slug}';
import { track, getPayloadSizeBucket } from '@/lib/analytics';

export const ${componentName}: React.FC = () => {
  const [input, setInput] = useState<string>('Sample input text');

  useEffect(() => {
    track('tool_open', { tool_key: '${toolKey}', category: '${namespace}' });
  }, []);

  const res = process${pascalName}(input);

  const handleTransform = () => {
    track('tool_execute', {
      tool_key: '${toolKey}',
      category: '${namespace}',
      action_type: 'transform',
      success: !res.error,
      input_size_bucket: getPayloadSizeBucket(input.length),
      output_size_bucket: getPayloadSizeBucket(res.output.length),
    });
    return res.output;
  };

  return (
    <TwoPaneTransform
      input={input}
      onInputChange={setInput}
      output={res.output}
      inputTitle="Input"
      outputTitle="Output"
      inputPlaceholder="Paste or type text here..."
      outputPlaceholder="Processed result will appear here..."
      onTransform={handleTransform}
      errorMessage={res.error}
    />
  );
};
`
  );

  // 4. Index Module Definition
  fs.writeFileSync(
    path.join(toolDir, 'index.ts'),
    `import type { ToolModule } from '@/tools/tool-module';
import { ${camelName}ConfigSchema } from './config';

export const toolModule: ToolModule = {
  key: '${toolKey}',
  pattern: 'code-editor',
  privacyMode: 'local',
  analytics: {
    category: '${namespace}',
    actionType: 'transform',
  },
  configSchema: ${camelName}ConfigSchema,
};
`
  );

  // 5. Renderer.astro
  fs.writeFileSync(
    path.join(toolDir, 'Renderer.astro'),
    `---
import { ${componentName} } from './${componentName}';
---

<${componentName} client:load />
`
  );

  // 6. Unit Tests
  fs.writeFileSync(
    path.join(toolDir, `${slug}.test.ts`),
    `import { describe, it, expect } from 'vitest';
import { process${pascalName} } from './${slug}';

describe('${name} Engine', () => {
  it('processes text input correctly', () => {
    const res = process${pascalName}('  test input  ');
    expect(res.output).toBe('test input');
    expect(res.error).toBeUndefined();
  });

  it('handles empty input gracefully', () => {
    const res = process${pascalName}('');
    expect(res.output).toBe('');
    expect(res.error).toBeUndefined();
  });
});
`
  );

  // 7. Markdown Content File
  fs.writeFileSync(
    path.join(contentDir, `${slug}.md`),
    `---
id: "${toolKey}"
name: "${name}"
namespace: "${namespace}"
summary: "Free online ${name.toLowerCase()} processing locally inside your browser."
status: "published"
createdAt: "${todayDate}"
updatedAt: "${todayDate}"

renderer: "${toolKey}"
pattern: "code-editor"

seo:
  title: "${name} – Free Online Utility"
  description: "Free online ${name.toLowerCase()}. Process data instantly in your browser with zero tracking."
  primaryKeyword: "${name.toLowerCase()}"
  keywords:
    - "${name.toLowerCase()}"
    - "${slug.replace(/-/g, ' ')}"

privacy:
  processing: "local"
  message: "Your input text is processed 100% locally inside your browser memory."

config: {}

faq:
  - question: "Is my data sent to any server?"
    answer: "No. All processing happens 100% locally in your browser memory."
---

Perform text and data transformations instantly with zero server roundtrips.
`
  );
}

console.log(`\n🚀 Successfully automated file creation for tool '${toolKey}' (Pattern: ${patternArg}):`);
console.log(`   - ${toolDir}/config.ts`);
console.log(`   - ${toolDir}/index.ts`);
console.log(`   - ${toolDir}/Renderer.astro`);
console.log(`   - ${toolDir}/${componentName}.tsx`);
console.log(`   - ${toolDir}/${slug}.ts`);
console.log(`   - ${toolDir}/${slug}.test.ts`);
if (patternArg === 'converter') {
  console.log(`   - ${toolDir}/seo.ts`);
}
console.log(`   - ${contentDir}/${slug}.md\n`);
