import { useState } from 'react';
import { CATEGORIES, PROJECTS, type CategoryId } from '../../content';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';
import { ProjectCard } from '../../entities/ProjectCard/ProjectCard';
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

export function Work() {
  const { t } = useLang();
  const [filter, setFilter] = useState<Filter>('all');

  const featured = filter === 'all' ? PROJECTS.filter((project) => project.featured) : [];
  const rest =
    filter === 'all' ? PROJECTS.filter((project) => !project.featured) : PROJECTS.filter((project) => project.category === filter);
  const shown = filter === 'all' ? PROJECTS.length : rest.length;

  return (
    <Section id="work" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <div
        role="group"
        aria-label={t(T.filterLabel)}
        className="flex flex-wrap items-center gap-2"
      >
        {[{ id: 'all' as Filter, label: T.all }, ...CATEGORIES].map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={filter === option.id}
            onClick={() => setFilter(option.id)}
            className={cx(
              'rounded-full border px-4 py-2 text-small transition-colors duration-150',
              filter === option.id
                ? 'border-accent bg-accent/10 text-chalk'
                : 'border-ink-800 text-chalk-muted hover:border-ink-700 hover:text-chalk',
            )}
          >
            {t(option.label)}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-4 font-mono text-small text-chalk-faint">
        {shown === 1
          ? t({ en: '1 project', id: '1 proyek' })
          : t({ en: `${shown} projects`, id: `${shown} proyek` })}
      </p>

      {featured.length > 0 && (
        <Reveal className="mt-8 grid gap-6 lg:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} featured />
          ))}
        </Reveal>
      )}

      {rest.length > 0 ? (
        <Reveal className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Reveal>
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
