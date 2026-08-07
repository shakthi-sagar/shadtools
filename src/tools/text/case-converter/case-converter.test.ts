import { describe, it, expect } from 'vitest';
import { convertCases } from '@/tools/text/case-converter/case-converter';

describe('Case Converter Engine', () => {
  it('converts multi-word string into all cases', () => {
    const res = convertCases('hello world example');
    expect(res.camelCase).toBe('helloWorldExample');
    expect(res.kebabCase).toBe('hello-world-example');
    expect(res.snakeCase).toBe('hello_world_example');
    expect(res.constantCase).toBe('HELLO_WORLD_EXAMPLE');
    expect(res.pascalCase).toBe('HelloWorldExample');
  });
});
