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

/**
 * A tool-owned provider that enumerates curated SEO variant pages.
 *
 * Example: the length converter produces pages like
 *   /units/length/10-meter-to-feet
 *
 * The generic [variant].astro route delegates to this provider
 * without knowing anything about meters or feet.
 */
export interface SeoPageProvider<TVariant = unknown> {
  /** Return all curated variants for static page generation. */
  getStaticPages(): TVariant[];

  /** Parse a URL slug like "10-meter-to-feet" → variant data, or null. */
  parseVariant(slug: string): TVariant | null;

  /** Build the URL slug from variant data. */
  getSlug(data: TVariant): string;

  /** True if this variant should appear in sitemap. */
  isIndexable(data: TVariant): boolean;

  /** SEO title, description, and H1 for this variant. */
  getMetadata(data: TVariant): SeoVariantMetadata;

  /** Compute the direct answer, formula, and steps for the page. */
  compute(data: TVariant): SeoVariantResult;

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

  /** Optional provider for programmatic SEO variant pages. */
  seoPages?: SeoPageProvider;
}
