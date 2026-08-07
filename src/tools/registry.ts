import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { ToolModule } from '@/tools/tool-module';

type RendererModule = {
  default: AstroComponentFactory;
};

type DefinitionModule = {
  toolModule: ToolModule;
};

const rendererLoaders = import.meta.glob<RendererModule>('./*/**/Renderer.astro');

const definitions = import.meta.glob<DefinitionModule>('./*/**/index.ts', {
  eager: true,
});

function rendererPathToKey(path: string): string {
  const match = path.match(/(?:^|\/)([^/]+\/[^/]+)\/Renderer\.astro$/);

  if (!match?.[1]) {
    throw new Error(`Invalid tool renderer path: ${path}`);
  }

  return match[1];
}

const rendererByKey = new Map(
  Object.entries(rendererLoaders).map(([path, loader]) => [
    rendererPathToKey(path),
    loader,
  ])
);

const moduleByKey = new Map<string, ToolModule>();

for (const definition of Object.values(definitions)) {
  if (!definition?.toolModule) continue;
  const module = definition.toolModule;

  if (moduleByKey.has(module.key)) {
    throw new Error(`Duplicate tool module key: ${module.key}`);
  }

  moduleByKey.set(module.key, module);
}

export async function getToolRenderer(
  key: string
): Promise<AstroComponentFactory> {
  const loader = rendererByKey.get(key);

  if (!loader) {
    throw new Error(`No Renderer.astro registered for "${key}"`);
  }

  return (await loader()).default;
}

export function parseToolConfig(
  key: string,
  config: Record<string, unknown> = {}
): unknown {
  const module = moduleByKey.get(key);

  if (!module) {
    throw new Error(`No tool module registered for "${key}"`);
  }

  return module.configSchema.parse(config);
}

export function getRegisteredToolKeys(): string[] {
  return [...moduleByKey.keys()].sort();
}

/** Get a tool module by its key. */
export function getToolModule(key: string): ToolModule | undefined {
  return moduleByKey.get(key);
}

/** Return all registered tool modules. */
export function getAllTools(): Array<{ key: string; module: ToolModule }> {
  return [...moduleByKey.entries()].map(([key, module]) => ({ key, module }));
}

/** Return all tool modules that have a seoPages provider. */
export function getAllSeoEnabledTools(): Array<{ key: string; module: ToolModule }> {
  return [...moduleByKey.entries()]
    .filter(([, m]) => m.seoPages != null)
    .map(([key, module]) => ({ key, module }));
}
