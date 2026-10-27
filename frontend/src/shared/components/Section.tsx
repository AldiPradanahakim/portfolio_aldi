import type { ReactNode } from 'react';
import { SECTION_IDS } from '../constants/sections';
import { useScrollProgress } from '../../motion/useScrollProgress';
import { SplitText } from '../../motion/SplitText';
import { cx } from '../lib/cn';

interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Editorial section shell: mono eyebrow with an ember dash, a serif display title that splits
 * word-by-word, a hairline rule, and an oversized outlined numeral. The numeral and title read
 * `--p` from the shared scroll loop, so the header breathes as it leaves the viewport.
 */
export function Section({ id, eyebrow, title, lead, children, className }: SectionProps) {
  const index = SECTION_IDS.indexOf(id as never) + 1;
  const { ref } = useScrollProgress<HTMLDivElement>();

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cx('py-14 sm:py-20', className)}>
      <div className="shell">
        <div ref={ref} className="section-head">
          <div className="flex items-end justify-between gap-8">
            <div className="min-w-0">
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              <SplitText
                as="h2"
                id={`${id}-title`}
                text={title}
                stagger={38}
                className="section-title mt-3 max-w-5xl text-balance"
              />
            </div>
            {index > 0 && (
              <span aria-hidden="true" className="numeral hidden shrink-0 md:block">
                {String(index).padStart(2, '0')}
              </span>
            )}
          </div>
          {lead && <p className="mt-4 max-w-2xl text-body text-chalk-muted">{lead}</p>}
          <span aria-hidden="true" className="rule mt-6" />
        </div>
        <div className="mt-8 sm:mt-10">{children}</div>
      </div>
    </section>
  );
}