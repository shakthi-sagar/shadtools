---
id: text/slug-generator
name: Slug Generator
namespace: text
status: published
renderer: text/slug-generator
pattern: code-editor

summary: Free online URL slug generator converting titles and headers into URL-friendly strings.

aliases:
  - slug generator
  - url slug generator
  - generate slug

seo:
  title: Slug Generator – Free Online URL Slug Creator
  description: Convert titles, blog post names, and string headers into URL-safe slugs with customizable separators.
  primaryKeyword: slug generator
  keywords:
    - slug generator
    - url slug creator
    - title to slug
  noindex: false

privacy:
  processing: local
  message: Processed 100% locally in your browser memory.

config: {}

features:
  - Diacritics and special character normalization
  - Customizable separators (hyphen, underscore, dot)
  - Lowercase and whitespace sanitization

examples:
  - title: Convert title to slug
    input: "Hello World! 2026"
    output: "hello-world-2026"

faq:
  - question: Are my titles stored anywhere?
    answer: No, slug generation occurs 100% locally inside your web browser.

relatedTools:
  - text/case-converter
  - text/sort-lines
featured: false
updatedAt: 2026-08-07
---

## How it works

The Slug Generator normalizes Unicode diacritics, removes non-alphanumeric symbols, trims whitespace, and joins tokens using your selected separator.
