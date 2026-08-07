import { describe, it, expect } from 'vitest';
import { lengthSeoProvider, type LengthVariant } from '@/tools/units/length/seo';

describe('Length SEO Provider', () => {
  describe('getSlug / parseVariant roundtrip', () => {
    it('builds a pair slug from variant data', () => {
      const slug = lengthSeoProvider.getSlug({ type: 'pair', fromId: 'm', toId: 'ft' });
      expect(slug).toBe('meter-to-foot');
    });

    it('builds an exact slug from variant data', () => {
      const slug = lengthSeoProvider.getSlug({ type: 'exact', value: 10, fromId: 'm', toId: 'ft' });
      expect(slug).toBe('10-meter-to-foot');
    });

    it('parses pair and exact slugs back to variant data', () => {
      const pairVariant = lengthSeoProvider.parseVariant('meter-to-foot');
      expect(pairVariant).toEqual({ type: 'pair', value: 1, fromId: 'm', toId: 'ft' });

      const exactVariant = lengthSeoProvider.parseVariant('10-meter-to-foot');
      expect(exactVariant).toEqual({ type: 'exact', value: 10, fromId: 'm', toId: 'ft' });
    });

    it('roundtrips correctly', () => {
      const original: LengthVariant = { type: 'exact', value: 42, fromId: 'km', toId: 'mi' };
      const slug = lengthSeoProvider.getSlug(original);
      const parsed = lengthSeoProvider.parseVariant(slug);
      expect(parsed).toEqual(original);
    });

    it('returns null for invalid slugs', () => {
      expect(lengthSeoProvider.parseVariant('not-a-real-slug')).toBeNull();
      expect(lengthSeoProvider.parseVariant('')).toBeNull();
      expect(lengthSeoProvider.parseVariant('0-meter-to-foot')).toBeNull();
      expect(lengthSeoProvider.parseVariant('10-meter-to-meter')).toBeNull();
    });
  });

  describe('isIndexable', () => {
    it('returns true for curated values on known pairs', () => {
      expect(lengthSeoProvider.isIndexable({ type: 'exact', value: 1, fromId: 'm', toId: 'ft' })).toBe(true);
      expect(lengthSeoProvider.isIndexable({ type: 'pair', fromId: 'm', toId: 'ft' })).toBe(true);
      expect(lengthSeoProvider.isIndexable({ type: 'exact', value: 100, fromId: 'km', toId: 'mi' })).toBe(true);
    });

    it('returns false for non-curated values', () => {
      expect(lengthSeoProvider.isIndexable({ type: 'exact', value: 999999, fromId: 'm', toId: 'ft' })).toBe(false);
    });
  });

  describe('compute', () => {
    it('computes correct conversion for 1 meter to feet', () => {
      const result = lengthSeoProvider.compute({ type: 'exact', value: 1, fromId: 'm', toId: 'ft' });
      expect(result.answer).toContain('1 Meter');
      expect(result.answer).toContain('Feet');
      expect(result.answer).toContain('3.28084');
    });
  });

  describe('getMetadata & getBreadcrumbParent', () => {
    it('generates proper pair page metadata', () => {
      const meta = lengthSeoProvider.getMetadata({ type: 'pair', fromId: 'm', toId: 'ft' });
      expect(meta.h1).toBe('Meter to Foot Converter');
      expect(meta.title).toContain('Convert Meters to Feet');
      expect(lengthSeoProvider.getBreadcrumbParent!({ type: 'pair', fromId: 'm', toId: 'ft' })).toBeNull();
    });

    it('generates proper exact page metadata and parent breadcrumb', () => {
      const meta = lengthSeoProvider.getMetadata({ type: 'exact', value: 18, fromId: 'm', toId: 'ft' });
      expect(meta.h1).toBe('18 Meters to Feet');
      const parent = lengthSeoProvider.getBreadcrumbParent!({ type: 'exact', value: 18, fromId: 'm', toId: 'ft' });
      expect(parent).toEqual({ slug: 'meter-to-foot', name: 'Meter to Foot' });
    });
  });

  describe('getSections', () => {
    it('returns conversion table section for pair pages', () => {
      const sections = lengthSeoProvider.getSections!({ type: 'pair', fromId: 'm', toId: 'ft' });
      expect(sections.some((s) => s.type === 'table')).toBe(true);
    });

    it('returns nearby conversion table for exact pages', () => {
      const sections = lengthSeoProvider.getSections!({ type: 'exact', value: 18, fromId: 'm', toId: 'ft' });
      const tableSection = sections.find((s) => s.type === 'table');
      expect(tableSection).toBeDefined();
      expect(tableSection?.table?.rows.some((r) => r.isCurrent)).toBe(true);
    });
  });

  describe('getStaticPages & getNearbyVariants', () => {
    it('all static pages have valid slugs', () => {
      const pages = lengthSeoProvider.getStaticPages();
      // 8 pairs + 8 pairs * 103 exact values = 8 + 824 = 832 pages
      expect(pages.length).toBe(8 + 8 * 103);
      for (const page of pages) {
        const slug = lengthSeoProvider.getSlug(page);
        expect(slug).toBeTruthy();
        const roundtrip = lengthSeoProvider.parseVariant(slug);
        expect(roundtrip).toBeDefined();
      }
    });

    it('returns ONLY values that exist in getStaticPages()', () => {
      const staticPages = lengthSeoProvider.getStaticPages();
      const staticSlugs = new Set(staticPages.map((p) => lengthSeoProvider.getSlug(p)));

      for (const page of staticPages.slice(0, 50)) {
        const nearby = lengthSeoProvider.getNearbyVariants!(page);
        for (const n of nearby) {
          const slug = lengthSeoProvider.getSlug(n);
          expect(staticSlugs.has(slug)).toBe(true);
        }
      }
    });
  });
});
