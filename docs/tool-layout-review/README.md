# Tool layout review set

These screenshots are deterministic, full-page captures intended for visual and AI-assisted review of ShadTools' primary workspace layouts. Each selected tool is captured at 1440 px desktop and 390 px mobile widths.

Regenerate the set from the repository root:

```bash
npm run capture:tool-layouts -- --review-set --output docs/tool-layout-review
```

The set deliberately samples distinct shared archetypes and custom workspaces instead of every tool. Capture metadata is in [`manifest.json`](./manifest.json).

| Workspace coverage | Desktop | Mobile |
| --- | --- | --- |
| JSON formatter — custom two-pane editor | [PNG](./code-editor--json--formatter--desktop.png) | [PNG](./code-editor--json--formatter--mobile.png) |
| Sort lines — shared two-pane transform | [PNG](./code-editor--text--sort-lines--desktop.png) | [PNG](./code-editor--text--sort-lines--mobile.png) |
| Text diff — comparison workspace | [PNG](./code-editor--text--diff--desktop.png) | [PNG](./code-editor--text--diff--mobile.png) |
| Word counter — metrics and single editor | [PNG](./code-editor--text--word-counter--desktop.png) | [PNG](./code-editor--text--word-counter--mobile.png) |
| Case converter — transform actions and results | [PNG](./code-editor--text--case-converter--desktop.png) | [PNG](./code-editor--text--case-converter--mobile.png) |
| Hash generator — input with stacked outputs | [PNG](./code-editor--crypto--hash--desktop.png) | [PNG](./code-editor--crypto--hash--mobile.png) |
| UUID generator — generator controls and output | [PNG](./code-editor--crypto--uuid--desktop.png) | [PNG](./code-editor--crypto--uuid--mobile.png) |
| Image compressor — file dropzone | [PNG](./file--images--compress--desktop.png) | [PNG](./file--images--compress--mobile.png) |
| Percentage calculator — calculator workspace | [PNG](./calculator--percentage--calculator--desktop.png) | [PNG](./calculator--percentage--calculator--mobile.png) |
| Currency converter — currency-specific converter | [PNG](./converter--currency--converter--desktop.png) | [PNG](./converter--currency--converter--mobile.png) |
| Length converter — custom unit converter | [PNG](./converter--units--length--desktop.png) | [PNG](./converter--units--length--mobile.png) |
| Time converter — shared converter archetype | [PNG](./converter--units--time--desktop.png) | [PNG](./converter--units--time--mobile.png) |
| Temperature converter — formula converter | [PNG](./converter--units--temperature--desktop.png) | [PNG](./converter--units--temperature--mobile.png) |
| Weight converter — alternate custom converter | [PNG](./converter--units--weight--desktop.png) | [PNG](./converter--units--weight--mobile.png) |
