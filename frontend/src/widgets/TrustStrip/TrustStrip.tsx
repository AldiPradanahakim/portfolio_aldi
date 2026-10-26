import { useContent } from '../../data';
import { useLang } from '../../shared/context/language';
import { Marquee } from '../../motion/Marquee';

const T = {
  label: {
    en: 'Technologies used across the projects on this page',
    id: 'Teknologi yang dipakai di proyek-proyek pada halaman ini',
  },
};

/** Real stack names from the CMS, one marquee row with ember separators and edge fades. */
export function TrustStrip() {
  const { t } = useLang();
  const { content } = useContent();

  const items = Array.from(
    new Map(content.skills.flatMap((group) => group.items).map((item) => [item.en, item])).values(),
  );

  return (
    <section aria-label={t(T.label)} className="overflow-hidden border-y border-ink-800 py-6">
      <Marquee duration={36}>
        {items.map((item) => (
          <span key={item.en} className="flex items-center">
            <span className="px-6 font-mono text-small uppercase tracking-[0.24em] text-chalk-faint">
              {t(item)}
            </span>
            <span aria-hidden="true" className="marquee-dot" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}