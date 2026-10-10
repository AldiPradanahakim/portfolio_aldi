import { useEffect, useState } from 'react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { PROFILE } from '../../content';
import { Monogram } from '../../shared/components/Monogram';
import { useLang } from '../../shared/context/language';
import { buttonStyles } from '../../shared/ui/buttonStyles';

const T = {
  seeWork: { en: 'See my work', id: 'Lihat proyek saya' },
  hireMe: { en: 'Hire me', id: 'Hubungi saya' },
};

/** The plate wall is square and covers the square portrait slot exactly. */
const BRICK_COLS = 5;
const BRICK_ROWS = 5;
/** Waits for the curtain to start lifting (600 ms) before the first plate goes. */
const BRICK_START_MS = 150;
const BRICK_STAGGER_MS = 24;
/** Longest diagonal delay (8 × 24 ms, bottom-right corner) + the plate animation, on top of the
 *  start — after this the layer is unmounted, so the portrait keeps no animation nodes at rest. */
const BRICK_TOTAL_MS = BRICK_START_MS + BRICK_STAGGER_MS * (BRICK_COLS + BRICK_ROWS - 2) + 460;

const BRICKS = Array.from({ length: BRICK_COLS * BRICK_ROWS }, (_, index) => {
  const row = Math.floor(index / BRICK_COLS);
  const column = index % BRICK_COLS;
  return { index, delay: BRICK_START_MS + (row + column) * BRICK_STAGGER_MS };
});

/**
 * The bricks are an opening flourish for the portrait, not a decoration to keep: they are
 * unmounted once the last plate has dissolved, and `bricksShown` — module scope, so it survives
 * the remount that switching panels causes — keeps them from replaying on every return to the
 * opening panel.
 */
let bricksShown = false;

export function Hero() {
  const { t } = useLang();
  // A missing or broken file falls back to the monogram instead of a broken image.
  const [photoFailed, setPhotoFailed] = useState(false);
  const photo = PROFILE.photo && !photoFailed ? PROFILE.photo : null;
  const [bricks, setBricks] = useState(!bricksShown);

  useEffect(() => {
    if (!bricks) return;
    let frame = 0;
    let timer = 0;
    const drop = () => {
      bricksShown = true;
      setBricks(false);
    };
    // The plates are gated on the intro curtain through `html[data-intro]`, so their clock has to
    // start when that attribute flips, not when the hero mounts — mounting early would dissolve
    // the whole flourish behind the curtain where nobody can see it.
    const watch = () => {
      if (document.documentElement.dataset.intro === 'done') {
        timer = window.setTimeout(drop, BRICK_TOTAL_MS);
      } else {
        frame = requestAnimationFrame(watch);
      }
    };
    watch();
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [bricks]);

  /** Stagger inside the hero's single entrance; the delay is the whole ordering. */
  const rise = (step: number) => ({ animationDelay: `${step * 70}ms` });

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden py-10 sm:py-14"
    >
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[560px]"
      />

      <div className="shell relative">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div>
            <p
              className="hero-rise inline-flex items-center gap-2 rounded-full border border-ink-800 bg-ink-900 px-3 py-1.5 text-small text-chalk-muted"
              style={rise(0)}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t(PROFILE.availability)}
            </p>

            <h1
              id="hero-title"
              className="hero-rise mt-6 text-display font-semibold text-chalk"
              style={rise(1)}
            >
              {PROFILE.name}
            </h1>

            <p
              className="hero-rise mt-4 font-mono text-label uppercase text-accent"
              style={rise(2)}
            >
              {t(PROFILE.role)}
            </p>

            <p className="hero-rise mt-6 max-w-xl text-body text-chalk-muted" style={rise(3)}>
              {t(PROFILE.tagline)}
            </p>

            <div className="hero-rise mt-10 flex flex-wrap items-center gap-3" style={rise(4)}>
              <a href="#work" className={buttonStyles('primary', 'lg')}>
                {t(T.seeWork)}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#contact" className={buttonStyles('secondary', 'lg')}>
                {t(T.hireMe)}
              </a>
            </div>

            <ul
              className="hero-rise mt-12 flex flex-wrap gap-x-8 gap-y-3 text-small text-chalk-muted"
              style={rise(5)}
            >
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-chalk-faint" aria-hidden="true" />
                {t(PROFILE.location)}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-chalk-faint" aria-hidden="true" />
                {t(PROFILE.responseTime)}
              </li>
            </ul>
          </div>

          <div className="portrait-frame mx-auto w-full max-w-[260px] lg:max-w-none">
            {/* behind the photo: two counter-rotating arcs of light */}
            <div aria-hidden="true" className="portrait-aurora" />
            <div aria-hidden="true" className="portrait-aurora portrait-aurora-2" />
            <div aria-hidden="true" className="portrait-glow pointer-events-none absolute -inset-6" />

            <div className="portrait-float">
              {photo ? (
                <img
                  src={photo}
                  alt={PROFILE.name}
                  width={760}
                  height={950}
                  loading="eager"
                  decoding="async"
                  onError={() => setPhotoFailed(true)}
                  /* The file is already a head-and-shoulders cut-out on transparency, scaled to
                     twice the width of this column, so `object-cover` never has to crop it. No
                     frame or background: the subject has to sit on the panel, not in a box. */
                  className="portrait-in relative aspect-[4/5] w-full object-cover"
                />
              ) : (
                <Monogram initials={PROFILE.initials} className="portrait-in relative w-full" />
              )}

              {/* builds the portrait in brick by brick, over whatever the slot is showing */}
              {bricks && (
                <span aria-hidden="true" className="brick-grid">
                  {BRICKS.map((brick) => (
                    <span
                      key={brick.index}
                      className="brick"
                      style={{ animationDelay: `${brick.delay}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
