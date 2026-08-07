import type { SeoPageProvider } from '@/tools/tool-module';
import { LENGTH_UNITS, convertUnit } from '@/tools/units/length/convert-length';

// ---------------------------------------------------------------------------
// Variant data shape
// ---------------------------------------------------------------------------

export interface LengthVariant {
  value: number;
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
  slug: string;        // URL-safe lowercase
  symbol: string;
}

const UNIT_META: UnitMeta[] = [
  { id: 'm',  singular: 'Meter',      plural: 'Meters',      slug: 'meter',      symbol: 'm' },
  { id: 'km', singular: 'Kilometer',  plural: 'Kilometers',  slug: 'kilometer',  symbol: 'km' },
  { id: 'cm', singular: 'Centimeter', plural: 'Centimeters', slug: 'centimeter', symbol: 'cm' },
  { id: 'mm', singular: 'Millimeter', plural: 'Millimeters', slug: 'millimeter', symbol: 'mm' },
  { id: 'mi', singular: 'Mile',       plural: 'Miles',       slug: 'mile',       symbol: 'mi' },
  { id: 'yd', singular: 'Yard',       plural: 'Yards',       slug: 'yard',       symbol: 'yd' },
  { id: 'ft', singular: 'Foot',       plural: 'Feet',        slug: 'foot',       symbol: 'ft' },
  { id: 'in', singular: 'Inch',       plural: 'Inches',      slug: 'inch',       symbol: 'in' },
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
  { from: 'm',  to: 'ft' },
  { from: 'ft', to: 'm' },
  { from: 'km', to: 'mi' },
  { from: 'mi', to: 'km' },
  { from: 'cm', to: 'in' },
  { from: 'in', to: 'cm' },
  { from: 'm',  to: 'yd' },
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
// Slug format: "10-meter-to-feet"
// ---------------------------------------------------------------------------

function buildSlug(v: LengthVariant): string {
  const fromMeta = getMeta(v.fromId);
  const toMeta = getMeta(v.toId);
  const fromWord = v.value === 1 ? fromMeta.slug : fromMeta.slug;
  const toWord = toMeta.slug;
  // Always use singular unit name in slug for consistency
  // "10-meter-to-foot", "1-meter-to-foot"
  return `${v.value}-${fromWord}-to-${toWord}`;
}

const SLUG_RE = /^(\d+(?:\.\d+)?)-([a-z]+)-to-([a-z]+)$/;

const SLUG_TO_ID = new Map(UNIT_META.map((u) => [u.slug, u.id]));

function parseSlug(slug: string): LengthVariant | null {
  const match = slug.match(SLUG_RE);
  if (!match) return null;

  const value = parseFloat(match[1]);
  if (isNaN(value) || value <= 0) return null;

  const fromId = SLUG_TO_ID.get(match[2]);
  const toId = SLUG_TO_ID.get(match[3]);
  if (!fromId || !toId || fromId === toId) return null;

  return { value, fromId, toId };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString('en-US');
  // Show up to 6 significant decimals, trim trailing zeros
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
    for (const pair of CONVERSION_PAIRS) {
      for (const value of CURATED_VALUES) {
        pages.push({ value, fromId: pair.from, toId: pair.to });
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
    // Index only curated values from known pairs
    const isPairKnown = CONVERSION_PAIRS.some(
      (p) => p.from === data.fromId && p.to === data.toId
    );
    if (!isPairKnown) return false;
    return CURATED_VALUES.includes(data.value);
  },

  getMetadata(data: LengthVariant) {
    const result = convertUnit(data.value, data.fromId, data.toId, LENGTH_UNITS);
    const fromLabel = unitLabel(data.fromId, data.value);
    const toLabel = unitLabel(data.toId, result);
    const fromFormatted = formatNumber(data.value);
    const toFormatted = formatNumber(result);

    return {
      title: `${fromFormatted} ${fromLabel} to ${toLabel} – Length Conversion`,
      description: `${fromFormatted} ${fromLabel} = ${toFormatted} ${toLabel}. Convert ${getMeta(data.fromId).plural.toLowerCase()} to ${getMeta(data.toId).plural.toLowerCase()} instantly with our free online calculator.`,
      h1: `${fromFormatted} ${fromLabel} to ${toLabel}`,
    };
  },

  compute(data: LengthVariant) {
    const result = convertUnit(data.value, data.fromId, data.toId, LENGTH_UNITS);
    const factor = getConversionFactor(data.fromId, data.toId);
    const fromLabel = unitLabel(data.fromId, data.value);
    const toLabel = unitLabel(data.toId, result);
    const fromFormatted = formatNumber(data.value);
    const toFormatted = formatNumber(result);
    const factorFormatted = formatNumber(factor);

    return {
      answer: `${fromFormatted} ${fromLabel} = ${toFormatted} ${toLabel}`,
      formula: `${getMeta(data.fromId).plural} × ${factorFormatted} = ${getMeta(data.toId).plural}`,
      steps: `${fromFormatted} × ${factorFormatted} = ${toFormatted}`,
    };
  },

  getNearbyVariants(data: LengthVariant): LengthVariant[] {
    const nearby: LengthVariant[] = [];
    const deltas = [-2, -1, 1, 2, 5, 10];
    for (const d of deltas) {
      const v = data.value + d;
      if (v > 0 && v !== data.value) {
        nearby.push({ value: v, fromId: data.fromId, toId: data.toId });
      }
    }
    return nearby;
  },
};
