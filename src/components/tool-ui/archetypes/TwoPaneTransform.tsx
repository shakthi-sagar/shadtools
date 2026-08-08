import React, { useState } from 'react';
import { ArrowLeftRight, Check, Copy, Link, Trash2 } from 'lucide-react';
import { CodeEditorPane } from '@/components/tool-ui/CodeEditorPane';

export interface ModeOption { id: string; label: string; }
export interface TwoPaneTransformProps {
  inputLabel?: string;
  outputLabel?: string;
  inputTitle?: string;
  outputTitle?: string;
  input: string;
  output: string;
  onInputChange: (val: string) => void;
  error?: string | null;
  errorMessage?: string | null;
  placeholder?: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  modes?: string[];
  mode?: string;
  activeMode?: string;
  onModeChange?: (mode: string) => void;
  modeOptions?: ModeOption[];
  actions?: React.ReactNode;
  onClear?: () => void;
  onSwap?: () => void;
  onCopyStateUrl?: () => void;
  onTransform?: () => void;
}

export const TwoPaneTransform: React.FC<TwoPaneTransformProps> = ({
  inputLabel, outputLabel, inputTitle, outputTitle, input, output, onInputChange,
  error, errorMessage, placeholder, inputPlaceholder, outputPlaceholder, modes,
  mode, activeMode, onModeChange, modeOptions, actions, onClear, onSwap, onCopyStateUrl,
}) => {
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const inputName = inputTitle || inputLabel || 'Input';
  const outputName = outputTitle || outputLabel || 'Output';
  const selectedMode = mode || activeMode;
  const options = modeOptions || modes?.map((item) => ({ id: item, label: item }));

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 1800);
  };
  const copyLink = () => {
    if (onCopyStateUrl) onCopyStateUrl();
    else navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1800);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex min-h-[48px] flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-subtle px-3 py-2 sm:px-4">
        {options?.length && onModeChange ? (
          <div className="flex items-center rounded-md border border-border bg-surface p-0.5">
            {options.map((item) => (
              <button key={item.id} type="button" onClick={() => onModeChange(item.id)} className={`h-7 rounded px-2.5 text-xs font-medium ${selectedMode === item.id ? 'bg-accent text-accent-foreground' : 'text-foreground-secondary hover:bg-surface-hover hover:text-foreground'}`}>
                {item.label}
              </button>
            ))}
          </div>
        ) : <span className="text-xs font-medium text-foreground-secondary">{inputName} to {outputName}</span>}

        <div className="flex flex-wrap items-center gap-1.5">
          {actions}
          {onSwap && <button type="button" onClick={onSwap} title="Swap input and output" className="tool-action"><ArrowLeftRight className="h-3.5 w-3.5" /><span className="hidden sm:inline">Swap</span></button>}
          {onClear && <button type="button" onClick={onClear} title="Clear input" className="tool-action"><Trash2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Clear</span></button>}
          <button type="button" onClick={copyLink} title="Copy shareable link" className="tool-action">
            {copiedLink ? <Check className="h-3.5 w-3.5 text-success" /> : <Link className="h-3.5 w-3.5" />}<span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      <div className="grid min-h-[280px] divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
        <CodeEditorPane label={inputName} value={input} onChange={onInputChange} placeholder={inputPlaceholder || placeholder || 'Type or paste content here...'} minHeightClass="min-h-[260px]" />
        <CodeEditorPane
          label={outputName}
          value={output}
          readOnly
          error={errorMessage ?? error}
          placeholder={outputPlaceholder}
          minHeightClass="min-h-[260px]"
          actions={
            <button type="button" onClick={copyOutput} disabled={!output || Boolean(errorMessage ?? error)} className="inline-flex items-center gap-1 text-[10px] font-medium text-accent disabled:opacity-40">
              {copiedOutput ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}{copiedOutput ? 'Copied' : 'Copy'}
            </button>
          }
        />
      </div>
    </div>
  );
};
