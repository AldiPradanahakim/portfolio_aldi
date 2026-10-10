import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES, type Project } from '../../content';
import { useLang } from '../../shared/context/language';
import { cx } from '../../shared/lib/cn';

const CATEGORY_LABEL = new Map(CATEGORIES.map((category) => [category.id, category.label]));

const T = {
  inDevelopment: { en: 'In development', id: 'Dalam pengembangan' },
};

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const { t } = useLang();
  const category = CATEGORY_LABEL.get(project.category);

  return (
    <article className="h-full">
      <Link
        to={`/project/${project.slug}`}
        className="card card-hover group flex h-full flex-col overflow-hidden"
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b border-ink-800 bg-media">
          {project.cover ? (
            <img
              src={project.cover}
              alt={`${project.name} — ${t(project.tagline)}`}
              width={1200}
              height={750}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            />
          ) : (
            // No screenshot: a static weave, so the card keeps its shape without an image.
            <div aria-hidden="true" className="media-fallback" />
          )}
          <ArrowUpRight
            aria-hidden="true"
            className="absolute right-4 top-4 h-4 w-4 text-media-text opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <p className="flex items-center gap-3 font-mono text-label uppercase text-chalk-faint">
            {category && <span>{t(category)}</span>}
            <span aria-hidden="true">/</span>
            <span>{project.year}</span>
          </p>

          <h3
            className={cx(
              'text-balance font-semibold text-chalk',
              featured ? 'text-h2' : 'text-h3',
            )}
          >
            {project.name}
          </h3>

          {project.status === 'in-development' && (
            <p className="text-small text-accent">{t(T.inDevelopment)}</p>
          )}

          <p className="text-small text-chalk-muted">{t(project.tagline)}</p>

          <ul className="mt-auto flex flex-wrap gap-2 pt-4">
            {project.stack.slice(0, featured ? 6 : 4).map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}
