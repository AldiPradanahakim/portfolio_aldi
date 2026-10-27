import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '../../data';
import type { CategoryId, Project } from '../../content';
import { Section } from '../../shared/components/Section';
import { LaptopFrame } from '../../shared/components/LaptopFrame';
import { useLang } from '../../shared/context/language';
import { cx } from '../../shared/lib/cn';

type Filter = CategoryId | 'all';

const T = {
  eyebrow: { en: 'Selected work', id: 'Karya pilihan' },
  title: { en: 'Four systems, built end to end', id: 'Empat sistem, dibangun sampai selesai' },
  lead: {
    en: 'Every one of these runs in production — the numbers are measured, not estimated.',
    id: 'Semua pernah dipakai — angkanya diukur, bukan diperkirakan.',
  },
  all: { en: 'All', id: 'Semua' },
  details: { en: 'Read the technical detail', id: 'Baca detail teknis' },
  hideDetails: { en: 'Close the detail', id: 'Tutup detail' },
  problem: { en: 'The problem', id: 'Masalahnya' },
  solution: { en: 'What I built', id: 'Yang saya bangun' },
  demo: { en: 'Live demo', id: 'Demo' },
  repo: { en: 'Repository', id: 'Repositori' },
  empty: { en: 'No projects in this category yet.', id: 'Belum ada proyek pada kategori ini.' },
  hint: { en: 'Scroll to move through the work', id: 'Gulir untuk berpindah proyek' },
};

/** One case study: the product on an iMac, the copy beneath it. */
function Card({ project, index, category }: { project: Project; index: number; category: string }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const initials = project.name.split(' ').map((word) => word[0]).join('').slice(0, 2);

  return (
    <article className={cx('rail-card', open && 'is-open')}>
      <div className="rail-card-media">
        <LaptopFrame
          src={project.cover}
          alt={`${project.name} — ${t(project.tagline)}`}
          initials={initials}
        />
      </div>

      <div className="rail-card-body">
        <div className="case-head">
          <span aria-hidden="true" className="case-index">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="case-name">{project.name}</h3>
        </div>

        <p className="case-lead">{t(project.tagline)}</p>

        <div className="case-links">
          <button
            type="button"
            aria-expanded={open}
            aria-label={`${open ? t(T.hideDetails) : t(T.details)} — ${project.name}`}
            onClick={() => setOpen(!open)}
            className="case-toggle"
          >
            {open ? t(T.hideDetails) : t(T.details)}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
          <span className="case-meta">{category} · {project.year}</span>
        </div>
      </div>

      {/* The numbers and the stack live in their own column, always visible. They used to sit inside
          the expanding detail, which left the card's right third empty and squeezed the detail
          panel to 296px — that is the empty space the eye kept landing on. */}
      <div className="rail-card-facts">
        <dl className="case-metrics">
          {project.metrics.slice(0, 2).map((metric) => (
            <div key={t(metric.label)}>
              <dd className="case-metric-value">{metric.value}</dd>
              <dt className="case-metric-label">{t(metric.label)}</dt>
            </div>
          ))}
        </dl>
        <ul className="case-stack">
          {project.stack.map((item) => (
            <li key={item} className="chip">{item}</li>
          ))}
        </ul>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="case-detail-wrap"
          >
            <div key={lang} className="case-detail">
              <div>
                <p className="eyebrow">{t(T.problem)}</p>
                <p className="mt-2 text-small text-chalk-muted">{t(project.problem)}</p>
              </div>

              <div>
                <p className="eyebrow">{t(T.solution)}</p>
                <p className="mt-2 text-small text-chalk-muted">{t(project.solution)}</p>
              </div>

              <div className="case-detail-actions">
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="work-link">
                    {t(T.demo)} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                {project.links.repo && (
                  <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="work-link">
                    {t(T.repo)} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function Work() {
  const { t } = useLang();
  const { content } = useContent();
  const [filter, setFilter] = useState<Filter>('all');
  const reduced = useReducedMotion();

  const railRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const rulerRef = useRef<HTMLSpanElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const projects = useMemo(
    () => [...content.projects].sort((a, b) => a.order - b.order),
    [content.projects],
  );
  const options: { id: Filter; label: { en: string; id: string } }[] = [
    { id: 'all', label: T.all },
    ...content.categories.map((category) => ({ id: category.id, label: category.label })),
  ];
  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  /**
   * Pinned horizontal scroll, driven by a plain scroll listener rather than a Motion progress
   * value: the mapping needs a hold phase and a measured pixel travel, both cheaper to express
   * directly than to bend a 0..1 value into.
   *
   * Three measured numbers decide the geometry:
   *   travel — how far the track must slide (its overflow past the frame)
   *   hold   — a beat *before* the slide, so the first card is read standing still
   *   height — travel + hold + viewport, written back so the page reserves exactly what is used
   */
  useEffect(() => {
    const rail = railRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!rail || !pin || !track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let travel = 0;
    let hold = 0;
    let snaps: number[] = [];
    let idle = 0;
    let settling = false;

    const update = () => {
      const scrolled = -rail.getBoundingClientRect().top;
      // hold first, then one pixel of slide per pixel of scroll — no easing, so the movement is
      // exactly the gesture and cannot run ahead of or lag behind it
      const p = travel > 0 ? Math.min(1, Math.max(0, (scrolled - hold) / travel)) : 0;
      track.style.setProperty('--p', p.toFixed(4));
      // The hollow box slides along the scale by the same progress the track uses. It is positioned
      // in pixels rather than by a percentage: the ticks are a flex row of fixed widths, so a
      // percentage of the row would drift from them.
      const mark = rulerRef.current;
      const ruler = mark?.parentElement;
      if (mark && ruler) {
        const ticks = Array.from(ruler.querySelectorAll<HTMLElement>('.rail-ruler-tick'));
        if (ticks.length > 1) {
          // read the real tick offsets: the row is space-between, so equal gaps are not guaranteed
          const first = ticks[0].offsetLeft;
          const last = ticks[ticks.length - 1].offsetLeft;
          mark.style.setProperty('--mark-x', `${first + p * (last - first)}px`);
        }
      }
    };

    /**
     * Snap to the nearest card once the gesture ends. The scroll POSITION is moved, not the track:
     * overriding `--p` alone left the page's scroll offset and the track's translation disagreeing,
     * so the next nudge in either direction jumped back to the unsnapped offset. Moving the scroll
     * keeps the two in step, which also means the rail resumes from exactly where it settled.
     */
    const snap = () => {
      if (travel <= 0 || snaps.length < 2 || settling) return;
      const at = -rail.getBoundingClientRect().top - hold;
      const near = snaps.reduce((best, s) => (Math.abs(s - at) < Math.abs(best - at) ? s : best), snaps[0]);
      if (Math.abs(near - at) < 2) return;

      // Scroll position moves INSTANTLY to the exact target; the track animates there with a
      // transition. Doing it the other way round — `behavior: smooth` on the scroll — left the
      // position 128px short (the animation gets cut by the next gesture or by the rail's own
      // height changing), and every later nudge resumed from the wrong offset.
      const origin = rail.getBoundingClientRect().top + window.scrollY;
      settling = true;
      window.scrollTo({ top: origin + hold + near, behavior: 'auto' });

      if (!reduced) {
        track.classList.add('is-snapping');
        track.style.setProperty('--p', (near / travel).toFixed(4));
      }
      window.setTimeout(() => {
        track.classList.remove('is-snapping');
        settling = false;
      }, reduced ? 0 : 380);
    };

    const schedule = () => {
      window.clearTimeout(idle);
      if (travel > 0 && snaps.length > 1) idle = window.setTimeout(snap, 140);
    };

    const onScroll = () => {
      // while the snap is animating, the scroll events come from our own scrollTo and would fight
      // the transition, so the track is left alone until it lands
      if (settling) return;
      update();
      schedule();
    };

    const measure = () => {
      // Panel width: 5:3 like the reference, capped so the panel always fits one screen. The copy
      // sits in its own column INSIDE the panel (see the CSS), which is what keeps the device large
      // enough to read — stacked, the screenshot and the copy together overflowed a 5:3 box.
      const panel = Math.round(
        Math.min(pin.clientWidth * 0.74, (window.innerHeight - 170) * (5 / 3)),
      );
      track.style.setProperty('--panel', `${panel}px`);
      // the ruler is a sibling of the track, so the width has to be published on the pin too
      pin.style.setProperty('--panel', `${panel}px`);

      // Travel runs centre to centre, not edge to edge: the rail is inset by half a viewport on
      // both sides so the first and last card can sit centred, which is what makes a snap land in
      // the middle of the screen instead of jammed against the left edge.
      const cards = Array.from(track.children) as HTMLElement[];
      const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
      travel = Math.max(0, step * (cards.length - 1));

      hold = Math.round(window.innerHeight * 0.25);
      track.style.setProperty('--travel', `${travel}px`);
      rail.style.height = `${Math.round(travel + hold + window.innerHeight)}px`;
      snaps = cards.map((_, i) => i * step);

      update();
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      window.clearTimeout(idle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, [filter]);

  const categoryLabel = (project: Project) => {
    const label = content.categories.find((c) => c.id === project.category)?.label;
    return label ? t(label) : project.category;
  };

  return (
    <Section id="work" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" className="flex flex-wrap items-center gap-2">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={filter === option.id}
              onClick={() => setFilter(option.id)}
              className={cx('work-filter', filter === option.id && 'is-on')}
            >
              {t(option.label)}
            </button>
          ))}
        </div>
        {/* the pinned rail is not obvious on a laptop: without a line saying so, a reader stops
            at the first card and never learns the rest exist */}
        {!reduced && shown.length > 1 && (
          <p aria-hidden="true" className="rail-hint">{t(T.hint)}</p>
        )}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-body text-chalk-muted">{t(T.empty)}</p>
      ) : (
        <div
          ref={railRef}
          className={cx('work-rail', shown.length === 1 && 'is-single')}
          style={{ '--n': shown.length } as React.CSSProperties}
        >
          <div ref={pinRef} className="work-rail-pin">
            {/* The ruler from the reference: one tick per project with a hollow box on the current
                one. It is the only scroll affordance on the panel — a progress bar would read as
                loading, and arrows would fight the snap. */}
            {shown.length > 1 && (
              <div aria-hidden="true" className="rail-ruler">
                <span ref={rulerRef} className="rail-ruler-mark" />
                {shown.map((project) => (
                  <span key={project.slug} className="rail-ruler-tick" />
                ))}
              </div>
            )}
            <div ref={trackRef} className="work-rail-track">
              {shown.map((project) => (
                <Card
                  key={project.slug}
                  project={project}
                  index={projects.indexOf(project)}
                  category={categoryLabel(project)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}