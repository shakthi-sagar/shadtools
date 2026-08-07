import React from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full p-3 bg-surface-input border border-border text-foreground placeholder:text-foreground-muted font-mono text-sm leading-relaxed focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
