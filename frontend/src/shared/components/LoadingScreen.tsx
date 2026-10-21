import { useEffect, useRef, useState } from 'react';
import { PROFILE } from '../../content';
import { useLang } from '../context/language';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const T = { loading: { en: 'Loading', id: 'Memuat' } };

/** How long the counter takes when nothing is left to wait for. */
const COUNT_MS = 900;
/** Hard ceiling: a slow device is never punished for a script or font that will not settle. */
const CAP_MS = 1500;
/** Curtain travel, matched by the transition on `.intro`. */
const LIFT_MS = 700;

type Phase = 'count' | 'lift' | 'gone';

/** Three rolling digit columns: 000 → 100. Each column is a 0–9 reel translated on `transform`. */
function RollingDigits({ value }: { value: number }) {
  const digits = String(Math.min(100, value)).padStart(3, '0').split('');
  return (
    <span className="intro-count" aria-hidden="true">
      {digits.map((digit, index) => (
        <span key={index} className="intro-digit">
          <span
            className="intro-digit-reel"
            style={{ transform: `translate3d(0, -${Number(digit) * 10}%, 0)` }}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * The one entrance animation: a full-screen curtain with a rolling counter on it, which lifts
 * away to reveal a hero that has been held back and is choreographed to arrive as the curtain
 * clears.
 *
 * The two ends are wired through `data-intro` on `<html>` — `pending` (set before first paint by
 * the inline script in index.html) holds the hero hidden, and flipping it to `done` here starts
 * every hero animation at once. The same script carries a 2.5 s escape hatch, so the hero can
 * never be left hidden by a failure in this component.
 *
 * It is skipped outright — no curtain, no counter — for Reduce Motion and for bfcache/back
 * navigation, where an entrance animation would only be in the way.
 */
export function LoadingScreen() {
  const { t } = useLang();
  const reduced = usePrefersReducedMotion();
  // Deliberately *not* `document.readyState === 'complete'`: React routinely mounts after the
  // load event, which would silently skip the animation on most first visits too.
  const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  const skip = reduced || navigation?.type === 'back_forward';
  const [phase, setPhase] = useState<Phase>(() => (skip ? 'gone' : 'count'));
  const [percent, setPercent] = useState(0);
  /** Flipped once the document, its fonts and its first paints are all out of the way. */
  const settled = useRef(false);

  // Skipping means the hero must be released immediately: nothing will lift a curtain that is
  // never rendered. `reduced` is live (usePrefersReducedMotion resubscribes), so a mid-session
  // switch to Reduce Motion tears the mounted curtain down and releases the hero at once.
  useEffect(() => {
    if (!reduced) return;
    document.documentElement.dataset.intro = 'done';
    setPhase('gone');
  }, [reduced]);

  useEffect(() => {
    if (!skip) return;
    document.documentElement.dataset.intro = 'done';
  }, [skip]);

  useEffect(() => {
    if (phase !== 'count') return;

    const started = performance.now();
    let frame = 0;
    const settle = () => {
      settled.current = true;
    };
    // Whichever comes last of "document finished" and "fonts ready" releases the counter; the
    // ceiling only exists for a font that never resolves.
    if (document.readyState === 'complete') settle();
    else window.addEventListener('load', settle, { once: true });
    document.fonts?.ready.then(settle);
    const cap = window.setTimeout(settle, CAP_MS);

    const tick = (now: number) => {
      const elapsed = Math.min((now - started) / COUNT_MS, 1);
      // Held just short of the end while something is still loading, so the counter reads as
      // "working" rather than stalling at 100.
      const shown = settled.current ? elapsed : Math.min(elapsed * 0.9, 0.9);
      const next = Math.round(shown * 100);
      setPercent((previous) => (previous === next ? previous : next));
      if (shown >= 1) {
        document.documentElement.dataset.intro = 'done';
        setPhase('lift');
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(cap);
      window.removeEventListener('load', settle);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'lift') return;
    const timer = window.setTimeout(() => setPhase('gone'), LIFT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <div className="intro" data-done={phase === 'lift'} role="status" aria-live="polite">
      <span className="sr-only">{t(T.loading)}</span>
      <div aria-hidden="true" className="intro-inner">
        <span className="intro-mark">{PROFILE.initials}</span>
        <span className="intro-name">{PROFILE.name}</span>
        <RollingDigits value={percent} />
        <span className="intro-track">
          <span className="intro-fill" style={{ transform: `scaleX(${percent / 100})` }} />
        </span>
      </div>
    </div>
  );
}
