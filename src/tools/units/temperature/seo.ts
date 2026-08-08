import type { SeoPageProvider, SeoSection, BreadcrumbParent } from '@/tools/tool-module';
import { convertTemperature } from './temperature';

export interface TempVariant {
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
  { id: 'C', singular: 'Celsius', plural: 'Celsius', slug: 'celsius', symbol: '°C' },
  { id: 'F', singular: 'Fahrenheit', plural: 'Fahrenheit', slug: 'fahrenheit', symbol: '°F' },
  { id: 'K', singular: 'Kelvin', plural: 'Kelvin', slug: 'kelvin', symbol: 'K' },
];

function getMeta(id: string): UnitMeta {
  const m = UNIT_META.find((u) => u.id === id);
  if (!m) throw new Error(`Unknown temp unit: ${id}`);
  return m;
}

const CONVERSION_PAIRS = [
  { from: 'C', to: 'F' },
  { from: 'F', to: 'C' },
  { from: 'C', to: 'K' },
  { from: 'K', to: 'C' },
  { from: 'F', to: 'K' },
  { from: 'K', to: 'F' },
];

const CURATED_VALUES = [
  -40, 0, 10, 20, 25, 32, 37, 50, 75, 100, 150, 200, 212, 300, 500, 1000,
];

const SLUG_TO_ID = new Map(UNIT_META.map((u) => [u.slug, u.id]));
const EXACT_SLUG_RE = /^((-?\d+)(?:\.\d+)?)-([a-z]+)-to-([a-z]+)$/;
const PAIR_SLUG_RE = /^([a-z]+)-to-([a-z]+)$/;

function buildSlug(v: TempVariant): string {
  const f = getMeta(v.fromId);
  const t = getMeta(v.toId);
  if (v.type === 'pair' || v.value === undefined) {
    return `${f.slug}-to-${t.slug}`;
  }
  return `${v.value}-${f.slug}-to-${t.slug}`;
}

function parseSlug(slug: string): TempVariant | null {
  const exactMatch = slug.match(EXACT_SLUG_RE);
  if (exactMatch) {
    const value = parseFloat(exactMatch[1]);
    if (isNaN(value)) return null;
    const fromId = SLUG_TO_ID.get(exactMatch[3]);
    const toId = SLUG_TO_ID.get(exactMatch[4]);
    if (!fromId || !toId || fromId === toId) return null;
    return { type: 'exact', value, fromId, toId };
  }

  const pairMatch = slug.match(PAIR_SLUG_RE);
  if (pairMatch) {
    const fromId = SLUG_TO_ID.get(pairMatch[1]);
    const toId = SLUG_TO_ID.get(pairMatch[2]);
    if (!fromId || !toId || fromId === toId) return null;
    return { type: 'pair', value: 0, fromId, toId };
  }

  return null;
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString('en-US');
  return parseFloat(n.toFixed(4)).toLocaleString('en-US', {
    maximumFractionDigits: 4,
  });
}

function getFormula(fromId: string, toId: string): string {
  if (fromId === 'C' && toId === 'F') return '(°C × 9/5) + 32 = °F';
  if (fromId === 'F' && toId === 'C') return '(°F − 32) × 5/9 = °C';
  if (fromId === 'C' && toId === 'K') return '°C + 273.15 = K';
  if (fromId === 'K' && toId === 'C') return 'K − 273.15 = °C';
  if (fromId === 'F' && toId === 'K') return '(°F − 32) × 5/9 + 273.15 = K';
  if (fromId === 'K' && toId === 'F') return '(K − 273.15) × 9/5 + 32 = °F';
  return '';
}

export const temperatureSeoProvider: SeoPageProvider<TempVariant> = {
  getStaticPages(): TempVariant[] {
    const pages: TempVariant[] = [];
    for (const pair of CONVERSION_PAIRS) {
      pages.push({ type: 'pair', value: 0, fromId: pair.from, toId: pair.to });
      for (const value of CURATED_VALUES) {
        pages.push({ type: 'exact', value, fromId: pair.from, toId: pair.to });
      }
    }
    return pages;
  },

  parseVariant(slug: string): TempVariant | null {
    return parseSlug(slug);
  },

  getSlug(data: TempVariant): string {
    return buildSlug(data);
  },

  isIndexable(data: TempVariant): boolean {
    const isPairKnown = CONVERSION_PAIRS.some((p) => p.from === data.fromId && p.to === data.toId);
    if (!isPairKnown) return false;
    if (data.type === 'pair' || data.value === undefined) return true;
    return CURATED_VALUES.includes(data.value);
  },

  getMetadata(data: TempVariant) {
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    if (data.type === 'pair' || data.value === undefined) {
      return {
        title: `Convert ${f.singular} to ${t.singular} (${f.symbol} to ${t.symbol}) – Temperature Converter`,
        description: `Convert ${f.singular.toLowerCase()} to ${t.singular.toLowerCase()} instantly. Free online temperature conversion calculator with formula, steps & conversion tables.`,
        h1: `${f.singular} to ${t.singular} Converter`,
      };
    }

    const val = data.value;
    const res = convertTemperature(val, data.fromId, data.toId);
    const fromFormatted = formatNumber(val);
    const toFormatted = formatNumber(res);

    return {
      title: `${fromFormatted} ${f.symbol} to ${t.symbol} (${toFormatted} ${t.symbol}) – Temperature Conversion`,
      description: `${fromFormatted} ${f.symbol} = ${toFormatted} ${t.symbol}. Convert ${f.singular.toLowerCase()} to ${t.singular.toLowerCase()} instantly with formula & conversion table.`,
      h1: `${fromFormatted} ${f.symbol} to ${t.symbol}`,
    };
  },

  compute(data: TempVariant) {
    const val = data.value ?? 0;
    const res = convertTemperature(val, data.fromId, data.toId);
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    const formulaStr = getFormula(data.fromId, data.toId);
    const fromFormatted = formatNumber(val);
    const toFormatted = formatNumber(res);

    return {
      answer: `${fromFormatted} ${f.symbol} = ${toFormatted} ${t.symbol}`,
      formula: formulaStr,
      steps: `Apply ${formulaStr}: ${fromFormatted} ${f.symbol} → ${toFormatted} ${t.symbol}`,
    };
  },

  getBreadcrumbParent(data: TempVariant): BreadcrumbParent | null {
    if (data.type === 'pair' || data.value === undefined) return null;
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    return {
      slug: `${f.slug}-to-${t.slug}`,
      name: `${f.singular} to ${t.singular}`,
    };
  },

  getSections(data: TempVariant): SeoSection[] {
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    const val = data.value ?? 0;
    const isPairPage = data.type === 'pair' || data.value === undefined;

    const sections: SeoSection[] = [];
    const formulaStr = getFormula(data.fromId, data.toId);

    sections.push({
      title: 'How to Convert',
      type: 'cards',
      cards: [
        { label: 'Formula', value: formulaStr },
        { label: 'Calculation', value: `${val} ${f.symbol} → ${formatNumber(convertTemperature(val, data.fromId, data.toId))} ${t.symbol}` },
      ],
    });

    if (isPairPage) {
      const sampleValues = [0, 10, 20, 25, 32, 37, 100, 212];
      const rows = sampleValues.map((v) => ({
        from: `${v} ${f.symbol}`,
        to: `${formatNumber(convertTemperature(v, data.fromId, data.toId))} ${t.symbol}`,
        slug: `${v}-${f.slug}-to-${t.slug}`,
      }));
      sections.push({
        title: `${f.singular} to ${t.singular} Conversion Table`,
        type: 'table',
        table: { headers: [f.singular, t.singular], rows },
      });
    } else {
      const curIndex = CURATED_VALUES.indexOf(val);
      const start = Math.max(0, curIndex - 3);
      const nearbySlice = CURATED_VALUES.slice(start, start + 7);
      const rows = nearbySlice.map((v) => ({
        from: `${v} ${f.symbol}`,
        to: `${formatNumber(convertTemperature(v, data.fromId, data.toId))} ${t.symbol}`,
        slug: `${v}-${f.slug}-to-${t.slug}`,
        isCurrent: v === val,
      }));
      sections.push({
        title: `Nearby ${f.singular} to ${t.singular} Conversions`,
        type: 'table',
        table: { headers: [f.singular, t.singular], rows },
      });
    }

    const reversePair = { from: data.toId, to: data.fromId };
    const otherPairs = CONVERSION_PAIRS.filter(
      (p) =>
        !(p.from === data.fromId && p.to === data.toId) &&
        !(p.from === data.toId && p.to === data.fromId)
    ).slice(0, 4);
    const linkItems = [reversePair, ...otherPairs].map((p) => {
      const fm = getMeta(p.from);
      const tm = getMeta(p.to);
      return { slug: `${fm.slug}-to-${tm.slug}`, label: `${fm.singular} to ${tm.singular}` };
    });

    sections.push({
      title: 'Related Conversions',
      type: 'links',
      links: linkItems,
    });

    return sections;
  },

  getNearbyVariants(data: TempVariant): TempVariant[] {
    const val = data.value ?? 0;
    return CURATED_VALUES
      .filter((v) => v !== val)
      .sort((a, b) => Math.abs(a - val) - Math.abs(b - val))
      .slice(0, 6)
      .sort((a, b) => a - b)
      .map((value) => ({ type: 'exact', value, fromId: data.fromId, toId: data.toId }));
  },
};
