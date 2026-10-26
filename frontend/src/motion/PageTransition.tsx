import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../shared/lib/cn';
import { usePrefersReducedMotion } from '../shared/hooks/usePrefersReducedMotion';

interface PageTransitionProps {
  children: ReactNode;
  /** changes identity (e.g. a project slug) so an in-place navigation can cross-fade */
  routeKey?: string;
  className?: string;
}

type TransitionDocument = {
  startViewTransition?: (callback: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

/**
 * Route content wrapper. Mounts with a CSS fade/rise and, when the View Transitions API is
 * present and `routeKey` changes without a remount (project → project), wraps the swap in
 * `document.startViewTransition` so the browser cross-fades. Plain keyed render otherwise.
 */
export function PageTransition({ children, routeKey, className }: PageTransitionProps) {
  const reduced = usePrefersReducedMotion();
  const [key, setKey] = useState(routeKey ?? '');

  useEffect(() => {
    if (routeKey === undefined || key === routeKey) return;
    const apply = () => setKey(routeKey);
    const doc = document as TransitionDocument;
    if (!reduced && typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  }, [routeKey, key, reduced]);

  return (
    <div key={key} className={cx('page-enter', className)}>
      {children}
    </div>
  );
}