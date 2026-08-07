import React from 'react';

export interface FormFieldProps {
  label: string;
  id?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, id, hint, error, children }) => {
  const hintId = id && hint ? `${id}-hint` : undefined;
  const errorId = id && error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-foreground-secondary block select-none">
        {label}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string; 'aria-invalid'?: boolean }>, {
            'aria-describedby': describedBy,
            'aria-invalid': error ? true : undefined,
          })
        : children}
      {hint && !error && (
        <p id={hintId} className="text-[11px] text-foreground-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[11px] text-danger font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
