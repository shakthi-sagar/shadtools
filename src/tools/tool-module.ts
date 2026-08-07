import type { z } from "astro/zod";

export type ToolPattern =
  | "code-editor"
  | "file"
  | "calculator"
  | "converter"
  | "generator";

// ---------------------------------------------------------------------------
// Programmatic SEO
// ---------------------------------------------------------------------------

export interface SeoVariantMetadata {
  title: string;
  description: string;
  h1: string;
}

export interface SeoVariantResult {
  answer: string;
  formula: string;
  steps: string;
}

export interface SeoSection {
  title: string;
  type: 'cards' | 'table' | 'text' | 'links';
  cards?: Array<{ label: string; value: string }>;
  table?: {
    headers: [string, string];
    rows: Array<{
      from: string;
      to: string;
      slug?: string;
      isCurrent?: boolean;
    }>;
  };
  text?: string;
  links?: Array<{ slug: string; label: string }>;
}

export interface BreadcrumbParent {
  slug: string;
  name: string;
}

/**
 * A tool-owned provider that enumerates curated SEO variant pages.
 */
export interface SeoPageProvider<TVariant = unknown> {
  /** Return all curated variants for static page generation. */
  getStaticPages(): TVariant[];

  /** Parse a URL slug like "10-meter-to-foot" → variant data, or null. */
  parseVariant(slug: string): TVariant | null;

  /** Build the URL slug from variant data. */
  getSlug(data: TVariant): string;

  /** True if this variant should appear in sitemap. */
  isIndexable(data: TVariant): boolean;

  /** SEO title, description, and H1 for this variant. */
  getMetadata(data: TVariant): SeoVariantMetadata;

  /** Compute the direct answer, formula, and steps for the page. */
  compute(data: TVariant): SeoVariantResult;

  /** Optional: get parent breadcrumb for multi-tier hierarchy (e.g. Pair page). */
  getBreadcrumbParent?(data: TVariant): BreadcrumbParent | null;

  /** Optional: custom compositional sections (tables, cards, text, links). */
  getSections?(data: TVariant): SeoSection[];

  /** Optional: nearby/related variants for internal linking. */
  getNearbyVariants?(data: TVariant): TVariant[];
}

// ---------------------------------------------------------------------------
// Core tool module
// ---------------------------------------------------------------------------

export interface ToolModule<TSchema extends z.ZodType = z.ZodType> {
  key: `${string}/${string}`;
  pattern: ToolPattern;
  configSchema: TSchema;
  privacyMode: "local" | "remote-data" | "server-processing";

  /** Category and action type for metrics and routing. */
  analytics?: {
    category: string;
    actionType: "transform" | "convert" | "calculate" | "generate" | "inspect";
  };

  /** Optional provider for programmatic SEO variant pages. */
  seoPages?: SeoPageProvider;
}
