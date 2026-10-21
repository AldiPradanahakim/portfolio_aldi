import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cx } from '../lib/cn';

/**
 * Floating-label field. The label rests inside the control and floats on focus or when the
 * control holds a value; both moves are transform-only. The focus underline is a sibling
 * hairline scaled with `scaleX`, so nothing about the field's box ever changes.
 */

const control =
  'peer w-full appearance-none border-0 border-b border-ink-800 bg-transparent px-0 pb-2 pt-6 text-body text-chalk outline-none transition-colors duration-fast focus:border-ink-700';

const labelBase =
  'pointer-events-none absolute left-0 top-6 origin-left text-body text-chalk-faint transition-transform duration-fast peer-focus:-translate-y-[22px] peer-focus:scale-[0.78] peer-focus:text-accent';

const floated = '-translate-y-[22px] scale-[0.78]';

interface SharedProps {
  id: string;
  label: string;
  error?: string;
}

function Frame({
  id,
  label,
  error,
  filled,
  children,
}: SharedProps & { filled: boolean; children: ReactNode }) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col">
      <div className="relative">
        {children}
        <label htmlFor={id} className={cx(labelBase, filled && floated)}>
          {label}
        </label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-fast peer-focus:scale-x-100"
        />
      </div>
      {/* reserved line: an error appears without moving the field below it */}
      <p
        id={errorId}
        className={cx('mt-2 min-h-[1.25rem] text-small', error ? 'text-danger' : 'invisible')}
      >
        {error ?? '\u00a0'}
      </p>
    </div>
  );
}

type TextFieldProps = SharedProps & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ id, label, error, className, ...rest }: TextFieldProps) {
  const errorId = `${id}-error`;
  return (
    <Frame
      id={id}
      label={label}
      error={error}
      filled={rest.value != null && String(rest.value) !== ''}
    >
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(control, error && 'border-danger-border', className)}
        {...rest}
      />
    </Frame>
  );
}

type TextAreaFieldProps = SharedProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ id, label, error, className, ...rest }: TextAreaFieldProps) {
  const errorId = `${id}-error`;
  return (
    <Frame
      id={id}
      label={label}
      error={error}
      filled={rest.value != null && String(rest.value) !== ''}
    >
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(control, 'min-h-36 resize-y', error && 'border-danger-border', className)}
        {...rest}
      />
    </Frame>
  );
}
