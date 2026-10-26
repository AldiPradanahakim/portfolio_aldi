import { Fragment } from 'react';
import type { ComponentType } from 'react';
import { useContent } from '../../data';
import type { L } from '../../content';
import { useLang } from '../../shared/context/language';
import { SECTION_IDS, type SectionId } from '../../shared/constants/sections';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';
import { TickerBand } from '../../shared/components/TickerBand';
import { About } from '../../widgets/About/About';
import { Contact } from '../../widgets/Contact/Contact';
import { Hero } from '../../widgets/Hero/Hero';
import { Journey } from '../../widgets/Journey/Journey';
import { TrustStrip } from '../../widgets/TrustStrip/TrustStrip';
import { Work } from '../../widgets/Work/Work';

interface SectionEntry {
  id: string;
  Component: ComponentType;
  trailing?: ComponentType;
  /** oversized type band printed immediately before this section */
  band?: L;
}

// No band before About: the tech marquee right after the hero already owns that role, and two
// stacked marquees read as one thick striped block.
const BAND: Record<string, L> = {
  journey: { en: 'Experience', id: 'Pengalaman' },
  work: { en: 'Selected work', id: 'Karya pilihan' },
  contact: { en: 'Say hello', id: 'Sapa saya' },
};

/** Component wiring keyed by id; the order comes from SECTION_IDS so the section index labels
 *  in Section.tsx and this list can never disagree. */
const ENTRIES: Record<SectionId, Omit<SectionEntry, 'id'>> = {
  hero: { Component: Hero, trailing: TrustStrip },
  about: { Component: About },
  journey: { Component: Journey, band: BAND.journey },
  work: { Component: Work, band: BAND.work },
  contact: { Component: Contact, band: BAND.contact },
};

const SECTIONS: SectionEntry[] = SECTION_IDS.map((id) => ({ id, ...ENTRIES[id] }));

export default function Home() {
  const { t } = useLang();
  const { content } = useContent();

  useDocumentTitle(`${content.profile.name} — ${t(content.profile.role)}`);

  return (
    <>
      {SECTIONS.map(({ id, Component, trailing: Trailing, band }, index) => (
        <Fragment key={id}>
          {/* every band alternates direction, so the page never reads as one long column */}
          {band && <TickerBand reverse={index % 2 === 0}>{t(band)}</TickerBand>}
          <Component />
          {Trailing && <Trailing />}
        </Fragment>
      ))}
    </>
  );
}
