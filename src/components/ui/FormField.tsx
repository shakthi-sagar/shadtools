import React from 'react';

export interface FormFieldProps {
  label: string;
  id?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, id, hint, error, children }) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-300 block">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
    </div>
  );
};
