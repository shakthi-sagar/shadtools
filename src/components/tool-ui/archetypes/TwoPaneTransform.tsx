import React, { useState } from 'react';
import { CodeEditorPane } from '@/components/tool-ui/CodeEditorPane';
import { Copy, Check, Share2, ArrowRightLeft, Trash2 } from 'lucide-react';

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
  const resolvedInputPlaceholder = inputPlaceholder || placeholder || 'Type or paste content here...';
  const resolvedActiveMode = mode || activeMode;

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const handleCopyLink = () => {
    if (onCopyStateUrl) {
      onCopyStateUrl();
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-[1120px] mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 rounded-lg border border-border">
        {/* Mode Selector Tabs */}
        {modeOptions && modeOptions.length > 0 && onModeChange ? (
          <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-md border border-border">
            {modeOptions.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onModeChange(m.id)}
                className={`px-3 py-1 text-xs font-mono font-medium rounded transition-colors ${
                  resolvedActiveMode === m.id
                    ? 'bg-accent text-accent-foreground font-semibold shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        ) : modes && modes.length > 0 && onModeChange ? (
          <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-md border border-border">
            {modes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onModeChange(m)}
                className={`px-3 py-1 text-xs font-mono font-medium rounded transition-colors ${
                  resolvedActiveMode === m
                    ? 'bg-accent text-accent-foreground font-semibold shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs font-mono font-semibold text-foreground-secondary uppercase tracking-wider">
            {resolvedInputLabel} → {resolvedOutputLabel}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {actions}

          {onSwap && (
            <button
              type="button"
              onClick={onSwap}
              className="px-2.5 py-1 text-xs font-mono text-foreground-secondary hover:text-foreground bg-surface-subtle border border-border rounded transition-colors flex items-center gap-1"
              title="Swap Input & Output"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Swap</span>
            </button>
          )}

          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="px-2.5 py-1 text-xs font-mono text-foreground-secondary hover:text-foreground bg-surface-subtle border border-border rounded transition-colors flex items-center gap-1"
              title="Clear Input"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-2.5 py-1 text-xs font-mono text-foreground-secondary hover:text-foreground bg-surface-subtle border border-border rounded transition-colors flex items-center gap-1"
            title="Copy shareable URL"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Dual Pane Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border rounded-lg overflow-hidden bg-surface">
        <CodeEditorPane
          label={resolvedInputLabel}
          value={input}
          onChange={onInputChange}
          placeholder={resolvedInputPlaceholder}
          minHeightClass="min-h-[240px]"
        />

        <CodeEditorPane
          label={resolvedOutputLabel}
          value={output}
          readOnly
          error={resolvedError}
          placeholder={outputPlaceholder}
          minHeightClass="min-h-[240px]"
          actions={
            <button
              type="button"
              onClick={handleCopyOutput}
              disabled={!output || !!resolvedError}
              className="px-2 py-0.5 text-xs font-mono text-accent hover:text-accent-hover disabled:opacity-40 flex items-center gap-1"
            >
              {copiedOutput ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              <span>{copiedOutput ? 'Copied' : 'Copy'}</span>
            </button>
          }
        />
      </div>
    </div>
  );
};
