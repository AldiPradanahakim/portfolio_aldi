import { useEffect, useRef } from 'react';
import { Briefcase, FolderGit2, GraduationCap, type LucideIcon } from 'lucide-react';
import { JOURNEY, type L, type Milestone } from '../../content';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';
import { cx } from '../../shared/lib/cn';

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
  title: {
    en: 'Coursework, capstone and thesis, in the order they happened',
    id: 'Perkuliahan, capstone, dan tugas akhir, sesuai urutan kejadiannya',
  },
  lead: {
    en: 'Each milestone below is tied to a period that can be checked against the project pages.',
    id: 'Setiap tonggak di bawah ini terikat pada rentang waktu yang bisa dicocokkan dengan halaman proyeknya.',
  },
};

/** nearest ancestor that actually scrolls vertically; the deck panel on Home, else the page */
function scrollParent(el: HTMLElement | null): HTMLElement | Document {
  let node: HTMLElement | null = el?.parentElement ?? null;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return document;
}

export function Journey() {
  const { t } = useLang();
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (reduced) {
      if (fillRef.current) fillRef.current.style.transform = 'scaleY(1)';
      for (const dot of dotRefs.current) if (dot) dot.dataset.passed = 'true';
      return;
    }

    const scroller = scrollParent(track);
    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const viewTop = scroller === document ? 0 : (scroller as HTMLElement).getBoundingClientRect().top;
      const viewHeight =
        scroller === document
          ? window.innerHeight
          : (scroller as HTMLElement).clientHeight;
      const center = viewTop + viewHeight * 0.55;
      const progress = rect.height > 0 ? (center - rect.top) / rect.height : 1;
      const clamped = Math.min(1, Math.max(0, progress));

      if (fillRef.current) fillRef.current.style.transform = `scaleY(${clamped})`;
      const point = clamped * rect.height;
      for (const dot of dotRefs.current) {
        if (!dot) continue;
        const dotCenter = dot.offsetTop + dot.offsetHeight / 2;
        dot.dataset.passed = point >= dotCenter ? 'true' : 'false';
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onScroll();
      },
      { root: scroller === document ? null : (scroller as HTMLElement), rootMargin: '10% 0px' },
    );
    io.observe(track);

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        onScroll();
      });
    };
    const target = scroller === document ? window : (scroller as HTMLElement);
    target.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();

    return () => {
      io.disconnect();
      target.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <Section id="journey" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <div ref={trackRef} className="relative">
        {/* base rail plus a fill line scaled from the top — transform only */}
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-5 w-px -translate-x-1/2 bg-ink-800 md:left-1/2"
        />
        <span
          ref={fillRef}
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-5 w-px -translate-x-1/2 origin-top scale-y-0 bg-accent md:left-1/2"
        />

        <ol className="flex flex-col gap-12">
          {JOURNEY.map((milestone, index) => {
            const Icon = KIND_ICON[milestone.kind];
            const right = index % 2 === 1;
            return (
              <li key={`${milestone.period}-${t(milestone.title)}`} className="relative">
                <span
                  ref={(node) => {
                    dotRefs.current[index] = node;
                  }}
                  aria-hidden="true"
                  className={cx(
                    'absolute top-0 left-5 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-ink-700 bg-ink-950 text-chalk-faint transition-colors duration-fast md:left-1/2',
                    'data-[passed=true]:border-accent data-[passed=true]:text-accent',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <div
                  className={cx(
                    'pl-14 md:grid md:grid-cols-2 md:gap-16 md:pl-0',
                    right ? 'md:text-left' : 'md:text-left',
                  )}
                >
                  <div className={cx(right ? 'md:col-start-2' : 'md:col-start-1 md:text-right')}>
                    <p
                      className={cx(
                        'flex flex-wrap items-center gap-3 font-mono text-label uppercase text-chalk-faint',
                        !right && 'md:justify-end',
                      )}
                    >
                      <span>{milestone.period}</span>
                      <span aria-hidden="true" className="h-px w-4 bg-ink-700" />
                      <span>{t(KIND_LABEL[milestone.kind])}</span>
                    </p>
                    <h3 className="mt-2 text-h3 font-semibold text-chalk">{t(milestone.title)}</h3>
                    <p className="mt-1 text-small text-accent">{t(milestone.org)}</p>
                    <p className="mt-3 text-body text-chalk-muted">{t(milestone.detail)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
