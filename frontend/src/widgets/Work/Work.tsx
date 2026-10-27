import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '../../data';
import type { CategoryId, Project } from '../../content';
import { Section } from '../../shared/components/Section';
import { IMacFrame } from '../../shared/components/IMacFrame';
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
      <div className="rail-card-media">
        <IMacFrame
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
   * Horizontal scroll: the rail is pinned while the page scrolls through it, and the track slides
   * left by exactly its own overflow. The travel is CSS `calc(var(--p) * (100vw - 100%))`, where
   * 100% is the track width — so nothing has to be measured, and a filter that changes the card
   * count cannot leave a stale pixel value behind. `--p` is written straight to the node, so
   * scrolling never re-renders the cards.
   */
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

    track.style.setProperty('--p', '0');

    // The travel is measured, not derived from `100vw - 100%`: that formula ignores the rail's
    // own padding and the scrollbar, and left the last card 75px past the edge. A ResizeObserver
    // keeps it exact when a filter changes the card count or the window is resized.
    const measure = () => {
      const over = Math.max(0, track.scrollWidth - pin.clientWidth);
      track.style.setProperty('--travel', `${over}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(pin);

    const unsubscribe = scrollYProgress.on('change', (value) => {
      track.style.setProperty('--p', value.toFixed(4));
    });

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [scrollYProgress, filter]);

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