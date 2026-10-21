import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { ComponentType } from 'react';
import { PROFILE } from '../../content';
import { useLang } from '../../shared/context/language';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';
import { About } from '../../widgets/About/About';
import { Contact } from '../../widgets/Contact/Contact';
import { Hero } from '../../widgets/Hero/Hero';
import { Journey } from '../../widgets/Journey/Journey';
import { Services } from '../../widgets/Services/Services';
import { Skills } from '../../widgets/Skills/Skills';
import { TrustStrip } from '../../widgets/TrustStrip/TrustStrip';
import { Work } from '../../widgets/Work/Work';

interface Panel {
  id: string;
  Component: ComponentType;
  /** the opening panel sits in the middle of the viewport rather than at the top */
  centered?: boolean;
  /** pinned to the bottom of the panel, under centred content (the tech marquee) */
  trailing?: ComponentType;
}

/**
 * Every section is a panel, not a scroll stop: the page itself never scrolls, and picking a
 * destination in the nav swaps the panel in place. Content taller than the viewport scrolls
 * inside its own panel, so the header and nav stay put.
 */
const PANELS: Panel[] = [
  { id: 'hero', Component: Hero, centered: true, trailing: TrustStrip },
  { id: 'about', Component: About },
  { id: 'work', Component: Work },
  { id: 'services', Component: Services },
  { id: 'skills', Component: Skills },
  { id: 'journey', Component: Journey },
  { id: 'contact', Component: Contact },
];

export default function Home() {
  const { t } = useLang();
  const { hash } = useLocation();

  useDocumentTitle(`${PROFILE.name} — ${t(PROFILE.role)}`);

  const requested = hash.slice(1);
  const index = PANELS.findIndex((panel) => panel.id === requested);
  const activeIndex = index === -1 ? 0 : index;
  const active = PANELS[activeIndex]!;

  // Direction only decides which way the incoming panel slides; a ref because it must not
  // re-render, and it is updated during render so the class matches the panel being mounted.
  const previousIndex = useRef(activeIndex);
  const reverse = activeIndex < previousIndex.current;
  previousIndex.current = activeIndex;

  const { Component, trailing: Trailing } = active;

  return (
    <div className="h-full overflow-hidden">
      <div
        key={active.id}
        data-scroll-root
        className={[
          'deck-panel h-full overflow-y-auto overscroll-contain',
          reverse ? 'deck-panel-reverse' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex min-h-full flex-col">
          <div className={active.centered ? 'flex flex-1 flex-col justify-center' : undefined}>
            <Component />
          </div>
          {Trailing && <Trailing />}
        </div>
      </div>
    </div>
  );
}
