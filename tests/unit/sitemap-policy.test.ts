import { describe, expect, it } from 'vitest';
import {
  getSitemapGroup,
  isIndexablePath,
  normalizeSitePath,
} from '../../src/lib/seo/indexability.js';

describe('sitemap policy', () => {
  it('normalizes absolute URLs and trailing slashes', () => {
    expect(normalizeSitePath('https://shadtools.com/units/length/')).toBe('/units/length');
  });

  it('excludes explicit noindex routes', () => {
    expect(isIndexablePath('/search')).toBe(false);
    expect(isIndexablePath('/404')).toBe(false);
    expect(isIndexablePath('/json/formatter')).toBe(true);
  });

  it.each([
    ['/', 'core'],
    ['/privacy', 'core'],
    ['/units', 'core'],
    ['/json/formatter', 'tools'],
    ['/units/length', 'tools'],
    ['/units/length/meter-to-foot', 'units-length'],
    ['/units/area/25-acre-to-square-foot', 'units-area'],
  ])('groups %s into sitemap-%s.xml', (route, group) => {
    expect(getSitemapGroup(route)).toBe(group);
  });
});
