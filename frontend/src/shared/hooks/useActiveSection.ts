import { useEffect, useState } from 'react';

/**
 * Highlights the nav item whose section crosses the middle of the viewport.
 * Tracks the visible set so the indicator clears when no section is in the band
 * (for example at the very top of the page) instead of keeping a stale value.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState('');
  const key = ids.join('|');

  useEffect(() => {
    if (!key) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const ordered = key.split('|');
    const elements = ordered
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(ordered.find((id) => visible.has(id)) ?? '');
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [key]);

  return active;
}
