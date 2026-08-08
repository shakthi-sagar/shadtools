import type { SeoPageProvider, SeoSection, BreadcrumbParent } from '@/tools/tool-module';
import { LENGTH_UNITS, convertUnit } from '@/tools/units/length/convert-length';

// ---------------------------------------------------------------------------
// Variant data shape
// ---------------------------------------------------------------------------

export interface LengthVariant {
  type?: 'pair' | 'exact';
  value?: number;
  fromId: string;
  toId: string;
}

// ---------------------------------------------------------------------------
// Unit display names (slug-friendly and human-friendly)
// ---------------------------------------------------------------------------

interface UnitMeta {
  id: string;
  singular: string;
  plural: string;
  slug: string; // URL-safe lowercase
  symbol: string;
}

const UNIT_META: UnitMeta[] = [
  { id: 'm', singular: 'Meter', plural: 'Meters', slug: 'meter', symbol: 'm' },
  { id: 'km', singular: 'Kilometer', plural: 'Kilometers', slug: 'kilometer', symbol: 'km' },
  { id: 'cm', singular: 'Centimeter', plural: 'Centimeters', slug: 'centimeter', symbol: 'cm' },
  { id: 'mm', singular: 'Millimeter', plural: 'Millimeters', slug: 'millimeter', symbol: 'mm' },
  { id: 'mi', singular: 'Mile', plural: 'Miles', slug: 'mile', symbol: 'mi' },
  { id: 'yd', singular: 'Yard', plural: 'Yards', slug: 'yard', symbol: 'yd' },
  { id: 'ft', singular: 'Foot', plural: 'Feet', slug: 'foot', symbol: 'ft' },
  { id: 'in', singular: 'Inch', plural: 'Inches', slug: 'inch', symbol: 'in' },
];

function getMeta(id: string): UnitMeta {
  const m = UNIT_META.find((u) => u.id === id);
  if (!m) throw new Error(`Unknown unit id: ${id}`);
  return m;
}

function unitLabel(id: string, value: number): string {
  const m = getMeta(id);
  return value === 1 ? m.singular : m.plural;
}

// ---------------------------------------------------------------------------
// Curated conversion pairs
// ---------------------------------------------------------------------------

interface ConversionPair {
  from: string;
  to: string;
}

const CONVERSION_PAIRS: ConversionPair[] = [
  { from: 'm', to: 'ft' },
  { from: 'ft', to: 'm' },
  { from: 'km', to: 'mi' },
  { from: 'mi', to: 'km' },
  { from: 'cm', to: 'in' },
  { from: 'in', to: 'cm' },
  { from: 'm', to: 'yd' },
  { from: 'yd', to: 'm' },
];

// Curated values: 1-100, then landmark values
const CURATED_VALUES: number[] = [
  ...Array.from({ length: 100 }, (_, i) => i + 1),
  250,
  500,
  1000,
];

// ---------------------------------------------------------------------------
// Slug formats:
// Pair slug: "meter-to-foot"
// Exact slug: "10-meter-to-foot"
// ---------------------------------------------------------------------------

function buildSlug(v: LengthVariant): string {
  const fromMeta = getMeta(v.fromId);
  const toMeta = getMeta(v.toId);
  if (v.type === 'pair' || v.value === undefined) {
    return `${fromMeta.slug}-to-${toMeta.slug}`;
  }
  return `${v.value}-${fromMeta.slug}-to-${toMeta.slug}`;
}

const PAIR_SLUG_RE = /^([a-z]+)-to-([a-z]+)$/;
const EXACT_SLUG_RE = /^(\d+(?:\.\d+)?)-([a-z]+)-to-([a-z]+)$/;

const SLUG_TO_ID = new Map(UNIT_META.map((u) => [u.slug, u.id]));

function parseSlug(slug: string): LengthVariant | null {
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString('en-US');
  return parseFloat(n.toPrecision(6)).toLocaleString('en-US', {
    maximumFractionDigits: 6,
  });
}

function getConversionFactor(fromId: string, toId: string): number {
  const from = LENGTH_UNITS.find((u) => u.id === fromId);
  const to = LENGTH_UNITS.find((u) => u.id === toId);
  if (!from || !to) return 1;
  return from.factor / to.factor;
}

// ---------------------------------------------------------------------------
// SeoPageProvider implementation
// ---------------------------------------------------------------------------

export const lengthSeoProvider: SeoPageProvider<LengthVariant> = {
  getStaticPages(): LengthVariant[] {
    const pages: LengthVariant[] = [];

    // Pair pages (e.g. meter-to-foot)
    for (const pair of CONVERSION_PAIRS) {
      pages.push({ type: 'pair', value: 1, fromId: pair.from, toId: pair.to });
    }

    // Exact value pages (e.g. 10-meter-to-foot)
    for (const pair of CONVERSION_PAIRS) {
      for (const value of CURATED_VALUES) {
        pages.push({ type: 'exact', value, fromId: pair.from, toId: pair.to });
      }
    }
    return pages;
  },

  parseVariant(slug: string): LengthVariant | null {
    return parseSlug(slug);
  },

  getSlug(data: LengthVariant): string {
    return buildSlug(data);
  },

  isIndexable(data: LengthVariant): boolean {
    const isPairKnown = CONVERSION_PAIRS.some(
      (p) => p.from === data.fromId && p.to === data.toId
    );
    if (!isPairKnown) return false;
    if (data.type === 'pair' || data.value === undefined) return true;
    return CURATED_VALUES.includes(data.value);
  },

  getMetadata(data: LengthVariant) {
    const fromMeta = getMeta(data.fromId);
    const toMeta = getMeta(data.toId);

    if (data.type === 'pair' || data.value === undefined) {
      return {
        title: `Convert ${fromMeta.plural} to ${toMeta.plural} (${fromMeta.symbol} to ${toMeta.symbol}) – Length Converter`,
        description: `Convert ${fromMeta.plural.toLowerCase()} to ${toMeta.plural.toLowerCase()} instantly. Free online ${fromMeta.singular.toLowerCase()} to ${toMeta.singular.toLowerCase()} calculator with formula, steps & conversion tables.`,
        h1: `${fromMeta.singular} to ${toMeta.singular} Converter`,
      };
    }

    const val = data.value;
    const result = convertUnit(val, data.fromId, data.toId, LENGTH_UNITS);
    const fromLabel = unitLabel(data.fromId, val);
    const toLabel = unitLabel(data.toId, result);
    const fromFormatted = formatNumber(val);
    const toFormatted = formatNumber(result);

    return {
      title: `${fromFormatted} ${fromLabel} to ${toLabel} – Length Conversion`,
      description: `${fromFormatted} ${fromLabel} = ${toFormatted} ${toLabel}. Convert ${fromMeta.plural.toLowerCase()} to ${toMeta.plural.toLowerCase()} instantly with formula & conversion table.`,
      h1: `${fromFormatted} ${fromLabel} to ${toLabel}`,
    };
  },

  compute(data: LengthVariant) {
    const val = data.value ?? 1;
    const result = convertUnit(val, data.fromId, data.toId, LENGTH_UNITS);
    const factor = getConversionFactor(data.fromId, data.toId);
    const fromLabel = unitLabel(data.fromId, val);
    const toLabel = unitLabel(data.toId, result);
    const fromFormatted = formatNumber(val);
    const toFormatted = formatNumber(result);
    const factorFormatted = formatNumber(factor);

    return {
      answer: `${fromFormatted} ${fromLabel} = ${toFormatted} ${toLabel}`,
      formula: `1 ${getMeta(data.fromId).singular} = ${factorFormatted} ${getMeta(data.toId).plural}`,
      steps: `${fromFormatted} × ${factorFormatted} = ${toFormatted}`,
    };
  },

  getBreadcrumbParent(data: LengthVariant): BreadcrumbParent | null {
    if (data.type === 'pair' || data.value === undefined) return null;
    const fromMeta = getMeta(data.fromId);
    const toMeta = getMeta(data.toId);
    return {
      slug: `${fromMeta.slug}-to-${toMeta.slug}`,
      name: `${fromMeta.singular} to ${toMeta.singular}`,
    };
  },

  getSections(data: LengthVariant): SeoSection[] {
    const fromMeta = getMeta(data.fromId);
    const toMeta = getMeta(data.toId);
    const val = data.value ?? 1;
    const isPairPage = data.type === 'pair' || data.value === undefined;

    const sections: SeoSection[] = [];

    // Formula & Steps Cards Section
    const factor = getConversionFactor(data.fromId, data.toId);
    const factorFormatted = formatNumber(factor);
    sections.push({
      title: 'How to Convert',
      type: 'cards',
      cards: [
        {
          label: 'Formula',
          value: `1 ${fromMeta.singular} = ${factorFormatted} ${toMeta.plural}`,
        },
        {
          label: 'Calculation',
          value: `${val} × ${factorFormatted} = ${formatNumber(convertUnit(val, data.fromId, data.toId, LENGTH_UNITS))} ${toMeta.symbol}`,
        },
      ],
    });

    // Automatic Conversion Table Section
    if (isPairPage) {
      const sampleValues = [1, 2, 5, 10, 15, 20, 25, 50, 75, 100];
      const tableRows = sampleValues.map((v) => {
        const res = convertUnit(v, data.fromId, data.toId, LENGTH_UNITS);
        return {
          from: `${v} ${fromMeta.symbol}`,
          to: `${formatNumber(res)} ${toMeta.symbol}`,
          slug: `${v}-${fromMeta.slug}-to-${toMeta.slug}`,
        };
      });

      sections.push({
        title: `${fromMeta.plural} to ${toMeta.plural} Conversion Table`,
        type: 'table',
        table: {
          headers: [fromMeta.plural, toMeta.plural],
          rows: tableRows,
        },
      });
    } else {
      // Nearby values around current value (e.g. +/- 3)
      const curIndex = CURATED_VALUES.indexOf(val);
      const start = Math.max(0, curIndex - 3);
      const nearbySlice = CURATED_VALUES.slice(start, start + 7);
      const tableRows = nearbySlice.map((v) => {
        const res = convertUnit(v, data.fromId, data.toId, LENGTH_UNITS);
        return {
          from: `${v} ${fromMeta.symbol}`,
          to: `${formatNumber(res)} ${toMeta.symbol}`,
          slug: `${v}-${fromMeta.slug}-to-${toMeta.slug}`,
          isCurrent: v === val,
        };
      });

      sections.push({
        title: `Nearby ${fromMeta.plural} to ${toMeta.plural} Conversions`,
        type: 'table',
        table: {
          headers: [fromMeta.plural, toMeta.plural],
          rows: tableRows,
        },
      });
    }

    // Related Conversions Links
    const reversePair = { from: data.toId, to: data.fromId };
    const otherPairs = CONVERSION_PAIRS.filter(
      (p) =>
        !(p.from === data.fromId && p.to === data.toId) &&
        !(p.from === data.toId && p.to === data.fromId)
    ).slice(0, 5);
    const linkItems = [reversePair, ...otherPairs].map((p) => {
      const f = getMeta(p.from);
      const t = getMeta(p.to);
      return {
        slug: `${f.slug}-to-${t.slug}`,
        label: `${f.singular} to ${t.singular}`,
      };
    });

    sections.push({
      title: 'Related Conversions',
      type: 'links',
      links: linkItems,
    });

    return sections;
  },

  getNearbyVariants(data: LengthVariant): LengthVariant[] {
    const val = data.value ?? 1;
    return CURATED_VALUES
      .filter((v) => v !== val)
      .sort((a, b) => Math.abs(a - val) - Math.abs(b - val))
      .slice(0, 6)
      .sort((a, b) => a - b)
      .map((value) => ({
        type: 'exact',
        value,
        fromId: data.fromId,
        toId: data.toId,
      }));
  },
};
