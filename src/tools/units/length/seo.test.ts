import { describe, it, expect } from 'vitest';
import { lengthSeoProvider, type LengthVariant } from '@/tools/units/length/seo';

describe('Length SEO Provider', () => {
  describe('getSlug / parseVariant roundtrip', () => {
    it('builds a slug from variant data', () => {
      const slug = lengthSeoProvider.getSlug({ value: 10, fromId: 'm', toId: 'ft' });
      expect(slug).toBe('10-meter-to-foot');
    });

    it('parses a valid slug back to variant data', () => {
      const variant = lengthSeoProvider.parseVariant('10-meter-to-foot');
      expect(variant).toEqual({ value: 10, fromId: 'm', toId: 'ft' });
    });

    it('roundtrips correctly', () => {
      const original: LengthVariant = { value: 42, fromId: 'km', toId: 'mi' };
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

    it('returns null for unknown unit slugs', () => {
      expect(lengthSeoProvider.parseVariant('10-parsec-to-foot')).toBeNull();
    });
  });

  describe('isIndexable', () => {
    it('returns true for curated values on known pairs', () => {
      expect(lengthSeoProvider.isIndexable({ value: 1, fromId: 'm', toId: 'ft' })).toBe(true);
      expect(lengthSeoProvider.isIndexable({ value: 100, fromId: 'km', toId: 'mi' })).toBe(true);
      expect(lengthSeoProvider.isIndexable({ value: 1000, fromId: 'cm', toId: 'in' })).toBe(true);
    });

    it('returns false for non-curated values', () => {
      expect(lengthSeoProvider.isIndexable({ value: 999999, fromId: 'm', toId: 'ft' })).toBe(false);
    });

    it('returns false for unknown pairs', () => {
      expect(lengthSeoProvider.isIndexable({ value: 1, fromId: 'mm', toId: 'mi' })).toBe(false);
    });
  });

  describe('compute', () => {
    it('computes correct conversion for 1 meter to feet', () => {
      const result = lengthSeoProvider.compute({ value: 1, fromId: 'm', toId: 'ft' });
      expect(result.answer).toContain('1 Meter');
      expect(result.answer).toContain('Feet');
      expect(result.answer).toContain('3.28084');
    });

    it('computes correct conversion for 100 km to miles', () => {
      const result = lengthSeoProvider.compute({ value: 100, fromId: 'km', toId: 'mi' });
      expect(result.answer).toContain('100');
      expect(result.answer).toContain('Kilometers');
      expect(result.answer).toContain('Miles');
    });
  });

  describe('getMetadata', () => {
    it('generates proper H1 with correct pluralization', () => {
      const meta1 = lengthSeoProvider.getMetadata({ value: 1, fromId: 'm', toId: 'ft' });
      expect(meta1.h1).toBe('1 Meter to Feet');

      const meta10 = lengthSeoProvider.getMetadata({ value: 10, fromId: 'm', toId: 'ft' });
      expect(meta10.h1).toBe('10 Meters to Feet');
    });

    it('includes conversion result in title', () => {
      const meta = lengthSeoProvider.getMetadata({ value: 5, fromId: 'km', toId: 'mi' });
      expect(meta.title).toContain('5 Kilometers');
      expect(meta.title).toContain('Miles');
      expect(meta.title).toContain('Length Conversion');
    });
  });

  describe('getStaticPages', () => {
    it('generates expected number of pages', () => {
      const pages = lengthSeoProvider.getStaticPages();
      // 8 pairs × 103 values (1-100 + 250 + 500 + 1000)
      expect(pages.length).toBe(8 * 103);
    });

    it('all static pages have valid slugs', () => {
      const pages = lengthSeoProvider.getStaticPages();
      for (const page of pages) {
        const slug = lengthSeoProvider.getSlug(page);
        expect(slug).toBeTruthy();
        const roundtrip = lengthSeoProvider.parseVariant(slug);
        expect(roundtrip).toEqual(page);
      }
    });
  });

  describe('getNearbyVariants', () => {
    it('returns nearby values for internal linking', () => {
      const nearby = lengthSeoProvider.getNearbyVariants!({ value: 10, fromId: 'm', toId: 'ft' });
      expect(nearby.length).toBeGreaterThan(0);
      // Should include values like 8, 9, 11, 12, 15, 20
      const values = nearby.map((n) => n.value);
      expect(values).toContain(8);
      expect(values).toContain(9);
      expect(values).toContain(11);
      expect(values).toContain(12);
    });

    it('excludes zero and negative values', () => {
      const nearby = lengthSeoProvider.getNearbyVariants!({ value: 1, fromId: 'm', toId: 'ft' });
      const values = nearby.map((n) => n.value);
      expect(values.every((v) => v > 0)).toBe(true);
    });
  });
});
