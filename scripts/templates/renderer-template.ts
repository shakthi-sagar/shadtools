export function getRendererTemplate(componentName: string): string {
  return `---
import ${componentName} from './${componentName}';
const { config } = Astro.props;
---

<${componentName} client:load config={config} />
`;
}
