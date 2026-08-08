import type { SeoPageProvider, SeoSection, BreadcrumbParent } from '@/tools/tool-module';
import { convertTime } from './time';

export interface TimeVariant {
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
  { id: 'second', singular: 'Second', plural: 'Seconds', slug: 'second', symbol: 's' },
  { id: 'minute', singular: 'Minute', plural: 'Minutes', slug: 'minute', symbol: 'min' },
  { id: 'hour', singular: 'Hour', plural: 'Hours', slug: 'hour', symbol: 'hr' },
  { id: 'day', singular: 'Day', plural: 'Days', slug: 'day', symbol: 'd' },
  { id: 'week', singular: 'Week', plural: 'Weeks', slug: 'week', symbol: 'wk' },
];

function getMeta(id: string): UnitMeta {
  const m = UNIT_META.find((u) => u.id === id);
  if (!m) throw new Error(`Unknown time unit: ${id}`);
  return m;
}

const CONVERSION_PAIRS = [
  { from: 'hour', to: 'minute' },
  { from: 'minute', to: 'hour' },
  { from: 'minute', to: 'second' },
  { from: 'second', to: 'minute' },
  { from: 'day', to: 'hour' },
  { from: 'hour', to: 'day' },
  { from: 'week', to: 'day' },
  { from: 'day', to: 'week' },
  { from: 'hour', to: 'second' },
  { from: 'second', to: 'hour' },
  { from: 'day', to: 'minute' },
  { from: 'minute', to: 'day' },
];

const CURATED_VALUES = [
  ...Array.from({ length: 50 }, (_, i) => i + 1),
  60, 100, 250, 500, 1000,
];

const SLUG_TO_ID = new Map(UNIT_META.map((u) => [u.slug, u.id]));
const EXACT_SLUG_RE = /^(\d+(?:\.\d+)?)-([a-z-]+)-to-([a-z-]+)$/;
const PAIR_SLUG_RE = /^([a-z-]+)-to-([a-z-]+)$/;

function buildSlug(v: TimeVariant): string {
  const f = getMeta(v.fromId);
  const t = getMeta(v.toId);
  if (v.type === 'pair' || v.value === undefined) {
    return `${f.slug}-to-${t.slug}`;
  }
  return `${v.value}-${f.slug}-to-${t.slug}`;
}

function parseSlug(slug: string): TimeVariant | null {
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

export const timeSeoProvider: SeoPageProvider<TimeVariant> = {
  getStaticPages(): TimeVariant[] {
    const pages: TimeVariant[] = [];
    for (const pair of CONVERSION_PAIRS) {
      pages.push({ type: 'pair', value: 1, fromId: pair.from, toId: pair.to });
      for (const value of CURATED_VALUES) {
        pages.push({ type: 'exact', value, fromId: pair.from, toId: pair.to });
      }
    }
    return pages;
  },

  parseVariant(slug: string): TimeVariant | null {
    return parseSlug(slug);
  },

  getSlug(data: TimeVariant): string {
    return buildSlug(data);
  },

  isIndexable(data: TimeVariant): boolean {
    const isPairKnown = CONVERSION_PAIRS.some((p) => p.from === data.fromId && p.to === data.toId);
    if (!isPairKnown) return false;
    if (data.type === 'pair' || data.value === undefined) return true;
    return CURATED_VALUES.includes(data.value);
  },

  getMetadata(data: TimeVariant) {
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    if (data.type === 'pair' || data.value === undefined) {
      return {
        title: `Convert ${f.plural} to ${t.plural} (${f.symbol} to ${t.symbol}) – Time Converter`,
        description: `Convert ${f.plural.toLowerCase()} to ${t.plural.toLowerCase()} instantly. Free online time calculator with formula & conversion tables.`,
        h1: `${f.singular} to ${t.singular} Converter`,
      };
    }

    const val = data.value;
    const res = convertTime(val, data.fromId, data.toId);
    const fromLabel = val === 1 ? f.singular : f.plural;
    const toLabel = res === 1 ? t.singular : t.plural;
    const fromFormatted = formatNumber(val);
    const toFormatted = formatNumber(res);

    return {
      title: `${fromFormatted} ${fromLabel} to ${toLabel} – Time Conversion`,
      description: `${fromFormatted} ${fromLabel} = ${toFormatted} ${toLabel}. Convert ${f.plural.toLowerCase()} to ${t.plural.toLowerCase()} instantly with formula & conversion table.`,
      h1: `${fromFormatted} ${fromLabel} to ${toLabel}`,
    };
  },

  compute(data: TimeVariant) {
    const val = data.value ?? 1;
    const res = convertTime(val, data.fromId, data.toId);
    const factor = convertTime(1, data.fromId, data.toId);
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

  getBreadcrumbParent(data: TimeVariant): BreadcrumbParent | null {
    if (data.type === 'pair' || data.value === undefined) return null;
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    return {
      slug: `${f.slug}-to-${t.slug}`,
      name: `${f.singular} to ${t.singular}`,
    };
  },

  getSections(data: TimeVariant): SeoSection[] {
    const f = getMeta(data.fromId);
    const t = getMeta(data.toId);
    const val = data.value ?? 1;
    const isPairPage = data.type === 'pair' || data.value === undefined;

    const sections: SeoSection[] = [];
    const factor = convertTime(1, data.fromId, data.toId);
    const factorFormatted = formatNumber(factor);

    sections.push({
      title: 'How to Convert',
      type: 'cards',
      cards: [
        { label: 'Formula', value: `1 ${f.singular} = ${factorFormatted} ${t.plural}` },
        { label: 'Calculation', value: `${val} × ${factorFormatted} = ${formatNumber(convertTime(val, data.fromId, data.toId))} ${t.symbol}` },
      ],
    });

    if (isPairPage) {
      const sampleValues = [1, 2, 5, 10, 15, 20, 24, 30, 48, 60, 100];
      const rows = sampleValues.map((v) => ({
        from: `${v} ${f.symbol}`,
        to: `${formatNumber(convertTime(v, data.fromId, data.toId))} ${t.symbol}`,
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
        to: `${formatNumber(convertTime(v, data.fromId, data.toId))} ${t.symbol}`,
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

  getNearbyVariants(data: TimeVariant): TimeVariant[] {
    const val = data.value ?? 1;
    return CURATED_VALUES
      .filter((v) => v !== val)
      .sort((a, b) => Math.abs(a - val) - Math.abs(b - val))
      .slice(0, 6)
      .sort((a, b) => a - b)
      .map((value) => ({ type: 'exact', value, fromId: data.fromId, toId: data.toId }));
  },
};
