import { spawn, type ChildProcess } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Browser, type Page } from '@playwright/test';

type ToolPattern =
  | 'code-editor'
  | 'file'
  | 'calculator'
  | 'converter'
  | 'generator';

type ToolEntry = {
  id: string;
  pattern: ToolPattern;
  source: string;
};

type ViewportProfile = {
  name: string;
  width: number;
  height: number;
  deviceScaleFactor: number;
  isMobile: boolean;
};

type CaptureRecord = {
  tool: string;
  pattern: ToolPattern;
  viewport: string;
  width: number;
  height: number;
  file: string;
  url: string;
};

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = join(repositoryRoot, 'src', 'content', 'tools');
const defaultOutputDirectory = join(repositoryRoot, 'artifacts', 'tool-layouts');
const defaultPort = 4323;

const patterns: ToolPattern[] = [
  'code-editor',
  'file',
  'calculator',
  'converter',
  'generator',
];

const preferredRepresentatives: Partial<Record<ToolPattern, string>> = {
  'code-editor': 'json/formatter',
  file: 'images/compress',
  calculator: 'percentage/calculator',
  converter: 'units/length',
};

const viewportProfiles: ViewportProfile[] = [
  {
    name: 'desktop',
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    isMobile: false,
  },
  {
    name: 'mobile',
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    isMobile: true,
  },
];

function printUsage(): void {
  console.log(`Capture review-ready screenshots of rendered tool pages.

Usage:
  npm run capture:tool-layouts
  npm run capture:tool-layouts -- --all
  npm run capture:tool-layouts -- --pattern converter
  npm run capture:tool-layouts -- --tool json/formatter

Options:
  --all                 Capture every published tool.
  --tool <id>           Capture one tool, for example json/formatter.
  --pattern <pattern>   Capture every tool with this layout pattern.
  --base-url <url>      Use an already-running site instead of starting Astro.
  --output <directory>  Output directory (default: artifacts/tool-layouts).
  --desktop-only        Skip mobile captures.
  --help                Show this help.

With no selector, one representative tool is captured per layout pattern.`);
}

function optionValue(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) return undefined;

  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value.`);
  }

  return value;
}

async function markdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return markdownFiles(path);
      return entry.isFile() && entry.name.endsWith('.md') ? [path] : [];
    })
  );

  return files.flat();
}

function frontmatterValue(markdown: string, key: string): string | undefined {
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter) return undefined;

  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)["']?\\s*$`, 'm'));
  return match?.[1]?.trim();
}

async function discoverTools(): Promise<ToolEntry[]> {
  const files = await markdownFiles(contentRoot);
  const tools = await Promise.all(
    files.map(async (source): Promise<ToolEntry | undefined> => {
      const markdown = await readFile(source, 'utf8');
      if (frontmatterValue(markdown, 'status') !== 'published') return undefined;

      const fallbackId = relative(contentRoot, source)
        .split(sep)
        .join('/')
        .replace(/\.md$/, '');
      const id = frontmatterValue(markdown, 'id') ?? fallbackId;
      const pattern = frontmatterValue(markdown, 'pattern');

      if (!patterns.includes(pattern as ToolPattern)) {
        throw new Error(`Unknown or missing pattern in ${relative(repositoryRoot, source)}.`);
      }

      return { id, pattern: pattern as ToolPattern, source };
    })
  );

  return tools.filter((tool): tool is ToolEntry => tool !== undefined).sort((a, b) =>
    a.id.localeCompare(b.id)
  );
}

function representativeTools(tools: ToolEntry[]): ToolEntry[] {
  return patterns.flatMap((pattern) => {
    const candidates = tools.filter((tool) => tool.pattern === pattern);
    if (candidates.length === 0) return [];

    const preferred = preferredRepresentatives[pattern];
    return [candidates.find((tool) => tool.id === preferred) ?? candidates[0]];
  });
}

function selectTools(tools: ToolEntry[], args: string[]): ToolEntry[] {
  const toolId = optionValue(args, '--tool');
  const requestedPattern = optionValue(args, '--pattern');
  const selectorCount = Number(args.includes('--all')) + Number(Boolean(toolId)) + Number(Boolean(requestedPattern));

  if (selectorCount > 1) {
    throw new Error('Use only one of --all, --tool, or --pattern.');
  }

  if (toolId) {
    const tool = tools.find((candidate) => candidate.id === toolId);
    if (!tool) throw new Error(`Published tool not found: ${toolId}`);
    return [tool];
  }

  if (requestedPattern) {
    if (!patterns.includes(requestedPattern as ToolPattern)) {
      throw new Error(`Unknown pattern: ${requestedPattern}. Expected one of: ${patterns.join(', ')}.`);
    }

    const matches = tools.filter((tool) => tool.pattern === requestedPattern);
    if (matches.length === 0) throw new Error(`No published tools use pattern: ${requestedPattern}`);
    return matches;
  }

  return args.includes('--all') ? tools : representativeTools(tools);
}

async function waitForServer(url: string, child?: ChildProcess): Promise<void> {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (child?.exitCode !== null) {
      throw new Error(`Astro exited before ${url} became available.`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The dev server is still starting.
    }

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }

  throw new Error(`Timed out waiting for ${url}.`);
}

async function startAstro(port: number): Promise<ChildProcess> {
  const astroCli = join(repositoryRoot, 'node_modules', 'astro', 'astro.js');
  const child = spawn(process.execPath, [astroCli, 'dev', '--port', String(port)], {
    cwd: repositoryRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout?.on('data', (chunk: Buffer) => process.stdout.write(chunk));
  child.stderr?.on('data', (chunk: Buffer) => process.stderr.write(chunk));
  return child;
}

async function preparePage(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition: none !important;
        caret-color: transparent !important;
      }

      astro-dev-toolbar {
        display: none !important;
      }
    `,
  });
  await page.evaluate(() => document.fonts.ready);
}

async function captureTool(
  browser: Browser,
  tool: ToolEntry,
  profile: ViewportProfile,
  baseUrl: string,
  outputDirectory: string
): Promise<CaptureRecord> {
  const context = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    deviceScaleFactor: profile.deviceScaleFactor,
    isMobile: profile.isMobile,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const url = new URL(`/${tool.id}`, `${baseUrl}/`).toString();
  const fileName = `${tool.pattern}--${tool.id.replace('/', '--')}--${profile.name}.png`;
  const outputPath = join(outputDirectory, fileName);

  try {
    await preparePage(page, url);
    await page.screenshot({ path: outputPath, fullPage: true });
  } finally {
    await context.close();
  }

  console.log(`Captured ${relative(repositoryRoot, outputPath)}`);
  return {
    tool: tool.id,
    pattern: tool.pattern,
    viewport: profile.name,
    width: profile.width,
    height: profile.height,
    file: fileName,
    url,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    printUsage();
    return;
  }

  const tools = await discoverTools();
  const selectedTools = selectTools(tools, args);
  const profiles = args.includes('--desktop-only') ? viewportProfiles.slice(0, 1) : viewportProfiles;
  const outputDirectory = resolve(optionValue(args, '--output') ?? defaultOutputDirectory);
  const suppliedBaseUrl = optionValue(args, '--base-url');
  const port = defaultPort;
  const baseUrl = suppliedBaseUrl?.replace(/\/$/, '') ?? `http://localhost:${port}`;
  let server: ChildProcess | undefined;
  let browser: Browser | undefined;
  const selection = args.includes('--all')
    ? 'all'
    : optionValue(args, '--tool')
      ? 'tool'
      : optionValue(args, '--pattern')
        ? 'pattern'
        : 'representative-by-pattern';

  await mkdir(outputDirectory, { recursive: true });

  try {
    if (!suppliedBaseUrl) server = await startAstro(port);
    await waitForServer(baseUrl, server);
    browser = await chromium.launch();

    const captures: CaptureRecord[] = [];
    for (const tool of selectedTools) {
      for (const profile of profiles) {
        captures.push(await captureTool(browser, tool, profile, baseUrl, outputDirectory));
      }
    }

    const manifestPath = join(outputDirectory, 'manifest.json');
    await writeFile(
      manifestPath,
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          selection,
          captures,
        },
        null,
        2
      )}\n`,
      'utf8'
    );
    console.log(`Manifest: ${relative(repositoryRoot, manifestPath)}`);
  } finally {
    await browser?.close();
    if (server && server.exitCode === null) server.kill('SIGTERM');
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
