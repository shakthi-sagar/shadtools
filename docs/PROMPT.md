You are a senior frontend architect, technical SEO engineer, and Cloudflare deployment expert.

Help me design and build a production-ready utility website called **ShadTools**, hosted at **shadtools.com**.

## Product vision

ShadTools will be a large collection of free browser-based utility tools across multiple categories, including:

* PDF and document tools
* Image converters and compressors
* Developer tools such as JSON, CSV, Base64, binary, hexadecimal, and Roman numeral converters
* Currency, finance, loan, tax, percentage, and unit calculators
* Time zone and date tools
* QR-code tools
* Audio and video utilities where technically and legally appropriate

The site should eventually support hundreds or thousands of SEO-targeted pages without requiring me to manually create each HTML file.

The objective is to create a scalable system where:

1. I define tool metadata and configuration.
2. Shared components render the actual tools.
3. Astro automatically generates the required static pages.
4. The site is deployed to Cloudflare.
5. New tools can be added quickly without duplicating layouts or code.
6. Pages are genuinely useful and not thin, spammy, or doorway SEO pages.

## Required technology stack

Use:

* Astro
* TypeScript with strict mode
* Tailwind CSS
* React components only for interactive islands where needed
* Cloudflare Pages or the currently recommended Cloudflare platform for Astro
* Astro content collections or typed local data files for tool metadata
* Cloudflare Web Analytics
* Google Search Console integration instructions
* Vitest for unit testing
* Playwright for critical end-to-end tests

Avoid using a database unless it provides a clear benefit. Initially, tool metadata should live in typed JSON, YAML, Markdown, or TypeScript data files committed to the repository.

Prefer static generation. Use server-side or Cloudflare Worker functionality only when a tool cannot reasonably operate in the browser.

## Architecture requirements

Design the project as a reusable tool-generation framework.

Each tool should consist of:

1. Metadata and SEO content
2. A reusable tool engine or interactive component
3. A shared page template
4. Optional tool-specific configuration

A tool definition should support fields such as:

```ts
type ToolDefinition = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  keywords: string[];
  primaryKeyword: string;
  relatedKeywords: string[];
  component: string;
  config?: Record<string, unknown>;
  inputLabel?: string;
  outputLabel?: string;
  examples?: Array<{
    input: string;
    output: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  relatedTools?: string[];
  accent?: string;
  status: "draft" | "published";
};
```

Improve this schema where necessary.

Create a dynamic Astro route such as:

```text
/src/pages/tools/[slug].astro
```

or a category-based structure such as:

```text
/src/pages/[category]/[slug].astro
```

Use `getStaticPaths()` to generate all published tool pages during the build.

Do not generate separate manually maintained HTML files.

## Tool component system

Create a reusable component library for common tool patterns, including:

* Text input to text output
* Number input to calculated result
* Two-way unit conversion
* File upload to downloadable output
* Image upload with preview
* JSON or code editor
* Multi-field finance calculator
* Date and time conversion
* QR-code generator
* Copy result button
* Download result button
* Reset button
* Swap input and output button
* Error and validation messages
* Privacy notice for browser-local processing

Each tool page should use the same underlying design system.

The site should feel like one coherent product, not a collection of unrelated templates.

However, categories may use subtle accent differences, such as:

* Documents: blue
* Finance: green
* Developer tools: purple
* Images: orange
* Time and date: teal

Keep the structure, typography, spacing, interaction patterns, and accessibility behavior consistent across every category.

## Page layout

Create a shared tool-page layout containing:

1. Global header
2. Breadcrumb navigation
3. Tool title
4. Clear one-sentence description
5. Interactive tool above the fold
6. Privacy or local-processing message where applicable
7. Explanation of how the tool works
8. Step-by-step usage instructions
9. Examples
10. Related tools
11. Frequently asked questions
12. Relevant supporting content
13. Footer
14. Reserved advertisement positions that do not harm usability or Core Web Vitals

The tool should be immediately usable without forcing the visitor to scroll through SEO content first.

Do not create fake paragraphs simply to increase word count.

## SEO requirements

Implement:

* Unique `<title>` and meta description for every page
* Canonical URLs
* Open Graph metadata
* Twitter card metadata
* XML sitemap
* `robots.txt`
* Breadcrumb structured data
* `WebApplication` or `SoftwareApplication` structured data where valid
* FAQ structured data only when the FAQ is visibly displayed and compliant with current search-engine rules
* Proper heading hierarchy
* Internal linking between related tools
* Category hub pages
* Fast static HTML output
* Minimal client-side JavaScript
* Accessible semantic markup
* Descriptive URLs
* Automatic last-modified information where reliable
* A mechanism to prevent draft or low-quality pages from being indexed

Create category pages such as:

```text
/pdf-tools/
/image-tools/
/developer-tools/
/finance-tools/
/time-tools/
/unit-converters/
```

Each category page should contain real navigation and useful category-level information.

Do not create thousands of keyword-swapped pages that provide the same result. Only create separate pages when search intent or functionality is genuinely different.

For example, separate pages may be justified for:

* USD to INR
* EUR to USD
* Celsius to Fahrenheit
* Fahrenheit to Celsius

But the implementation should use one reusable conversion engine and typed configuration rather than duplicated code.

Explain how to handle canonicalization and duplicate content for pages with very similar functionality.

## Performance requirements

Target excellent Core Web Vitals.

Use:

* Static HTML wherever possible
* Lazy-loaded interactive islands
* No unnecessary global React hydration
* Optimized fonts
* Responsive images
* Minimal third-party scripts
* Deferred advertising scripts
* Code splitting
* Browser APIs for local conversion
* Web Workers for CPU-heavy processing
* Dynamic imports for heavy libraries such as `ffmpeg.wasm`
* Clear loading indicators for large operations

Avoid downloading large JavaScript bundles on pages that do not need them.

For example, a percentage calculator must not load PDF or audio-processing libraries.

## Privacy and security

Prefer processing user files entirely inside the browser.

Clearly state when files do not leave the device.

Implement:

* File type validation
* File-size limits
* Safe parsing
* Memory cleanup
* Object URL revocation
* Error boundaries
* No logging of private file contents
* No uploading unless explicitly required and disclosed
* Content Security Policy recommendations
* Security headers for Cloudflare
* Dependency risk considerations

Do not build tools intended to bypass copyright protections, platform restrictions, DRM, authentication, or terms of service.

For media tools, focus on user-owned files and lawful browser-side conversion.

## Monetization preparation

The site will eventually use display advertisements.

Create reusable advertisement-slot components for positions such as:

* Header or top banner
* Below the tool interface
* Within supporting content
* Desktop sidebar where appropriate

Initially render placeholders only.

The layout must not shift when advertisements load. Reserve dimensions to protect CLS.

Do not place ads between controls or in ways that could cause accidental clicks.

Also suggest monetization options besides display ads, such as relevant affiliate partnerships or a privacy-friendly paid tier, without compromising the free tools.

## Initial tools

Build the system and then implement a small initial set of tools to prove the architecture:

1. JSON formatter and validator
2. Percentage calculator
3. Unit converter
4. Base64 encoder and decoder
5. Roman numeral converter
6. Currency converter with a clean exchange-rate provider abstraction
7. Image compressor using browser APIs
8. QR-code generator

Choose implementations that demonstrate several different reusable component patterns.

For currency data:

* Abstract the exchange-rate provider
* Cache responses responsibly
* Display the rate timestamp
* Handle API failures
* Avoid claiming that delayed rates are real-time
* Keep provider keys outside client code when a private key is required

## Programmatic content pipeline

Create a scalable content-generation workflow.

I want a script such as:

```bash
npm run create-tool
```

It should ask for or accept:

* Tool name
* Slug
* Category
* Component type
* Primary keyword
* Short description
* Related tools
* Configuration values

It should then generate a valid tool-definition file from a template.

Also provide a validation script such as:

```bash
npm run validate-tools
```

It should detect:

* Duplicate slugs
* Missing metadata
* Broken related-tool references
* Invalid categories
* Missing components
* Duplicate titles
* Very short descriptions
* Draft pages accidentally included in production
* Invalid structured-data fields

Add a build-time failure when critical validation errors exist.

## AI contribution rules

I may use AI to generate future tool definitions and page content.

Create a written contribution specification for AI-generated pages.

Every generated tool must:

* Use the approved schema
* Use existing shared components
* Follow the design system
* Include unique and accurate content
* Avoid unsupported search-volume or revenue claims
* Avoid keyword stuffing
* Include useful examples
* Include relevant FAQs
* Link only to valid related tools
* Pass TypeScript, linting, tests, and metadata validation
* Avoid inventing APIs or browser capabilities
* Avoid duplicating an existing tool
* Avoid creating pages with no distinct user value

Create a reusable prompt template that I can later give to an AI to add one new tool safely.

## Deployment

Provide exact steps for deploying the Astro project to Cloudflare.

Include:

* Required Astro adapter or deployment configuration
* Build command
* Output directory
* Environment-variable handling
* Preview deployments
* Custom-domain connection for `shadtools.com`
* `www` redirect strategy
* HTTPS
* Caching strategy
* Security headers
* Redirect configuration
* How static assets and generated pages are served
* How deployment works when a new tool definition is committed
* Whether Cloudflare Pages or Workers is the better current choice for this architecture, and why

The deployment should rebuild and publish the generated static pages automatically whenever code or metadata changes are pushed to the repository.

## Repository quality

Include:

* Logical folder structure
* ESLint
* Prettier
* TypeScript strict mode
* Reusable utility functions
* Unit tests for converter logic
* End-to-end tests for key interactions
* GitHub Actions CI
* Accessibility checks
* Broken-link checking
* Sitemap validation
* README documentation
* Example environment file
* Clear naming conventions
* Error pages
* 404 page
* Legal pages: privacy policy, terms, disclaimer, and contact page

## Output format

Work in phases.

### Phase 1: Architecture

First provide:

* Proposed architecture
* Folder structure
* Data flow
* Build and deployment flow
* Important technical decisions
* Trade-offs
* Risks
* Suggested MVP scope

Do not generate the entire codebase before explaining the design.

### Phase 2: Foundation

After the architecture, generate:

* Astro configuration
* Tailwind setup
* Shared layouts
* Navigation
* Tool-definition schema
* Content collection or metadata system
* Dynamic routes
* SEO component
* Structured-data component
* Category system
* Shared tool UI components

### Phase 3: Initial tools

Implement the initial tools with complete working code and tests.

### Phase 4: Automation

Implement:

* Tool scaffolding CLI
* Metadata validation
* Sitemap generation
* Related-tool validation
* AI contribution rules
* CI pipeline

### Phase 5: Deployment

Provide the final Cloudflare configuration and deployment checklist.

For every file you generate:

1. Show its complete path.
2. Show the complete file contents.
3. Do not omit code with statements such as “rest of code here.”
4. Keep imports consistent.
5. Verify that referenced packages exist.
6. Use currently supported package versions.
7. Explain any command I must run.

Before completing each phase, perform a consistency review and identify likely build errors.

The final result should be a maintainable ShadTools foundation, not merely a visual prototype.
You are a senior frontend architect, technical SEO engineer, and Cloudflare deployment expert.

Help me design and build a production-ready utility website called **ShadTools**, hosted at **shadtools.com**.

## Product vision

ShadTools will be a large collection of free browser-based utility tools across multiple categories, including:

* PDF and document tools
* Image converters and compressors
* Developer tools such as JSON, CSV, Base64, binary, hexadecimal, and Roman numeral converters
* Currency, finance, loan, tax, percentage, and unit calculators
* Time zone and date tools
* QR-code tools
* Audio and video utilities where technically and legally appropriate

The site should eventually support hundreds or thousands of SEO-targeted pages without requiring me to manually create each HTML file.

The objective is to create a scalable system where:

1. I define tool metadata and configuration.
2. Shared components render the actual tools.
3. Astro automatically generates the required static pages.
4. The site is deployed to Cloudflare.
5. New tools can be added quickly without duplicating layouts or code.
6. Pages are genuinely useful and not thin, spammy, or doorway SEO pages.

## Required technology stack

Use:

* Astro
* TypeScript with strict mode
* Tailwind CSS
* React components only for interactive islands where needed
* Cloudflare Pages or the currently recommended Cloudflare platform for Astro
* Astro content collections or typed local data files for tool metadata
* Cloudflare Web Analytics
* Google Search Console integration instructions
* Vitest for unit testing
* Playwright for critical end-to-end tests

Avoid using a database unless it provides a clear benefit. Initially, tool metadata should live in typed JSON, YAML, Markdown, or TypeScript data files committed to the repository.

Prefer static generation. Use server-side or Cloudflare Worker functionality only when a tool cannot reasonably operate in the browser.

## Architecture requirements

Design the project as a reusable tool-generation framework.

Each tool should consist of:

1. Metadata and SEO content
2. A reusable tool engine or interactive component
3. A shared page template
4. Optional tool-specific configuration

A tool definition should support fields such as:

```ts
type ToolDefinition = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  keywords: string[];
  primaryKeyword: string;
  relatedKeywords: string[];
  component: string;
  config?: Record<string, unknown>;
  inputLabel?: string;
  outputLabel?: string;
  examples?: Array<{
    input: string;
    output: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  relatedTools?: string[];
  accent?: string;
  status: "draft" | "published";
};
```

Improve this schema where necessary.

Create a dynamic Astro route such as:

```text
/src/pages/tools/[slug].astro
```

or a category-based structure such as:

```text
/src/pages/[category]/[slug].astro
```

Use `getStaticPaths()` to generate all published tool pages during the build.

Do not generate separate manually maintained HTML files.

## Tool component system

Create a reusable component library for common tool patterns, including:

* Text input to text output
* Number input to calculated result
* Two-way unit conversion
* File upload to downloadable output
* Image upload with preview
* JSON or code editor
* Multi-field finance calculator
* Date and time conversion
* QR-code generator
* Copy result button
* Download result button
* Reset button
* Swap input and output button
* Error and validation messages
* Privacy notice for browser-local processing

Each tool page should use the same underlying design system.

The site should feel like one coherent product, not a collection of unrelated templates.

However, categories may use subtle accent differences, such as:

* Documents: blue
* Finance: green
* Developer tools: purple
* Images: orange
* Time and date: teal

Keep the structure, typography, spacing, interaction patterns, and accessibility behavior consistent across every category.

## Page layout

Create a shared tool-page layout containing:

1. Global header
2. Breadcrumb navigation
3. Tool title
4. Clear one-sentence description
5. Interactive tool above the fold
6. Privacy or local-processing message where applicable
7. Explanation of how the tool works
8. Step-by-step usage instructions
9. Examples
10. Related tools
11. Frequently asked questions
12. Relevant supporting content
13. Footer
14. Reserved advertisement positions that do not harm usability or Core Web Vitals

The tool should be immediately usable without forcing the visitor to scroll through SEO content first.

Do not create fake paragraphs simply to increase word count.

## SEO requirements

Implement:

* Unique `<title>` and meta description for every page
* Canonical URLs
* Open Graph metadata
* Twitter card metadata
* XML sitemap
* `robots.txt`
* Breadcrumb structured data
* `WebApplication` or `SoftwareApplication` structured data where valid
* FAQ structured data only when the FAQ is visibly displayed and compliant with current search-engine rules
* Proper heading hierarchy
* Internal linking between related tools
* Category hub pages
* Fast static HTML output
* Minimal client-side JavaScript
* Accessible semantic markup
* Descriptive URLs
* Automatic last-modified information where reliable
* A mechanism to prevent draft or low-quality pages from being indexed

Create category pages such as:

```text
/pdf-tools/
/image-tools/
/developer-tools/
/finance-tools/
/time-tools/
/unit-converters/
```

Each category page should contain real navigation and useful category-level information.

Do not create thousands of keyword-swapped pages that provide the same result. Only create separate pages when search intent or functionality is genuinely different.

For example, separate pages may be justified for:

* USD to INR
* EUR to USD
* Celsius to Fahrenheit
* Fahrenheit to Celsius

But the implementation should use one reusable conversion engine and typed configuration rather than duplicated code.

Explain how to handle canonicalization and duplicate content for pages with very similar functionality.

## Performance requirements

Target excellent Core Web Vitals.

Use:

* Static HTML wherever possible
* Lazy-loaded interactive islands
* No unnecessary global React hydration
* Optimized fonts
* Responsive images
* Minimal third-party scripts
* Deferred advertising scripts
* Code splitting
* Browser APIs for local conversion
* Web Workers for CPU-heavy processing
* Dynamic imports for heavy libraries such as `ffmpeg.wasm`
* Clear loading indicators for large operations

Avoid downloading large JavaScript bundles on pages that do not need them.

For example, a percentage calculator must not load PDF or audio-processing libraries.

## Privacy and security

Prefer processing user files entirely inside the browser.

Clearly state when files do not leave the device.

Implement:

* File type validation
* File-size limits
* Safe parsing
* Memory cleanup
* Object URL revocation
* Error boundaries
* No logging of private file contents
* No uploading unless explicitly required and disclosed
* Content Security Policy recommendations
* Security headers for Cloudflare
* Dependency risk considerations

Do not build tools intended to bypass copyright protections, platform restrictions, DRM, authentication, or terms of service.

For media tools, focus on user-owned files and lawful browser-side conversion.

## Monetization preparation

The site will eventually use display advertisements.

Create reusable advertisement-slot components for positions such as:

* Header or top banner
* Below the tool interface
* Within supporting content
* Desktop sidebar where appropriate

Initially render placeholders only.

The layout must not shift when advertisements load. Reserve dimensions to protect CLS.

Do not place ads between controls or in ways that could cause accidental clicks.

Also suggest monetization options besides display ads, such as relevant affiliate partnerships or a privacy-friendly paid tier, without compromising the free tools.

## Initial tools

Build the system and then implement a small initial set of tools to prove the architecture:

1. JSON formatter and validator
2. Percentage calculator
3. Unit converter
4. Base64 encoder and decoder
5. Roman numeral converter
6. Currency converter with a clean exchange-rate provider abstraction
7. Image compressor using browser APIs
8. QR-code generator

Choose implementations that demonstrate several different reusable component patterns.

For currency data:

* Abstract the exchange-rate provider
* Cache responses responsibly
* Display the rate timestamp
* Handle API failures
* Avoid claiming that delayed rates are real-time
* Keep provider keys outside client code when a private key is required

## Programmatic content pipeline

Create a scalable content-generation workflow.

I want a script such as:

```bash
npm run create-tool
```

It should ask for or accept:

* Tool name
* Slug
* Category
* Component type
* Primary keyword
* Short description
* Related tools
* Configuration values

It should then generate a valid tool-definition file from a template.

Also provide a validation script such as:

```bash
npm run validate-tools
```

It should detect:

* Duplicate slugs
* Missing metadata
* Broken related-tool references
* Invalid categories
* Missing components
* Duplicate titles
* Very short descriptions
* Draft pages accidentally included in production
* Invalid structured-data fields

Add a build-time failure when critical validation errors exist.

## AI contribution rules

I may use AI to generate future tool definitions and page content.

Create a written contribution specification for AI-generated pages.

Every generated tool must:

* Use the approved schema
* Use existing shared components
* Follow the design system
* Include unique and accurate content
* Avoid unsupported search-volume or revenue claims
* Avoid keyword stuffing
* Include useful examples
* Include relevant FAQs
* Link only to valid related tools
* Pass TypeScript, linting, tests, and metadata validation
* Avoid inventing APIs or browser capabilities
* Avoid duplicating an existing tool
* Avoid creating pages with no distinct user value

Create a reusable prompt template that I can later give to an AI to add one new tool safely.

## Deployment

Provide exact steps for deploying the Astro project to Cloudflare.

Include:

* Required Astro adapter or deployment configuration
* Build command
* Output directory
* Environment-variable handling
* Preview deployments
* Custom-domain connection for `shadtools.com`
* `www` redirect strategy
* HTTPS
* Caching strategy
* Security headers
* Redirect configuration
* How static assets and generated pages are served
* How deployment works when a new tool definition is committed
* Whether Cloudflare Pages or Workers is the better current choice for this architecture, and why

The deployment should rebuild and publish the generated static pages automatically whenever code or metadata changes are pushed to the repository.

## Repository quality

Include:

* Logical folder structure
* ESLint
* Prettier
* TypeScript strict mode
* Reusable utility functions
* Unit tests for converter logic
* End-to-end tests for key interactions
* GitHub Actions CI
* Accessibility checks
* Broken-link checking
* Sitemap validation
* README documentation
* Example environment file
* Clear naming conventions
* Error pages
* 404 page
* Legal pages: privacy policy, terms, disclaimer, and contact page

## Output format

Work in phases.

### Phase 1: Architecture

First provide:

* Proposed architecture
* Folder structure
* Data flow
* Build and deployment flow
* Important technical decisions
* Trade-offs
* Risks
* Suggested MVP scope

Do not generate the entire codebase before explaining the design.

### Phase 2: Foundation

After the architecture, generate:

* Astro configuration
* Tailwind setup
* Shared layouts
* Navigation
* Tool-definition schema
* Content collection or metadata system
* Dynamic routes
* SEO component
* Structured-data component
* Category system
* Shared tool UI components

### Phase 3: Initial tools

Implement the initial tools with complete working code and tests.

### Phase 4: Automation

Implement:

* Tool scaffolding CLI
* Metadata validation
* Sitemap generation
* Related-tool validation
* AI contribution rules
* CI pipeline

### Phase 5: Deployment

Provide the final Cloudflare configuration and deployment checklist.

For every file you generate:

1. Show its complete path.
2. Show the complete file contents.
3. Do not omit code with statements such as “rest of code here.”
4. Keep imports consistent.
5. Verify that referenced packages exist.
6. Use currently supported package versions.
7. Explain any command I must run.

Before completing each phase, perform a consistency review and identify likely build errors.

The final result should be a maintainable ShadTools foundation, not merely a visual prototype.
