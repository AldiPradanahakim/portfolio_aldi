import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { CATEGORIES, PROFILE, PROJECTS, type L, type Project } from '../../content';
import { Lightbox } from '../../shared/components/Lightbox';
import { Reveal } from '../../shared/components/Reveal';
import { useLang } from '../../shared/context/language';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';
import { buttonStyles } from '../../shared/ui/buttonStyles';
import NotFound from '../NotFound/NotFound';

const CATEGORY_LABEL = new Map(CATEGORIES.map((category) => [category.id, category.label]));

const STATUS_LABEL: Record<Project['status'], L> = {
  shipped: { en: 'Shipped', id: 'Selesai' },
  'in-development': { en: 'In development', id: 'Dalam pengembangan' },
};

const T = {
  back: { en: 'All projects', id: 'Semua proyek' },
  projectNav: { en: 'Project navigation', id: 'Navigasi proyek' },
  of: { en: 'of', id: 'dari' },
  year: { en: 'Year', id: 'Tahun' },
  role: { en: 'Role', id: 'Peran' },
  status: { en: 'Status', id: 'Status' },
  liveDemo: { en: 'Open live demo', id: 'Buka demo langsung' },
  sourceCode: { en: 'View source code', id: 'Lihat kode sumber' },
  problem: { en: 'The problem', id: 'Masalahnya' },
  solution: { en: 'What I built', id: 'Yang saya bangun' },
  features: { en: 'Features', id: 'Fitur' },
  featuresLead: {
    en: 'The parts that carry the weight, taken from the project itself.',
    id: 'Bagian yang menanggung beban utama, diambil dari proyeknya sendiri.',
  },
  metrics: { en: 'By the numbers', id: 'Dalam angka' },
  metricsLead: {
    en: 'Counted from the project, not estimated.',
    id: 'Dihitung dari proyeknya, bukan perkiraan.',
  },
  stack: { en: 'Stack', id: 'Teknologi' },
  gallery: { en: 'More screens', id: 'Tangkapan lain' },
  previous: { en: 'Previous project', id: 'Proyek sebelumnya' },
  next: { en: 'Next project', id: 'Proyek berikutnya' },
  ctaTitle: {
    en: 'Need something like this?',
    id: 'Butuh sesuatu seperti ini?',
  },
  ctaBody: {
    en: 'Describe the problem in a few lines and I will reply with questions, then a scope and a timeline.',
    id: 'Ceritakan masalahnya dalam beberapa baris, saya balas dengan pertanyaan, lalu lingkup dan jadwalnya.',
  },
  cta: { en: 'Start a conversation', id: 'Mulai diskusi' },
  lightbox: { en: 'Project screens', id: 'Tangkapan proyek' },
  close: { en: 'Close', id: 'Tutup' },
  previousImage: { en: 'Previous screen', id: 'Tangkapan sebelumnya' },
  nextImage: { en: 'Next screen', id: 'Tangkapan berikutnya' },
};

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-ink-800 py-14 sm:py-16">
      <h2 id={id} className="text-h2 font-semibold text-chalk">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t } = useLang();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const index = PROJECTS.findIndex((project) => project.slug === slug);

  useDocumentTitle(index === -1 ? null : `${PROJECTS[index].name} — ${PROFILE.name}`);

  if (index === -1) return <NotFound />;

  const project = PROJECTS[index];
  const category = CATEGORY_LABEL.get(project.category);
  const previous = PROJECTS[index - 1];
  const next = PROJECTS[index + 1];
  const extras = project.gallery.filter((src) => src !== project.cover);
  const gallery = [...(project.cover ? [project.cover] : []), ...extras];
  const coverAlt = `${project.name} — ${t(project.tagline)}`;
  // Without a cover the gallery starts at the first extra, so indices shift by one.
  const coverOffset = project.cover ? 1 : 0;
  const extraAlt = (n: number) =>
    `${project.name} — ${t(T.gallery)} ${n} ${t(T.of)} ${extras.length}`;

  return (
    <article className="pt-28 sm:pt-36">
      <div className="shell">
        <Link
          to="/#work"
          className="inline-flex items-center gap-2 text-small text-chalk-muted transition-colors duration-fast hover:text-chalk"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t(T.back)}
        </Link>

        <Reveal className="mt-8">
          <header>
            <p className="flex flex-wrap items-center gap-3 font-mono text-label uppercase text-chalk-faint">
              {category && <span>{t(category)}</span>}
              <span aria-hidden="true">/</span>
              <span>{project.year}</span>
            </p>
            <h1 className="mt-4 text-balance text-display font-semibold text-chalk">
              {project.name}
            </h1>
            <p className="mt-5 max-w-3xl text-h3 text-chalk-muted">{t(project.tagline)}</p>
            <p className="mt-6 max-w-3xl text-body text-chalk-muted">{t(project.summary)}</p>
          </header>
        </Reveal>

        <dl className="mt-12 grid gap-6 border-y border-ink-800 py-6 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-label uppercase text-chalk-faint">{t(T.year)}</dt>
            <dd className="mt-2 text-small text-chalk">{project.year}</dd>
          </div>
          <div>
            <dt className="font-mono text-label uppercase text-chalk-faint">{t(T.role)}</dt>
            <dd className="mt-2 text-small text-chalk">{t(project.role)}</dd>
          </div>
          <div>
            <dt className="font-mono text-label uppercase text-chalk-faint">{t(T.status)}</dt>
            <dd className="mt-2 text-small text-chalk">{t(STATUS_LABEL[project.status])}</dd>
          </div>
        </dl>

        {(project.links.demo || project.links.repo) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles('primary', 'md')}
              >
                {t(T.liveDemo)}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles('secondary', 'md')}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {t(T.sourceCode)}
              </a>
            )}
          </div>
        )}

        {project.cover && (
          <Reveal className="mt-12">
            <img
              src={project.cover}
              alt={coverAlt}
              width={1200}
              height={750}
              decoding="async"
              className="w-full rounded-2xl border border-media-ring bg-media"
            />
          </Reveal>
        )}
      </div>

      <div className="shell">
        <div className="grid gap-10 border-t border-ink-800 py-14 sm:grid-cols-2 sm:gap-14 sm:py-16">
          <section aria-labelledby="problem-title">
            <h2 id="problem-title" className="text-h2 font-semibold text-chalk">
              {t(T.problem)}
            </h2>
            <p className="mt-6 text-body text-chalk-muted">{t(project.problem)}</p>
          </section>
          <section aria-labelledby="solution-title">
            <h2 id="solution-title" className="text-h2 font-semibold text-chalk">
              {t(T.solution)}
            </h2>
            <p className="mt-6 text-body text-chalk-muted">{t(project.solution)}</p>
          </section>
        </div>

        <Block id="features-title" title={t(T.features)}>
          <p className="max-w-3xl text-body text-chalk-muted">{t(T.featuresLead)}</p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {project.features.map((feature) => (
              <li key={t(feature.title)} className="card h-full p-6">
                <h3 className="text-h3 font-semibold text-chalk">{t(feature.title)}</h3>
                <p className="mt-2 text-small text-chalk-muted">{t(feature.detail)}</p>
              </li>
            ))}
          </ul>
        </Block>

        {project.metrics.length > 0 && (
          <Block id="metrics-title" title={t(T.metrics)}>
            <p className="max-w-3xl text-body text-chalk-muted">{t(T.metricsLead)}</p>
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div key={t(metric.label)} className="card p-6">
                  <dt className="text-small text-chalk-muted">{t(metric.label)}</dt>
                  <dd className="mt-2 font-mono text-h2 text-accent">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </Block>
        )}

        <Block id="stack-title" title={t(T.stack)}>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        </Block>

        {extras.length > 0 && (
          <Block id="gallery-title" title={t(T.gallery)}>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {extras.map((src, extraIndex) => (
                <li key={src}>
                  <Reveal delay={(extraIndex % 3) * 80}>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(extraIndex + coverOffset)}
                      className="card-hover block w-full overflow-hidden rounded-2xl border border-ink-800 bg-media"
                    >
                      <img
                        src={src}
                        alt={extraAlt(extraIndex + 1)}
                        width={1200}
                        height={750}
                        loading="lazy"
                        decoding="async"
                        className="w-full"
                      />
                    </button>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Block>
        )}

        <Reveal>
          <section
            aria-labelledby="project-cta-title"
            className="card flex flex-col items-start gap-4 p-6 sm:p-10"
          >
            <h2 id="project-cta-title" className="text-h2 font-semibold text-chalk">
              {t(T.ctaTitle)}
            </h2>
            <p className="max-w-2xl text-body text-chalk-muted">{t(T.ctaBody)}</p>
            <Link to="/#contact" className={buttonStyles('primary', 'lg')}>
              {t(T.cta)}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        </Reveal>

        <nav aria-label={t(T.projectNav)} className="grid gap-6 border-t border-ink-800 py-14 sm:grid-cols-2">
          {previous ? (
            <Link to={`/project/${previous.slug}`} className="group flex flex-col gap-2">
              <span className="flex items-center gap-2 font-mono text-label uppercase text-chalk-faint">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                {t(T.previous)}
              </span>
              <span className="text-h3 text-chalk-muted transition-colors duration-fast group-hover:text-chalk">
                {previous.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/project/${next.slug}`}
              className="group flex flex-col gap-2 sm:items-end sm:text-right"
            >
              <span className="flex items-center gap-2 font-mono text-label uppercase text-chalk-faint">
                {t(T.next)}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-h3 text-chalk-muted transition-colors duration-fast group-hover:text-chalk">
                {next.name}
              </span>
            </Link>
          )}
        </nav>
      </div>

      <Lightbox
        images={gallery.map((src, galleryIndex) => ({
          src,
          alt: coverOffset === 1 && galleryIndex === 0 ? coverAlt : extraAlt(galleryIndex - coverOffset + 1),
        }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
        labels={{
          dialog: t(T.lightbox),
          close: t(T.close),
          previous: t(T.previousImage),
          next: t(T.nextImage),
        }}
      />
    </article>
  );
}
