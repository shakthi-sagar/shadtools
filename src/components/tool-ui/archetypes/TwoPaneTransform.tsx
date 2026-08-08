import React, { useState } from 'react';
import { ArrowRightLeft, Check, Copy, Link as LinkIcon, Trash2 } from 'lucide-react';
import { CodeEditorPane } from '@/components/tool-ui/CodeEditorPane';
import { ToolFrame } from '@/components/tool-ui/ToolFrame';
import { Button } from '@/components/ui/Button';

export interface ModeOption {
  id: string;
  label: string;
}

export interface TwoPaneTransformProps {
  inputLabel?: string;
  outputLabel?: string;
  inputTitle?: string;
  outputTitle?: string;
  input: string;
  output: string;
  onInputChange: (value: string) => void;
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
  onCopyStateUrl?: () => void | Promise<void>;
  onTransform?: () => void;
}

export const TwoPaneTransform: React.FC<TwoPaneTransformProps> = ({
  inputLabel,
  outputLabel,
  inputTitle,
  outputTitle,
  input,
  output,
  onInputChange,
  error,
  errorMessage,
  placeholder,
  inputPlaceholder,
  outputPlaceholder,
  modes,
  mode,
  activeMode,
  onModeChange,
  modeOptions,
  actions,
  onClear,
  onSwap,
  onCopyStateUrl,
}) => {
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const resolvedInputLabel = inputTitle || inputLabel || 'Input';
  const resolvedOutputLabel = outputTitle || outputLabel || 'Output';
  const resolvedError = errorMessage ?? error;
  const resolvedInputPlaceholder = inputPlaceholder || placeholder || 'Type or paste content here…';
  const resolvedActiveMode = mode || activeMode;
  const resolvedModes = modeOptions ?? modes?.map((item) => ({ id: item, label: item }));

  const handleCopyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const handleCopyLink = async () => {
    if (onCopyStateUrl) {
      await onCopyStateUrl();
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <ToolFrame>
      <div className="min-h-[50px] px-3 sm:px-4 py-2.5 bg-surface-subtle border-b border-border flex flex-wrap items-center justify-between gap-3">
        {resolvedModes && resolvedModes.length > 0 && onModeChange ? (
          <div className="inline-flex items-center gap-1 p-1 rounded-md bg-surface border border-border" aria-label="Transform mode">
            {resolvedModes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onModeChange(item.id)}
                aria-pressed={resolvedActiveMode === item.id}
                className={`h-7 px-3 rounded text-xs font-medium transition-colors ${
                  resolvedActiveMode === item.id
                    ? 'bg-action text-action-foreground shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface-subtle'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
            <ArrowRightLeft className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>{resolvedInputLabel} to {resolvedOutputLabel}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {onSwap && (
            <Button type="button" variant="secondary" size="sm" onClick={onSwap} leftIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}>
              Swap
            </Button>
          )}
          {onClear && (
            <Button type="button" variant="secondary" size="sm" onClick={onClear} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
              Clear
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopyLink}
            leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <LinkIcon className="w-3.5 h-3.5" />}
          >
            {copiedLink ? 'Link copied' : 'Share'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border bg-surface">
        <CodeEditorPane
          label={resolvedInputLabel}
          value={input}
          onChange={onInputChange}
          placeholder={resolvedInputPlaceholder}
          minHeightClass="min-h-[280px]"
        />

        <CodeEditorPane
          label={resolvedOutputLabel}
          value={output}
          readOnly
          error={resolvedError}
          placeholder={outputPlaceholder}
          minHeightClass="min-h-[280px]"
          actions={
            <button
              type="button"
              onClick={handleCopyOutput}
              disabled={!output || !!resolvedError}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {copiedOutput ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedOutput ? 'Copied' : 'Copy'}</span>
            </button>
          }
        />
      </div>
    </ToolFrame>
  );
};
