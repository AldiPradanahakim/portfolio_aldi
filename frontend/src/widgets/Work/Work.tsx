import { useLayoutEffect, useRef, useState } from 'react';
import { CATEGORIES, PROJECTS, type CategoryId } from '../../content';
import { ProjectCard } from '../../entities/ProjectCard/ProjectCard';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';
import { cx } from '../../shared/lib/cn';

type Filter = CategoryId | 'all';

const T = {
  eyebrow: { en: 'Selected work', id: 'Karya terpilih' },
  title: {
    en: 'Projects, with the details usually left out',
    id: 'Proyek, lengkap dengan hal yang biasanya dihilangkan',
  },
  lead: {
    en: 'Real work with its actual stack and figures taken from the code itself — including what the problem was and how it was solved.',
    id: 'Pekerjaan nyata beserta teknologi dan angkanya yang diambil langsung dari kodenya — termasuk apa masalahnya dan bagaimana diselesaikan.',
  },
  filterLabel: {
    en: 'Filter projects by category',
    id: 'Saring proyek berdasarkan kategori',
  },
  all: { en: 'All', id: 'Semua' },
};

const OPTIONS = [{ id: 'all' as Filter, label: T.all }, ...CATEGORIES];

export function Work() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<Filter>('all');
  const listRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ x: 0, w: 0, visible: false });

  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const active = pillRefs.current.get(filter);
      if (!list || !active) return;
      setIndicator({ x: active.offsetLeft, w: active.offsetWidth, visible: true });
    };
    measure();
    // pills resize with the active language and the viewport
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [filter, lang]);

  const featured = filter === 'all' ? PROJECTS.filter((project) => project.featured) : [];
  const rest =
    filter === 'all'
      ? PROJECTS.filter((project) => !project.featured)
      : PROJECTS.filter((project) => project.category === filter);
  const shown = filter === 'all' ? PROJECTS.length : rest.length;

  return (
    <Section id="work" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <div role="group" aria-label={t(T.filterLabel)} className="flex flex-wrap items-center gap-2">
        <div ref={listRef} className="relative flex flex-wrap items-center gap-2">
          {/* single sliding indicator; position follows the active pill, never per-pill bg */}
          <span
            aria-hidden="true"
            className={cx(
              'absolute top-0 left-0 h-full rounded-full border border-accent/60 bg-accent/10 transition-[transform,width] duration-fast',
              indicator.visible ? 'opacity-100' : 'opacity-0',
            )}
            style={{ width: indicator.w, transform: `translateX(${indicator.x}px)` }}
          />
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              ref={(node) => {
                if (node) pillRefs.current.set(option.id, node);
                else pillRefs.current.delete(option.id);
              }}
              type="button"
              aria-pressed={filter === option.id}
              onClick={() => setFilter(option.id)}
              className={cx(
                'relative rounded-full px-4 py-2 text-small transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                filter === option.id ? 'text-chalk' : 'text-chalk-muted hover:text-chalk',
              )}
            >
              {t(option.label)}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-4 font-mono text-small text-chalk-faint">
        {shown === 1
          ? t({ en: '1 project', id: '1 proyek' })
          : t({ en: `${shown} projects`, id: `${shown} proyek` })}
      </p>

      {/* key={filter} re-mounts the grid so the entrance stagger replays on every change */}
      <div key={filter} className="mt-8 grid gap-6">
        {featured.map((project, index) => (
          <Reveal key={project.slug} delay={index * 90} className="h-full">
            <ProjectCard project={project} featured />
          </Reveal>
        ))}
      </div>

      {rest.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, index) => (
            <Reveal key={project.slug} delay={(index % 3) * 90} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      ) : (
        featured.length === 0 && (
          <p className="mt-8 text-body text-chalk-muted">
            {t({
              en: 'No projects in this category yet.',
              id: 'Belum ada proyek pada kategori ini.',
            })}
          </p>
        )
      )}
    </Section>
  );
}
