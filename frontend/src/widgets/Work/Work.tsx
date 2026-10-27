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
    <article className="rail-card">
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

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div key={lang} className="case-detail">
                <div>
                  <p className="eyebrow">{t(T.problem)}</p>
                  <p className="mt-2 text-small text-chalk-muted">{t(project.problem)}</p>
                  <p className="eyebrow mt-6">{t(T.solution)}</p>
                  <p className="mt-2 text-small text-chalk-muted">{t(project.solution)}</p>
                </div>

                <div>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {project.metrics.slice(0, 4).map((metric) => (
                      <div key={t(metric.label)}>
                        <dd className="font-display text-giant leading-none text-chalk">{metric.value}</dd>
                        <dt className="mt-1 font-mono text-micro uppercase tracking-[0.14em] text-chalk-faint">
                          {t(metric.label)}
                        </dt>
                      </div>
                    ))}
                  </dl>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <li key={item} className="chip">{item}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-4">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="rail-card-media">
        <LaptopFrame
          src={project.cover}
          alt={`${project.name} — ${t(project.tagline)}`}
          initials={initials}
        />
      </div>

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

      settling = true;
      // `top` is re-read here instead of trusting the cached value: the rail's height changes when
      // images and fonts land, and a cached offset left every snap 5px short of the card edge.
      const origin = rail.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: origin + hold + near, behavior: reduced ? 'auto' : 'smooth' });

      // The smooth scroll fires more scroll events; this window keeps them from re-snapping. The
      // last step is an exact correction, because sub-pixel scroll positions land a few px off.
      window.setTimeout(() => {
        const still = -rail.getBoundingClientRect().top - hold;
        if (Math.abs(near - still) > 1) {
          window.scrollTo({ top: origin + hold + near, behavior: 'auto' });
        }
        settling = false;
      }, reduced ? 60 : 620);
    };

    const schedule = () => {
      window.clearTimeout(idle);
      if (travel > 0 && snaps.length > 1) idle = window.setTimeout(snap, 140);
    };

    const onScroll = () => {
      update();
      if (!settling) schedule();
    };

    const measure = () => {
      // The frame is the pin, not the window: the rail bleeds only to the right, so its width is
      // the viewport minus the container gutter, and a 100vw formula overshoots by that gutter.
      // `--frame` is published so each card can be exactly one frame wide: `width: 100%` cannot do
      // it, because a percentage inside a shrink-to-fit flex track is circular and falls back to
      // auto.
      const frame = pin.clientWidth;
      track.style.setProperty('--frame', `${frame}px`);

      // Travel is derived from the cards' own spacing, not from scrollWidth: the media column
      // deliberately hangs past the frame, so scrollWidth counts pixels that are clipped anyway.
      const cards = Array.from(track.children) as HTMLElement[];
      const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
      travel = Math.max(0, step * (cards.length - 1));

      hold = Math.round(window.innerHeight * 0.3);
      track.style.setProperty('--travel', `${travel}px`);
      rail.style.height = `${Math.round(travel + hold + window.innerHeight)}px`;

      // One snap point per card, at the offset that puts that card's left edge on the frame's left
      // edge. The last point is exactly the travel, which is where the final card comes fully into
      // view — that is what stops the rail from parking with a card sliced down the middle.
      snaps = cards.map((_, i) => Math.min(i * step, travel));
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