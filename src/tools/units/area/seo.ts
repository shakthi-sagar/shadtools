import type { SeoPageProvider, SeoSection, BreadcrumbParent } from '@/tools/tool-module';
import { convertArea } from './area';

export interface AreaVariant {
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
  { id: 'sqm', singular: 'Square Meter', plural: 'Square Meters', slug: 'square-meter', symbol: 'm²' },
  { id: 'sqkm', singular: 'Square Kilometer', plural: 'Square Kilometers', slug: 'square-kilometer', symbol: 'km²' },
  { id: 'sqft', singular: 'Square Foot', plural: 'Square Feet', slug: 'square-foot', symbol: 'ft²' },
  { id: 'sqyd', singular: 'Square Yard', plural: 'Square Yards', slug: 'square-yard', symbol: 'yd²' },
  { id: 'sqmi', singular: 'Square Mile', plural: 'Square Miles', slug: 'square-mile', symbol: 'mi²' },
  { id: 'acre', singular: 'Acre', plural: 'Acres', slug: 'acre', symbol: 'ac' },
  { id: 'ha', singular: 'Hectare', plural: 'Hectares', slug: 'hectare', symbol: 'ha' },
];

function getMeta(id: string): UnitMeta {
  const m = UNIT_META.find((u) => u.id === id);
  if (!m) throw new Error(`Unknown area unit: ${id}`);
  return m;
}

const CONVERSION_PAIRS = [
  { from: 'sqm', to: 'sqft' },
  { from: 'sqft', to: 'sqm' },
  { from: 'acre', to: 'sqft' },
  { from: 'sqft', to: 'acre' },
  { from: 'ha', to: 'acre' },
  { from: 'acre', to: 'ha' },
  { from: 'sqkm', to: 'sqmi' },
  { from: 'sqmi', to: 'sqkm' },
];

const CURATED_VALUES = [
  ...Array.from({ length: 50 }, (_, i) => i + 1),
  100, 250, 500, 1000,
];

const SLUG_TO_ID = new Map(UNIT_META.map((u) => [u.slug, u.id]));
const EXACT_SLUG_RE = /^(\d+(?:\.\d+)?)-([a-z-]+)-to-([a-z-]+)$/;
const PAIR_SLUG_RE = /^([a-z-]+)-to-([a-z-]+)$/;

function buildSlug(v: AreaVariant): string {
  const f = getMeta(v.fromId);
  const t = getMeta(v.toId);
  if (v.type === 'pair' || v.value === undefined) {
    return `${f.slug}-to-${t.slug}`;
  }
  return `${v.value}-${f.slug}-to-${t.slug}`;
}

function parseSlug(slug: string): AreaVariant | null {
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

export const areaSeoProvider: SeoPageProvider<AreaVariant> = {
  getStaticPages(): AreaVariant[] {
    const pages: AreaVariant[] = [];
    for (const pair of CONVERSION_PAIRS) {
      pages.push({ type: 'pair', value: 1, fromId: pair.from, toId: pair.to });
      for (const value of CURATED_VALUES) {
        pages.push({ type: 'exact', value, fromId: pair.from, toId: pair.to });
      }
    }
    return pages;
  },

  parseVariant(slug: string): AreaVariant | null {
    return parseSlug(slug);
  },

  getSlug(data: AreaVariant): string {
    return buildSlug(data);
  },

  isIndexable(data: AreaVariant): boolean {
    const isPairKnown = CONVERSION_PAIRS.some((p) => p.from === data.fromId && p.to === data.toId);
    if (!isPairKnown) return false;
    if (data.type === 'pair' || data.value === undefined) return true;
    return CURATED_VALUES.includes(data.value);
  },

  getMetadata(data: AreaVariant) {
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    if (data.type === 'pair' || data.value === undefined) {
      return {
        title: `Convert ${f.plural} to ${t.plural} (${f.symbol} to ${t.symbol}) – Area Converter`,
        description: `Convert ${f.plural.toLowerCase()} to ${t.plural.toLowerCase()} instantly. Free online area calculator with formula & conversion tables.`,
        h1: `${f.singular} to ${t.singular} Converter`,
      };
    }

    const val = data.value;
    const res = convertArea(val, data.fromId, data.toId);
    const fromLabel = val === 1 ? f.singular : f.plural;
    const toLabel = res === 1 ? t.singular : t.plural;
    const fromFormatted = formatNumber(val);
    const toFormatted = formatNumber(res);

    return {
      title: `${fromFormatted} ${fromLabel} to ${toLabel} – Area Conversion`,
      description: `${fromFormatted} ${fromLabel} = ${toFormatted} ${toLabel}. Convert ${f.plural.toLowerCase()} to ${t.plural.toLowerCase()} instantly with formula & conversion table.`,
      h1: `${fromFormatted} ${fromLabel} to ${toLabel}`,
    };
  },

  compute(data: AreaVariant) {
    const val = data.value ?? 1;
    const res = convertArea(val, data.fromId, data.toId);
    const factor = convertArea(1, data.fromId, data.toId);
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

  getBreadcrumbParent(data: AreaVariant): BreadcrumbParent | null {
    if (data.type === 'pair' || data.value === undefined) return null;
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    return {
      slug: `${f.slug}-to-${t.slug}`,
      name: `${f.singular} to ${t.singular}`,
    };
  },

  getSections(data: AreaVariant): SeoSection[] {
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    const val = data.value ?? 1;
    const isPairPage = data.type === 'pair' || data.value === undefined;

    const sections: SeoSection[] = [];
    const factor = convertArea(1, data.fromId, data.toId);
    const factorFormatted = formatNumber(factor);

    sections.push({
      title: 'How to Convert',
      type: 'cards',
      cards: [
        { label: 'Formula', value: `1 ${f.singular} = ${factorFormatted} ${t.plural}` },
        { label: 'Calculation', value: `${val} × ${factorFormatted} = ${formatNumber(convertArea(val, data.fromId, data.toId))} ${t.symbol}` },
      ],
    });

    if (isPairPage) {
      const sampleValues = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 100];
      const rows = sampleValues.map((v) => ({
        from: `${v} ${f.symbol}`,
        to: `${formatNumber(convertArea(v, data.fromId, data.toId))} ${t.symbol}`,
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
        to: `${formatNumber(convertArea(v, data.fromId, data.toId))} ${t.symbol}`,
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

  getNearbyVariants(data: AreaVariant): AreaVariant[] {
    const val = data.value ?? 1;
    return CURATED_VALUES
      .filter((v) => v !== val)
      .sort((a, b) => Math.abs(a - val) - Math.abs(b - val))
      .slice(0, 6)
      .sort((a, b) => a - b)
      .map((value) => ({ type: 'exact', value, fromId: data.fromId, toId: data.toId }));
  },
};
