# Google Search Console Setup & Operational Guide

This document details the manual operational steps required by the repository owner to register ShadTools with Google Search Console after deployment.

---

## Operational Steps

### 1. Add Domain Property
1. Log into [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property**.
3. Enter `shadtools.com` as a **Domain** or **URL Prefix** (`https://shadtools.com`).

### 2. Complete Verification
- **Option A (DNS TXT Record - Recommended)**: Add the provided `google-site-verification` TXT record to Cloudflare DNS settings.
- **Option B (HTML Meta Tag)**: Copy the verification string token (e.g. `abcdef123456789`) provided by Google.
  Set the production environment variable on Cloudflare Pages:
  ```env
  PUBLIC_GOOGLE_SITE_VERIFICATION=abcdef123456789
  ```
  Redeploy the site. The verification tag will be emitted in `MetaHead.astro`:
  ```html
  <meta name="google-site-verification" content="abcdef123456789" />
  ```

### 3. Submit Production Sitemap
1. Navigate to **Sitemaps** in the Search Console sidebar.
2. Enter the sitemap index URL:
   ```
   https://shadtools.com/sitemap-index.xml
   ```
3. Click **Submit**. Verify status reads **Success**.
4. Submit only the index URL. It references the grouped core, tools, and programmatic converter sitemaps; the child files do not need separate submissions.

### 4. Inspect Representative Landing Pages
Use the **URL Inspection Tool** to test indexing for representative routes:
- Homepage: `https://shadtools.com/`
- Tool Page: `https://shadtools.com/units/length`
- Pair SEO Page: `https://shadtools.com/units/length/meter-to-foot`
- Exact SEO Page: `https://shadtools.com/units/length/10-meter-to-foot`

Verify that:
- **Canonical URL** detected by Google matches `https://shadtools.com/...` without query parameters.
- Mobile usability passes.
- Page rendering executes cleanly.

### 5. Regular Indexing & Search Monitoring
Review Search Console weekly for:
- **Page Indexing Report**: Ensure indexable pages are indexed and non-indexable pages (like `/404`) are appropriately excluded.
- **Performance Report**: Monitor impressions, clicks, CTR, and search queries to guide future product decisions.
