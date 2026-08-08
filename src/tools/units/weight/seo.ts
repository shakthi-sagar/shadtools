import type { SeoPageProvider, SeoSection, BreadcrumbParent } from '@/tools/tool-module';
import { convertWeight } from './weight';

export interface WeightVariant {
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
  { id: 'kg', singular: 'Kilogram', plural: 'Kilograms', slug: 'kilogram', symbol: 'kg' },
  { id: 'g', singular: 'Gram', plural: 'Grams', slug: 'gram', symbol: 'g' },
  { id: 'mg', singular: 'Milligram', plural: 'Milligrams', slug: 'milligram', symbol: 'mg' },
  { id: 'lb', singular: 'Pound', plural: 'Pounds', slug: 'pound', symbol: 'lb' },
  { id: 'oz', singular: 'Ounce', plural: 'Ounces', slug: 'ounce', symbol: 'oz' },
  { id: 'st', singular: 'Stone', plural: 'Stones', slug: 'stone', symbol: 'st' },
];

function getMeta(id: string): UnitMeta {
  const m = UNIT_META.find((u) => u.id === id);
  if (!m) throw new Error(`Unknown weight unit: ${id}`);
  return m;
}

const CONVERSION_PAIRS = [
  { from: 'lb', to: 'kg' },
  { from: 'kg', to: 'lb' },
  { from: 'oz', to: 'g' },
  { from: 'g', to: 'oz' },
  { from: 'kg', to: 'g' },
  { from: 'g', to: 'kg' },
  { from: 'st', to: 'kg' },
  { from: 'kg', to: 'st' },
];

const CURATED_VALUES = [
  ...Array.from({ length: 100 }, (_, i) => i + 1),
  250,
  500,
  1000,
];

const SLUG_TO_ID = new Map(UNIT_META.map((u) => [u.slug, u.id]));
const EXACT_SLUG_RE = /^(\d+(?:\.\d+)?)-([a-z]+)-to-([a-z]+)$/;
const PAIR_SLUG_RE = /^([a-z]+)-to-([a-z]+)$/;

function buildSlug(v: WeightVariant): string {
  const f = getMeta(v.fromId);
  const t = getMeta(v.toId);
  if (v.type === 'pair' || v.value === undefined) {
    return `${f.slug}-to-${t.slug}`;
  }
  return `${v.value}-${f.slug}-to-${t.slug}`;
}

function parseSlug(slug: string): WeightVariant | null {
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
  return parseFloat(n.toPrecision(6)).toLocaleString('en-US', {
    maximumFractionDigits: 6,
  });
}

export const weightSeoProvider: SeoPageProvider<WeightVariant> = {
  getStaticPages(): WeightVariant[] {
    const pages: WeightVariant[] = [];
    for (const pair of CONVERSION_PAIRS) {
      pages.push({ type: 'pair', value: 1, fromId: pair.from, toId: pair.to });
      for (const value of CURATED_VALUES) {
        pages.push({ type: 'exact', value, fromId: pair.from, toId: pair.to });
      }
    }
    return pages;
  },

  parseVariant(slug: string): WeightVariant | null {
    return parseSlug(slug);
  },

  getSlug(data: WeightVariant): string {
    return buildSlug(data);
  },

  isIndexable(data: WeightVariant): boolean {
    const isPairKnown = CONVERSION_PAIRS.some((p) => p.from === data.fromId && p.to === data.toId);
    if (!isPairKnown) return false;
    if (data.type === 'pair' || data.value === undefined) return true;
    return CURATED_VALUES.includes(data.value);
  },

  getMetadata(data: WeightVariant) {
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    if (data.type === 'pair' || data.value === undefined) {
      return {
        title: `Convert ${f.plural} to ${t.plural} (${f.symbol} to ${t.symbol}) – Weight Converter`,
        description: `Convert ${f.plural.toLowerCase()} to ${t.plural.toLowerCase()} instantly. Free online ${f.singular.toLowerCase()} to ${t.singular.toLowerCase()} calculator with formula & conversion tables.`,
        h1: `${f.singular} to ${t.singular} Converter`,
      };
    }

    const val = data.value;
    const res = convertWeight(val, data.fromId, data.toId);
    const fromLabel = val === 1 ? f.singular : f.plural;
    const toLabel = res === 1 ? t.singular : t.plural;
    const fromFormatted = formatNumber(val);
    const toFormatted = formatNumber(res);

    return {
      title: `${fromFormatted} ${fromLabel} to ${toLabel} – Weight Conversion`,
      description: `${fromFormatted} ${fromLabel} = ${toFormatted} ${toLabel}. Convert ${f.plural.toLowerCase()} to ${t.plural.toLowerCase()} instantly with formula & conversion table.`,
      h1: `${fromFormatted} ${fromLabel} to ${toLabel}`,
    };
  },

  compute(data: WeightVariant) {
    const val = data.value ?? 1;
    const res = convertWeight(val, data.fromId, data.toId);
    const factor = convertWeight(1, data.fromId, data.toId);
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    const fromLabel = val === 1 ? f.singular : f.plural;
    const toLabel = res === 1 ? t.singular : t.plural;
    const fromFormatted = formatNumber(val);
    const toFormatted = formatNumber(res);
    const factorFormatted = formatNumber(factor);

    return {
      answer: `${fromFormatted} ${fromLabel} = ${toFormatted} ${toLabel}`,
      formula: `1 ${f.singular} = ${factorFormatted} ${t.plural}`,
      steps: `${fromFormatted} × ${factorFormatted} = ${toFormatted}`,
    };
  },

  getBreadcrumbParent(data: WeightVariant): BreadcrumbParent | null {
    if (data.type === 'pair' || data.value === undefined) return null;
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    return {
      slug: `${f.slug}-to-${t.slug}`,
      name: `${f.singular} to ${t.singular}`,
    };
  },

  getSections(data: WeightVariant): SeoSection[] {
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    const val = data.value ?? 1;
    const isPairPage = data.type === 'pair' || data.value === undefined;

    const sections: SeoSection[] = [];
    const factor = convertWeight(1, data.fromId, data.toId);
    const factorFormatted = formatNumber(factor);

    sections.push({
      title: 'How to Convert',
      type: 'cards',
      cards: [
        { label: 'Formula', value: `1 ${f.singular} = ${factorFormatted} ${t.plural}` },
        { label: 'Calculation', value: `${val} × ${factorFormatted} = ${formatNumber(convertWeight(val, data.fromId, data.toId))} ${t.symbol}` },
      ],
    });

    if (isPairPage) {
      const sampleValues = [1, 2, 5, 10, 15, 20, 25, 50, 75, 100];
      const rows = sampleValues.map((v) => ({
        from: `${v} ${f.symbol}`,
        to: `${formatNumber(convertWeight(v, data.fromId, data.toId))} ${t.symbol}`,
        slug: `${v}-${f.slug}-to-${t.slug}`,
      }));
      sections.push({
        title: `${f.plural} to ${t.plural} Conversion Table`,
        type: 'table',
        table: { headers: [f.plural, t.plural], rows },
      });
    } else {
      const curIndex = CURATED_VALUES.indexOf(val);
      const start = Math.max(0, curIndex - 3);
      const nearbySlice = CURATED_VALUES.slice(start, start + 7);
      const rows = nearbySlice.map((v) => ({
        from: `${v} ${f.symbol}`,
        to: `${formatNumber(convertWeight(v, data.fromId, data.toId))} ${t.symbol}`,
        slug: `${v}-${f.slug}-to-${t.slug}`,
        isCurrent: v === val,
      }));
      sections.push({
        title: `Nearby ${f.plural} to ${t.plural} Conversions`,
        type: 'table',
        table: { headers: [f.plural, t.plural], rows },
      });
    }

    const reversePair = { from: data.toId, to: data.fromId };
    const otherPairs = CONVERSION_PAIRS.filter(
      (p) =>
        !(p.from === data.fromId && p.to === data.toId) &&
        !(p.from === data.toId && p.to === data.fromId)
    ).slice(0, 5);
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

  getNearbyVariants(data: WeightVariant): WeightVariant[] {
    const val = data.value ?? 1;
    return CURATED_VALUES
      .filter((v) => v !== val)
      .sort((a, b) => Math.abs(a - val) - Math.abs(b - val))
      .slice(0, 6)
      .sort((a, b) => a - b)
      .map((value) => ({ type: 'exact', value, fromId: data.fromId, toId: data.toId }));
  },
};
