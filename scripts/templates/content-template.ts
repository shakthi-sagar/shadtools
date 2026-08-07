export function getContentTemplate(namespace: string, slug: string, name: string): string {
  return `---
name: "${name}"
namespace: "${namespace}"
status: "draft"
renderer: "${namespace}/${slug}"
pattern: "code-editor"
summary: "Fast, clean ${name} utility."
seo:
  title: "${name} – Free Online Utility"
  description: "Use ${name} online directly in your browser. Fast, free, privacy-first processing."
  primaryKeyword: "${name.toLowerCase()}"
  noindex: true
privacy:
  processing: "local"
  message: "Processed 100% locally inside your browser tab"
---

## Overview

Use ${name} online with zero server tracking.
`;
}
