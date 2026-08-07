---
id: images/compress
name: In-Browser Image Compressor
namespace: images
status: published
renderer: images/compress
pattern: file

summary: Reduce PNG, JPG, and WebP file sizes up to 80% with configurable compression quality entirely in browser.

aliases:
  - image optimizer
  - compress png
  - compress jpg

seo:
  title: Image Compressor – Free Online Image Optimization
  description: Compress PNG, JPG, and WebP images directly in your browser tab without server uploads.
  primaryKeyword: image compressor
  keywords:
    - compress png
    - compress jpg
    - image optimizer
  noindex: false

privacy:
  processing: local
  message: Your images are compressed 100% locally in your browser memory and are never uploaded.

config:
  defaultQuality: 0.8
  maxFileSizeMb: 20

features:
  - compress
  - preview
  - download

examples:
  - title: Compress high-resolution image
    input: "2.5 MB PNG photo"
    output: "450 KB optimized WebP image"

faq:
  - question: Are my photos uploaded to a server?
    answer: No. All compression runs locally using HTML5 Canvas inside your browser.

relatedTools:
  - json/formatter
  - base64/encode

featured: true
updatedAt: 2026-08-07
---

## How local image compression works

ShadTools renders your uploaded image onto an offscreen HTML5 canvas element and re-exports it at your selected quality setting.
