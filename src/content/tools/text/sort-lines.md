---
id: text/sort-lines
name: Sort Lines
namespace: text
status: published
renderer: text/sort-lines
pattern: code-editor

summary: Free online line sorting tool supporting alphabetical, numerical, length, and duplicate removal.

aliases:
  - sort lines
  - alphabetize list
  - remove duplicate lines

seo:
  title: Sort Lines – Alphabetize & Remove Duplicate Lines Online
  description: Sort text lines alphabetically, numerically, by length, or in reverse order with optional line deduplication.
  primaryKeyword: sort lines
  keywords:
    - sort lines
    - alphabetize lines
    - deduplicate lines
  noindex: false

privacy:
  processing: local
  message: Processed 100% locally in your browser memory.

config: {}

features:
  - Alphabetical, numerical, and length-based sorting
  - One-click line deduplication
  - Instant client-side processing

examples:
  - title: Sort list alphabetically
    input: "banana\napple"
    output: "apple\nbanana"

faq:
  - question: Is my data uploaded to any server?
    answer: No, line sorting runs 100% locally inside your web browser.

relatedTools:
  - text/word-counter
  - text/case-converter
featured: false
updatedAt: 2026-08-07
---

## How it works

The Sort Lines tool splits input text into discrete lines, applies requested ordering algorithms (locale string compare, float parsing, or length calculation), removes duplicate entries if selected, and joins the result.
