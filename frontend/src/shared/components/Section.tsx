import type { ReactNode } from 'react';
import { cx } from '../lib/cn';
import { Reveal } from './Reveal';

interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, eyebrow, title, lead, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-mesh={id}
      className={cx('panel-mesh py-8 sm:py-10', className)}
    >
      <div className="shell">
        <Reveal>
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="font-mono text-label uppercase text-accent">{eyebrow}</p>
            )}
            <h2 id={`${id}-title`} className="mt-3 text-balance text-h2 font-semibold text-chalk">
              {title}
            </h2>
            {lead && <p className="mt-4 text-body text-chalk-muted">{lead}</p>}
          </div>
        </Reveal>
        <div className="mt-8 sm:mt-10">{children}</div>
      </div>
    </section>
  );
}
