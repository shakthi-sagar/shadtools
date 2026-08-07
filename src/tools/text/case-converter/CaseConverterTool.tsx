import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Type } from 'lucide-react';
import { convertCases } from '@/tools/text/case-converter/case-converter';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { Button } from '@/components/ui/Button';

export interface CaseConverterToolProps {
  config?: any;
}

export const CaseConverterTool: React.FC<CaseConverterToolProps> = () => {
  const [input, setInput] = useState<string>('hello world example');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const converted = convertCases(input);

  const handleCopy = (key: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReset = () => {
    setInput('');
  };

  const caseItems = [
    { key: 'camelCase', label: 'camelCase', value: converted.camelCase },
    { key: 'kebabCase', label: 'kebab-case', value: converted.kebabCase },
    { key: 'snakeCase', label: 'snake_case', value: converted.snakeCase },
    { key: 'constantCase', label: 'CONSTANT_CASE', value: converted.constantCase },
    { key: 'pascalCase', label: 'PascalCase', value: converted.pascalCase },
    { key: 'titleCase', label: 'Title Case', value: converted.titleCase },
    { key: 'lowercase', label: 'lowercase', value: converted.lowercase },
    { key: 'uppercase', label: 'UPPERCASE', value: converted.uppercase },
  ];

  return (
    <ToolFrame className="shadow-xs border-border">
      {/* Top IDE Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground tracking-tight flex items-center gap-2">
            <Type className="w-4 h-4 text-accent" />
            Case Converter
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={!input}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="h-8 text-xs font-medium text-foreground-muted hover:text-foreground"
        >
          Reset
        </Button>
      </div>

      <div className="p-5 sm:p-6 space-y-6 bg-surface">
        {/* Input String Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-foreground-secondary uppercase tracking-wider font-mono">
            <label htmlFor="case-input">Input String</label>
            <span className="font-mono text-foreground-muted">{input.length} characters</span>
          </div>
          <textarea
            id="case-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text to convert between case conventions..."
            className="w-full p-4 rounded-md bg-surface-input border border-border text-foreground font-mono text-xs leading-relaxed outline-none ring-0 focus:outline-none focus:ring-0 focus:border-border-strong min-h-[100px] resize-none transition-colors shadow-none"
            autoFocus
          />
        </div>

        {/* Converted Case Output Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {caseItems.map((item) => (
            <div key={item.key} className="p-3.5 rounded-md bg-surface-subtle/50 border border-border space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground font-mono uppercase tracking-wider">{item.label}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopy(item.key, item.value)}
                  disabled={!item.value}
                  leftIcon={copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  className="px-2.5 h-6 text-[11px] font-medium"
                >
                  {copiedKey === item.key ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border text-foreground font-mono text-xs font-semibold break-all leading-relaxed">
                {item.value || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolFrame>
  );
};
