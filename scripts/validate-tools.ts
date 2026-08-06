import fs from 'fs';
import path from 'path';

const VALID_CATEGORIES = [
  'pdf-tools',
  'developer-tools',
  'finance-tools',
  'image-tools',
  'time-tools',
  'unit-converters'
];

const VALID_COMPONENTS = [
  'CodeEditorTool',
  'NumberInputResult',
  'TwoWayUnitConverter',
  'MultiFieldFinanceCalc',
  'ImageUploadPreview',
  'QrCodeTool'
];

async function validate() {
  console.log('🔍 Running ShadTools Metadata & SEO Build Validator...\n');

  const toolsDir = path.join(process.cwd(), 'src', 'content', 'tools');
  if (!fs.existsSync(toolsDir)) {
    console.error(`❌ Tools directory missing at ${toolsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} tool definition files.\n`);

  const errors: string[] = [];
  const warnings: string[] = [];

  const seenSlugs = new Set<string>();
  const seenTitles = new Set<string>();

  for (const file of files) {
    const filePath = path.join(toolsDir, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const { slug, name, category, component, status, shortDescription } = content;

      if (!slug) {
        errors.push(`[${file}] Missing 'slug' field.`);
      } else {
        if (seenSlugs.has(slug)) {
          errors.push(`[${file}] Duplicate slug found: '${slug}'`);
        }
        seenSlugs.add(slug);
      }

      if (name) {
        if (seenTitles.has(name.toLowerCase())) {
          warnings.push(`[${file}] Duplicate title found: '${name}'`);
        }
        seenTitles.add(name.toLowerCase());
      } else {
        errors.push(`[${file}] Missing 'name' field.`);
      }

      if (category) {
        if (!VALID_CATEGORIES.includes(category)) {
          errors.push(`[${file}] Invalid category '${category}'. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
        }
      } else {
        errors.push(`[${file}] Missing 'category' field.`);
      }

      if (component) {
        if (!VALID_COMPONENTS.includes(component)) {
          errors.push(`[${file}] Invalid component '${component}'. Must be one of: ${VALID_COMPONENTS.join(', ')}`);
        }
      } else {
        errors.push(`[${file}] Missing 'component' field.`);
      }

      if (shortDescription) {
        if (shortDescription.length < 20) {
          errors.push(`[${file}] Short description too short (${shortDescription.length} chars). Minimum is 20 chars.`);
        }
      } else {
        errors.push(`[${file}] Missing 'shortDescription' field.`);
      }

      if (status === 'draft') {
        warnings.push(`[${file}] Tool is marked as 'draft' and will be excluded from production build.`);
      }
    } catch (err) {
      errors.push(`[${file}] Invalid JSON formatting.`);
    }
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }

  if (errors.length > 0) {
    console.error('❌ CRITICAL VALIDATION ERRORS:');
    errors.forEach(e => console.error(`   - ${e}`));
    console.error('\nBuild failed due to metadata validation errors.');
    process.exit(1);
  }

  console.log(`✅ All ${files.length} tool definitions passed metadata, SEO, and slug validation!`);
}

validate().catch(err => {
  console.error(err);
  process.exit(1);
});
