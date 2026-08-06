import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log('🛠️  ShadTools Tool Scaffolding CLI\n');

  const name = await askQuestion('Tool Name (e.g. JSON Formatter): ');
  const slug = (await askQuestion('Slug (e.g. json-formatter): ')).toLowerCase().replace(/\s+/g, '-');
  const category = await askQuestion('Category (pdf-tools | developer-tools | finance-tools | image-tools | time-tools | unit-converters): ');
  const component = await askQuestion('Component (CodeEditorTool | NumberInputResult | TwoWayUnitConverter | MultiFieldFinanceCalc | ImageUploadPreview | QrCodeTool): ');
  const primaryKeyword = await askQuestion('Primary Keyword (e.g. json formatter online): ');
  const shortDescription = await askQuestion('Short Description: ');

  rl.close();

  const toolObj = {
    id: slug,
    name: name,
    slug: slug,
    category: category,
    shortDescription: shortDescription,
    longDescription: `The ShadTools ${name} provides fast, privacy-first online processing directly inside your browser memory.`,
    keywords: [primaryKeyword, name.toLowerCase()],
    primaryKeyword: primaryKeyword,
    relatedKeywords: [],
    component: component,
    config: {},
    examples: [
      {
        input: 'Sample Input',
        output: 'Sample Output',
        description: 'Sample conversion example'
      }
    ],
    faq: [
      {
        question: 'Is my data stored or logged?',
        answer: 'No. All processing happens 100% locally inside your browser memory.'
      }
    ],
    relatedTools: [],
    status: 'published',
    lastModified: new Date().toISOString().split('T')[0]
  };

  const targetPath = path.join(process.cwd(), 'src', 'content', 'tools', `${slug}.json`);
  
  if (fs.existsSync(targetPath)) {
    console.error(`❌ Error: Tool file already exists at ${targetPath}`);
    process.exit(1);
  }

  fs.writeFileSync(targetPath, JSON.stringify(toolObj, null, 2), 'utf-8');
  console.log(`\n✅ Successfully generated tool JSON file at: ${targetPath}`);
}

main().catch(console.error);
