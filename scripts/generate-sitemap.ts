import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://shadtools.com';

function getAllHtmlFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllHtmlFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.html')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

export function generateSitemap() {
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    console.warn('dist/ directory not found. Run astro build first.');
    return;
  }

  const htmlFiles = getAllHtmlFiles(distDir);
  const urls: string[] = [];

  htmlFiles.forEach((file) => {
    let relative = path.relative(distDir, file).replace(/\\/g, '/');
    if (relative === 'index.html') {
      urls.push(`${SITE_URL}/`);
    } else if (relative.endsWith('index.html')) {
      const route = relative.replace('/index.html', '');
      urls.push(`${SITE_URL}/${route}/`);
    } else if (relative !== '404.html') {
      urls.push(`${SITE_URL}/${relative}`);
    }
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${url === `${SITE_URL}/` ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), xml, 'utf-8');
  console.log(`✅ Successfully generated sitemap-index.xml with ${urls.length} URLs in dist/`);
}

if (process.argv[1] && process.argv[1].includes('generate-sitemap')) {
  generateSitemap();
}
