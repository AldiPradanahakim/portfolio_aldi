import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES, type CategoryId, type L, type Project } from '../../content';
import { useLang } from '../../shared/context/language';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';
import { cx } from '../../shared/lib/cn';

const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category.label]),
) as Record<CategoryId, L>;

const T = {
  inDevelopment: { en: 'In development', id: 'Dalam pengembangan' },
};

const MAX_TILT = 4; // degrees at the card edge

/**
 * Pointer tilt scoped to this file: writes --rx/--ry straight onto the node inside a rAF
 * loop (no React re-render per pointer event), eases back on leave, and stays off entirely
 * for touch pointers or reduced motion. The card's `style` transform references the vars,
 * so a non-tilting render is simply a flat card — nothing else needs to change.
 */
function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const apply = () => {
      raf.current = 0;
      el.style.setProperty('--rx', `${target.current.x}deg`);
      el.style.setProperty('--ry', `${target.current.y}deg`);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      target.current = { x: -py * MAX_TILT, y: px * MAX_TILT };
      if (!raf.current) raf.current = requestAnimationFrame(apply);
    };

    const enter = () => {
      el.style.transition = 'transform 60ms linear';
    };

    const leave = () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = 0;
      }
      target.current = { x: 0, y: 0 };
      el.style.transition = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
      apply();
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
    };
  }, [reduced]);

  return ref;
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const { t } = useLang();
  const tiltRef = useTilt<HTMLAnchorElement>();
  const category = CATEGORY_LABEL[project.category];
  const metrics = project.metrics.slice(0, featured ? 3 : 2);

  return (
    <article className="h-full">
      <Link
        ref={tiltRef}
        to={`/project/${project.slug}`}
        className={cx(
          'card group flex h-full flex-col overflow-hidden transition-colors duration-fast hover:border-ink-600',
          featured && 'lg:flex-row',
        )}
        style={{
          transform:
            'perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
        }}
      >
        <div
          className={cx(
            'relative overflow-hidden border-b border-ink-800 bg-media',
            featured
              ? 'aspect-[16/10] lg:aspect-auto lg:w-3/5 lg:border-b-0 lg:border-r'
              : 'aspect-[16/10]',
          )}
        >
          {project.cover ? (
            <img
              src={project.cover}
              alt={`${project.name} — ${t(project.tagline)}`}
              width={1200}
              height={750}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-slow motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            // No screenshot: a static weave, so the card keeps its shape without an image.
            <div aria-hidden="true" className="media-fallback h-full w-full" />
          )}
          {/* gradient wash lifts the cover off the page on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent opacity-0 transition-opacity duration-slow motion-safe:group-hover:opacity-100"
          />
          <ArrowUpRight
            aria-hidden="true"
            className="absolute right-4 top-4 h-4 w-4 text-media-text opacity-0 transition-[opacity,transform] duration-fast motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:opacity-100"
          />
        </div>

        <div
          className={cx(
            'flex flex-1 flex-col gap-3 p-5 sm:p-6',
            featured && 'lg:justify-center lg:p-8',
          )}
        >
          <p className="flex items-center gap-3 font-mono text-label uppercase text-chalk-faint">
            {category && <span>{t(category)}</span>}
            <span aria-hidden="true" className="h-px w-4 bg-ink-700" />
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

          {metrics.length > 0 && (
            <ul className="mt-auto flex flex-wrap gap-2 pt-4">
              {metrics.map((metric) => (
                <li
                  key={metric.value}
                  className="flex items-baseline gap-1.5 rounded-lg border border-ink-800 bg-ink-850 px-2.5 py-1.5"
                >
                  <span className="font-mono text-[13px] font-medium leading-none text-chalk">
                    {metric.value}
                  </span>
                  <span className="text-[11px] leading-none text-chalk-faint">
                    {t(metric.label)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
}
