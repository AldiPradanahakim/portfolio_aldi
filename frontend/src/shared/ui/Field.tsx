import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '../lib/cn';

const field =
  'w-full rounded-xl border bg-ink-900 px-4 py-3 text-body text-chalk placeholder:text-chalk-faint transition-colors duration-fast';

const normal = 'border-ink-800 hover:border-ink-700 focus:border-accent';
const invalid = 'border-danger-border';

const labelClass = 'text-small font-medium text-chalk';
const errorClass = 'text-small text-danger';

interface SharedProps {
  id: string;
  label: string;
  error?: string;
}

type TextFieldProps = SharedProps & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ id, label, error, className, ...rest }: TextFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(field, error ? invalid : normal, className)}
        {...rest}
      />
      {error && (
        <p id={errorId} className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

type TextAreaFieldProps = SharedProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ id, label, error, className, ...rest }: TextAreaFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(field, 'min-h-36 resize-y', error ? invalid : normal, className)}
        {...rest}
      />
      {error && (
        <p id={errorId} className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}
