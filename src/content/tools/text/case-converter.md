---
id: text/case-converter
name: Case Converter
namespace: text
status: published
renderer: text/case-converter
pattern: code-editor

summary: Convert text strings between camelCase, kebab-case, snake_case, CONSTANT_CASE, PascalCase, and Title Case instantly in your browser.

aliases:
  - camelcase converter
  - snakecase converter
  - kebabcase converter
  - title case converter

seo:
  title: Case Converter – Convert camelCase, snake_case & kebab-case
  description: Convert text strings between camelCase, kebab-case, snake_case, CONSTANT_CASE, PascalCase, and Title Case with instant copy actions.
  primaryKeyword: case converter
  keywords:
    - camelcase converter
    - snakecase converter
    - kebabcase converter
  noindex: false

privacy:
  processing: local
  message: Text case conversion executes 100% locally in your browser memory.

config: {}

features:
  - camel-case
  - kebab-case
  - snake-case
  - constant-case
  - copy

faq:
  - question: "Which naming conventions are supported?"
    answer: "ShadTools supports camelCase, kebab-case, snake_case, CONSTANT_CASE, PascalCase, Title Case, lowercase, and UPPERCASE."
  - question: "Is my text data uploaded to any server?"
    answer: "No. All text parsing and string transformations take place 100% locally in your browser memory."
  - question: "Can I copy individual case formats with one click?"
    answer: "Yes. Click the Copy button next to any converted format card to copy the string directly to your clipboard."

relatedTools:
  - text/diff
  - json/formatter
  - base64/encode

featured: true
updatedAt: 2026-08-07
---

## How the Case Converter works

The Case Converter tokenizes your input string into words by analyzing spaces, hyphens, underscores, and camelCase transitions, then reassembles the words into standard software engineering naming conventions.

### Supported Naming Conventions
- **`camelCase`**: First word lowercase, subsequent words capitalized (`userProfileData`).
- **`kebab-case`**: Words separated by hyphens in lowercase (`user-profile-data`).
- **`snake_case`**: Words separated by underscores in lowercase (`user_profile_data`).
- **`CONSTANT_CASE`**: Words separated by underscores in uppercase (`USER_PROFILE_DATA`).
