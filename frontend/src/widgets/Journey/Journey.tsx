import { useEffect, useRef } from 'react';
import { Briefcase, FolderGit2, GraduationCap, type LucideIcon } from 'lucide-react';
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
  title: {
    en: 'Where I have been',
    id: 'Tempat saya pernah berkarya',
  },
  lead: {
    en: 'Coursework, capstone and thesis, in the order they happened — each traceable to a repository.',
    id: 'Perkuliahan, capstone, dan tugas akhir, sesuai urutan kejadiannya — masing-masing bisa ditelusuri ke repositori.',
  },
};

export function Journey() {
  const { t } = useLang();
  const { content } = useContent();
  const reduced = usePrefersReducedMotion();

  const outerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLOListElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const lastActive = useRef(-1);

  // mobile: the dot nearest the vertical centre lights up (plain IntersectionObserver)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    let io: IntersectionObserver | null = null;

    const sync = () => {
      if (mq.matches || reduced) {
        io?.disconnect();
        io = null;
        return;
      }
      if (io) return;
      const dots = dotRefs.current.filter((dot): dot is HTMLSpanElement => dot !== null);
      if (dots.length === 0) return;
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) entry.target.setAttribute('data-active', 'true');
            else entry.target.removeAttribute('data-active');
          }
        },
        { rootMargin: '-42% 0px -42% 0px' },
      );
      dots.forEach((dot) => io!.observe(dot));
    };

    sync();
    mq.addEventListener('change', sync);
    return () => {
      io?.disconnect();
      mq.removeEventListener('change', sync);
    };
  }, [reduced]);

  // desktop: one rAF loop translates the track horizontally and lights the nearest dot
  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!outer || !track || !fill) return;

    const read = () => {
      frame = 0;
      const vh = window.innerHeight;
      const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
      const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];

      if (reduced) {
        fill.style.transform = 'scaleX(1)';
        dots.forEach((dot) => dot.setAttribute('data-active', 'true'));
        items.forEach((item) => item.style.removeProperty('--near'));
        return;
      }

      const rect = outer.getBoundingClientRect();
      const total = Math.max(0, rect.height - vh);
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      fill.style.transform = `scaleX(${p.toFixed(4)})`;

      const overhang = Math.max(0, track.scrollWidth - outer.clientWidth);
      const tx = p * overhang;
      track.style.transform = `translate3d(${-tx}px, 0, 0)`;

      const trackLeft = track.getBoundingClientRect().left;
      const centre = window.innerWidth / 2;
      let nearest = -1;
      let distance = Infinity;
      items.forEach((item, index) => {
        const middle = trackLeft + item.offsetLeft + item.offsetWidth / 2 - tx;
        const gap = Math.abs(middle - centre);
        // `--near` runs 1 at the centre line → 0 once the card is a screen away. CSS turns it
        // into opacity/scale/blur, so the row reads as a depth field that scrolls both ways.
        const near = Math.max(0, 1 - gap / (window.innerWidth * 0.85));
        item.style.setProperty('--near', near.toFixed(3));
        if (gap < distance) {
          distance = gap;
          nearest = index;
        }
      });

      if (nearest !== lastActive.current) {
        if (lastActive.current >= 0) dots[lastActive.current]?.removeAttribute('data-active');
        dots[nearest]?.setAttribute('data-active', 'true');
        lastActive.current = nearest;
      }
    };

    let frame = 0;
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) schedule();
      },
      { rootMargin: '20% 0px' },
    );
    io.observe(outer);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
      lastActive.current = -1;
    };
  }, [reduced]);

  return (
    <Section id="journey" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <div ref={outerRef} className="md:h-[190vh]">
        <div className="md:sticky md:top-24 md:flex md:h-screen md:flex-col md:justify-center md:overflow-x-clip">
          {/* progress rail between the end numerals */}
          <div className="hidden items-center gap-3 pb-8 md:flex">
            <span className="font-mono text-micro uppercase tracking-[0.2em] text-chalk-faint">
              01
            </span>
            <span className="relative h-px flex-1 bg-ink-800">
              <span ref={fillRef} className="journey-fill absolute inset-0" />
            </span>
            <span className="font-mono text-micro uppercase tracking-[0.2em] text-chalk-faint">
              {String(content.journey.length).padStart(2, '0')}
            </span>
          </div>

          <ol
            ref={trackRef}
            className="relative flex flex-col gap-12 md:flex-row md:items-stretch md:gap-10"
          >
            {content.journey.map((milestone, index) => {
              const Icon = KIND_ICON[milestone.kind];
              return (
                <li
                  key={`${milestone.period}-${t(milestone.title)}`}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  className="journey-item relative flex gap-5 md:w-[min(88vw,460px)] md:shrink-0 md:flex-col md:gap-6"
                >
                  {/* vertical hairline on mobile, dot beside it */}
                  <span aria-hidden="true" className="hidden h-1 w-full bg-ink-800 md:block" />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full w-px bg-ink-800 md:hidden"
                  />
                  <div className="relative flex flex-col pb-12 pl-8 md:pb-0 md:pl-0 md:pt-6">
                    <span
                      ref={(node) => {
                        dotRefs.current[index] = node;
                      }}
                      aria-hidden="true"
                      className="journey-dot absolute left-0 top-0 -translate-y-1 md:static"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full border border-ink-700 bg-ink-950 text-chalk-faint">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </span>

                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label uppercase text-chalk-faint md:pt-4">
                      <span className="text-accent">{String(index + 1).padStart(2, '0')}</span>
                      <span>{milestone.period}</span>
                      <span aria-hidden="true" className="h-px w-3 bg-ink-700" />
                      <span>{t(KIND_LABEL[milestone.kind])}</span>
                    </p>
                    <h3 className="mt-3 text-h3 font-semibold text-chalk">{t(milestone.title)}</h3>
                    <p className="mt-1 text-small text-accent">{t(milestone.org)}</p>
                    <p className="mt-3 text-body text-chalk-muted">{t(milestone.detail)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}