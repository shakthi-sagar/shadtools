# ShadTools Measurement & Decision System

This document outlines the operational measurement framework for ShadTools. Future development, tool additions, and programmatic SEO expansions MUST be guided by real evidence collected from Google Search Console and privacy-safe client analytics.

---

## 1. Primary Signal Sources

### A. Google Search Console (Acquisition Signals)
- **Impressions**: Total search engine visibility across all queries and landing pages.
- **Clicks**: Organic traffic brought into ShadTools landing pages.
- **CTR (Click-Through Rate)**: Ratio of clicks to impressions (`Clicks / Impressions * 100`).
- **Average Position**: Mean ranking position for targeted keywords.
- **Indexed Pages**: Total count of pages successfully indexed by Google Search.
- **Queries & Landing Pages**: Specific search terms driving impressions and which URLs receive them.

### B. Client Product Analytics (Engagement Signals)
- **`tool_open`**: User navigated to a tool interface.
- **`tool_execute`**: User triggered a calculation or data transformation.
- **`tool_copy`**: User copied the calculation or transformation output.
- **`tool_share`**: User copied a shareable state URL.
- **`search_used`**: User performed a local header search query.
- **`dashboard_pin` / `dashboard_unpin`**: User saved a tool to their local dashboard island.

---

## 2. Decision Matrix & Action Guidelines

| Observed Signal Combination | Root Cause / Diagnosis | Actionable Strategy |
| :--- | :--- | :--- |
| **High Impressions + Low Position (> 15)** | Good search demand, but page lacks depth or authority. | Improve internal linking, extend formula breakdowns, or add related conversion tables. |
| **High Impressions + Good Position (< 5) + Low CTR (< 2%)** | Title or meta description fails to capture search intent. | Refine title tag and meta description to emphasize exact answer and instant local processing. |
| **High Tool Opens + High Executions + High Copies** | High utility and user intent alignment. | Prioritize related tools or complementary converters in the same namespace. |
| **High Local Search Queries for Unbuilt Tools** | Direct user intent gap. | Candidate for new tool development. |
| **Large SEO Page Inventory + Zero Impressions (< 30 days)** | Search engines have not indexed or prioritized the pages. | **DO NOT** generate more pages. Audit sitemap, canonicals, and crawl status in Search Console. |

---

## 3. Privacy & Instrumentation Constraints

1. **Zero Data Transmitted**: Analytics events NEVER include user input text, JSON documents, Base64 payloads, uploaded files, or complete query strings.
2. **Payload Size Bucketing**: Payload sizes are tracked strictly in anonymized size buckets (`<100B`, `100B-1KB`, `1KB-10KB`, `10KB-100KB`, `>100KB`).
3. **Evidence-Based Growth**: Do not add new tool page families without verifying search intent and indexability of existing pages.
