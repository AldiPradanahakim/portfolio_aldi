import type { ReactNode } from 'react';
import type { L, SiteContent } from '../content/types';

export const inputCls =
  'w-full rounded-lg border border-ink-800 bg-ink-900 px-3 py-2 text-small text-chalk outline-none transition focus:border-accent';
export const monoInputCls =
  'w-full rounded-lg border border-ink-800 bg-ink-900 px-3 py-2 font-mono text-small text-chalk outline-none transition focus:border-accent';
export const labelCls = 'mb-1 block text-label uppercase tracking-[0.1em] text-chalk-faint';
export const hintCls = 'mt-1 block text-small text-chalk-muted';

export interface EditorProps {
  draft: SiteContent;
  update: (fn: (current: SiteContent) => SiteContent) => void;
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      {children}
      {hint ? <span className={hintCls}>{hint}</span> : null}
      {error ? <span className="mt-1 block text-small text-danger">{error}</span> : null}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  mono,
  type,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <input
      type={type ?? 'text'}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(event) => onChange(event.target.value)}
      className={mono ? monoInputCls : inputCls}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      className={inputCls}
    />
  );
}

/** Input bilingual: dua kolom `id` dan `en` untuk satu nilai `L`. */
export function LField({
  label,
  value,
  onChange,
  multiline,
  mono,
}: {
  label: string;
  value: L;
  onChange: (value: L) => void;
  multiline?: boolean;
  mono?: boolean;
}) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-chalk-faint">id</span>
          {multiline ? (
            <TextArea value={value.id} onChange={(next) => onChange({ ...value, id: next })} />
          ) : (
            <TextInput value={value.id} mono={mono} onChange={(next) => onChange({ ...value, id: next })} />
          )}
        </div>
        <div>
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-chalk-faint">en</span>
          {multiline ? (
            <TextArea value={value.en} onChange={(next) => onChange({ ...value, en: next })} />
          ) : (
            <TextInput value={value.en} mono={mono} onChange={(next) => onChange({ ...value, en: next })} />
          )}
        </div>
      </div>
    </Field>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full ring-1 ring-inset transition ${
        checked ? 'bg-accent ring-accent' : 'bg-ink-850 ring-ink-700'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-chalk transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as T)} className={inputCls}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type BtnVariant = 'primary' | 'ghost' | 'danger';

const btnStyles: Record<BtnVariant, string> = {
  primary: 'bg-accent text-ink-950 hover:bg-accent-hover',
  ghost: 'border border-ink-800 text-chalk hover:border-ink-700',
  danger: 'border border-danger-border text-danger hover:border-danger',
};

export function Btn({
  onClick,
  children,
  variant = 'ghost',
  disabled,
  type = 'button',
  ariaLabel,
}: {
  onClick?: () => void;
  children: ReactNode;
  variant?: BtnVariant;
  disabled?: boolean;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`rounded-lg px-3 py-2 text-small font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${btnStyles[variant]}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'ok' | 'danger' }) {
  const tones = {
    neutral: 'border-ink-700 text-chalk-muted',
    accent: 'border-accent text-accent',
    ok: 'border-accent text-accent',
    danger: 'border-danger-border text-danger',
  } as const;
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/**
 * Daftar item dengan tombol tambah/hapus. `render` menerima item + indeks
 * supaya editor bisa mengganti satu baris tanpa menulis ulang pola map/filter.
 */
export function ListEditor<T>({
  items,
  onChange,
  render,
  create,
  addLabel,
  emptyLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, index: number) => ReactNode;
  create: () => T;
  addLabel: string;
  emptyLabel: string;
}) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? <p className="text-small text-chalk-faint">{emptyLabel}</p> : null}
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-ink-800 bg-ink-900 p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">{render(item, index)}</div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="shrink-0 rounded-lg border border-ink-800 px-2 py-1 text-small text-chalk-muted transition hover:border-danger hover:text-danger"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, create()])}
        className="w-full rounded-xl border border-dashed border-ink-700 py-2 text-small text-chalk-muted transition hover:border-accent hover:text-accent"
      >
        {addLabel}
      </button>
    </div>
  );
}