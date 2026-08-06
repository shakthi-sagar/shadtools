# AI Tool Contribution Specification & Prompt Template

This specification defines the rules for generating new tool definitions for **ShadTools** (`shadtools.com`).

---

## 📋 Strict Rules for AI Tool Generation

Every AI-generated tool definition must strictly adhere to the following rules:

1. **Use Approved Categories Only**:
   - `pdf-tools`
   - `developer-tools`
   - `finance-tools`
   - `image-tools`
   - `time-tools`
   - `unit-converters`

2. **Use Approved Shared Components Only**:
   - `CodeEditorTool`
   - `NumberInputResult`
   - `TwoWayUnitConverter`
   - `MultiFieldFinanceCalc`
   - `ImageUploadPreview`
   - `QrCodeTool`

3. **Unique & Accurate Content**:
   - Do NOT create thin, duplicate, or doorway SEO pages.
   - Include genuine, accurate `longDescription`, step-by-step instructions, realistic conversion examples, and compliant FAQs.

4. **Zero Server Claims**:
   - Must explicitly emphasize 100% in-browser local privacy processing.

5. **Pass All Validation Checks**:
   - Must pass `npm run validate-tools` and TypeScript strict mode typechecking.

---

## 🤖 Reusable AI Generation Prompt Template

Copy and paste the prompt below to generate a new tool definition file:

```markdown
Act as a Senior Technical SEO Engineer and Frontend Developer for ShadTools.

Generate a new TypeScript tool definition file for ShadTools following the exact schema below.

### Target Tool Details:
- Tool Name: [INSERT TOOL NAME, e.g., JSON to CSV Converter]
- Slug: [INSERT SLUG, e.g., json-to-csv-converter]
- Category: [CHOOSE ONE: pdf-tools | developer-tools | finance-tools | image-tools | time-tools | unit-converters]
- Component: [CHOOSE ONE: CodeEditorTool | NumberInputResult | TwoWayUnitConverter | MultiFieldFinanceCalc | ImageUploadPreview | QrCodeTool]
- Primary Keyword: [INSERT KEYWORD]

### Output Format Required:
Return ONLY the TypeScript code for `src/content/tools/[slug].ts` using this exact structure:

```ts
import type { ToolDefinition } from '../../types/tool';

const toolDefinition: ToolDefinition = {
  id: '[slug]',
  name: '[Tool Name]',
  slug: '[slug]',
  category: '[category]',
  shortDescription: '[Detailed 150-250 character description]',
  longDescription: `
    [Multi-paragraph explanation of how the tool works and its benefits]
  `,
  keywords: ['[primary keyword]', '[keyword2]', '[keyword3]'],
  primaryKeyword: '[primary keyword]',
  relatedKeywords: ['[related1]', '[related2]'],
  component: '[Component]',
  config: {},
  examples: [
    {
      input: '[Example input]',
      output: '[Example output]',
      description: '[Example description]'
    }
  ],
  faq: [
    {
      question: 'Is my data uploaded to any server?',
      answer: 'No. All processing happens 100% locally inside your browser.'
    }
  ],
  relatedTools: [],
  status: 'published',
  lastModified: '[CURRENT DATE YYYY-MM-DD]'
};

export default toolDefinition;
```
```
