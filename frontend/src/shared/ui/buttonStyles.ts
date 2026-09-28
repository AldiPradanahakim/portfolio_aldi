import { cx } from '../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-ink-950 hover:bg-accent-soft',
  secondary: 'border border-ink-700 text-chalk hover:border-ink-600 hover:bg-ink-900',
  ghost: 'text-chalk-muted hover:text-chalk',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-small',
  md: 'px-5 py-2.5 text-small',
  lg: 'px-6 py-3 text-body',
};

/** Shared with <Link>/<a> so they can wear the same skin without a polymorphic component. */
export const buttonStyles = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md') =>
  cx(base, variants[variant], sizes[size]);
