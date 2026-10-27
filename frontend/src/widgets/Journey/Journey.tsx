import { useEffect, useRef } from 'react';
import { Briefcase, FolderGit2, GraduationCap, type LucideIcon } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useContent } from '../../data';
import type { L, Milestone } from '../../content';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';

const KIND_ICON: Record<Milestone['kind'], LucideIcon> = {
  education: GraduationCap,
  project: FolderGit2,
  work: Briefcase,
};

const KIND_LABEL: Record<Milestone['kind'], L> = {
  education: { en: 'Education', id: 'Pendidikan' },
  project: { en: 'Project', id: 'Proyek' },
  work: { en: 'Work', id: 'Pekerjaan' },
};

const T = {
  eyebrow: { en: 'Journey', id: 'Perjalanan' },
  title: { en: 'Where I have been', id: 'Tempat saya pernah berkarya' },
  lead: {
    en: 'The roles I have held, in the order they happened — from a first web programming course to a thesis built end to end.',
    id: 'Peran yang pernah saya pegang, sesuai urutan kejadiannya — dari mata kuliah pemrograman web sampai tugas akhir yang dibangun ujung ke ujung.',
  },
  now: { en: 'Now', id: 'Sekarang' },
};

/**
 * Journey as a zig-zag route: the entries alternate left and right of a centre spine, and the
 * spine's connector draws itself as the section scrolls past. The previous version was one
 * horizontal row of text columns pinned to a sticky stage — it left most of every column empty,
 * and a horizontally-scrolling timeline is unreadable on a phone anyway.
 */
export function Journey() {
  const { t } = useLang();
  const { content } = useContent();

  const trackRef = useRef<HTMLOListElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 78%', 'end 62%'],
  });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Reveal each entry from its own side of the spine. The hidden state lives in CSS and is
  // released by a `data-show` attribute, so a failed observer leaves the cards visible.
  useEffect(() => {
    const entries = Array.from(
      trackRef.current?.querySelectorAll<HTMLLIElement>('.journey-entry') ?? [],
    );
    if (entries.length === 0) return;

    if (reduced || typeof IntersectionObserver === 'undefined') {
      entries.forEach((entry) => entry.setAttribute('data-show', 'true'));
      return;
    }

    const io = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (!record.isIntersecting) continue;
          record.target.setAttribute('data-show', 'true');
          io.unobserve(record.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );
    entries.forEach((entry) => io.observe(entry));
    return () => io.disconnect();
  }, [reduced]);

  return (
    <Section id="journey" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <ol ref={trackRef} className="journey-route">
        {/* one spine behind every node; the lit copy is clipped to the scroll progress */}
        <span aria-hidden="true" className="journey-spine" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: draw }}
          className="journey-spine journey-spine--lit"
        />

        {content.journey.map((milestone, index) => {
          const Icon = KIND_ICON[milestone.kind];
          return (
            <li
              key={`${milestone.period}-${t(milestone.title)}`}
              className={`journey-entry ${index % 2 === 0 ? 'is-left' : 'is-right'}`}
            >
              <span aria-hidden="true" className="journey-node">
                <span className="journey-node-inner">
                  <Icon className="h-3.5 w-3.5" />
                </span>
              </span>

              <article className="journey-card">
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-chalk-faint">
                      <span className="text-accent">{String(index + 1).padStart(2, '0')}</span>
                      <span aria-hidden="true"> · </span>
                      {t(KIND_LABEL[milestone.kind])}
                    </p>
                    <h3 className="mt-2 text-h3 font-semibold leading-tight text-chalk">
                      {t(milestone.title)}
                    </h3>
                    <p className="mt-1.5 text-small text-chalk-muted">{t(milestone.org)}</p>
                  </div>
                </header>

                <p className="mt-4 text-small leading-relaxed text-chalk-muted">
                  {t(milestone.detail)}
                </p>

                <footer className="mt-auto flex items-center gap-3 pt-5">
                  <span aria-hidden="true" className="h-px flex-1 bg-ink-800" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-chalk-faint">
                    {milestone.period}
                  </span>
                </footer>
              </article>
            </li>
          );
        })}

        {/* Seven entries end on the same side they started, which leaves the last row lopsided.
            A closing marker on the opposite side turns the odd count into a bracket. */}
        <li className="journey-entry is-right" aria-hidden="true">
          <span className="journey-node">
            <span className="journey-node-inner journey-node-inner--now" />
          </span>
          <p className="journey-now">{t(T.now)}</p>
        </li>
      </ol>
    </Section>
  );
}