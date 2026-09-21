"use client";

import { forwardRef, useId } from "react";

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, icon, suffix, className = "", id, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-semibold text-ink-2">
        {label}
      </label>
      <div
        className={`flex h-[52px] items-center gap-2.5 rounded-[14px] border bg-surface px-4 transition-[border-color,box-shadow] duration-200 focus-within:border-leaf focus-within:shadow-[0_0_0_4px_var(--leaf-soft)] ${
          error ? "border-danger" : "border-line-strong"
        }`}
      >
        {icon && <span className="shrink-0 text-ink-3">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-3"
          aria-invalid={!!error}
          {...rest}
        />
        {suffix && <span className="shrink-0 text-ink-3">{suffix}</span>}
      </div>
      {error ? (
        <p className="mt-1.5 text-[13px] font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
});

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function TextArea({ label, hint, className = "", id, ...rest }: TextAreaProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-semibold text-ink-2">
        {label}
      </label>
      <textarea
        id={inputId}
        rows={3}
        className="w-full resize-none rounded-[14px] border border-line-strong bg-surface px-4 py-3 text-[16px] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-3 focus:border-leaf focus:shadow-[0_0_0_4px_var(--leaf-soft)]"
        {...rest}
      />
      {hint && <p className="mt-1.5 text-[13px] text-ink-3">{hint}</p>}
    </div>
  );
}
