import React, { useState } from 'react';
import { CodeEditorPane } from '@/components/tool-ui/CodeEditorPane';
import { countTextStats } from './word-counter';

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState<string>('ShadTools is a fast, free, privacy-first web utility suite built for developers and power users.');

  const stats = countTextStats(text);

  return (
    <div className="space-y-6 max-w-[1120px] mx-auto">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
          <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider font-mono">Words</span>
          <p className="text-2xl font-bold font-mono text-foreground">{stats.words.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
          <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider font-mono">Characters</span>
          <p className="text-2xl font-bold font-mono text-accent">{stats.characters.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
          <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider font-mono">Sentences</span>
          <p className="text-2xl font-bold font-mono text-foreground">{stats.sentences.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
          <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider font-mono">Reading Time</span>
          <p className="text-2xl font-bold font-mono text-foreground">{stats.readingTimeMinutes} min</p>
        </div>
      </div>

      {/* Main Input Textarea */}
      <div className="border border-border rounded-lg overflow-hidden bg-surface">
        <CodeEditorPane
          label="Text Content"
          value={text}
          onChange={setText}
          placeholder="Paste or type text to count words, characters, and sentences..."
          minHeightClass="min-h-[300px]"
          autoFocus
        />
      </div>

      {/* Additional Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-subtle p-4 rounded-lg border border-border text-xs font-mono">
        <div>
          <span className="text-foreground-muted block">No-Space Chars:</span>
          <span className="font-bold text-foreground">{stats.charactersNoSpaces}</span>
        </div>
        <div>
          <span className="text-foreground-muted block">Lines:</span>
          <span className="font-bold text-foreground">{stats.lines}</span>
        </div>
        <div>
          <span className="text-foreground-muted block">Paragraphs:</span>
          <span className="font-bold text-foreground">{stats.paragraphs}</span>
        </div>
        <div>
          <span className="text-foreground-muted block">Speaking Time:</span>
          <span className="font-bold text-foreground">{stats.speakingTimeMinutes} min</span>
        </div>
      </div>
    </div>
  );
};
