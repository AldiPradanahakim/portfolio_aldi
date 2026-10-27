import { useContent } from '../../data';
import { useLang } from '../../shared/context/language';
import { Marquee } from '../../motion/Marquee';

const T = {
  label: {
    en: 'Technologies used across the projects on this page',
    id: 'Teknologi yang dipakai di proyek-proyek pada halaman ini',
  },
};

/** Real stack names from the CMS, one marquee row with ember separators and hard-clipped edges. */
export function TrustStrip() {
  const { t } = useLang();
  const { content } = useContent();

  const items = Array.from(
    new Map(content.skills.flatMap((group) => group.items).map((item) => [item.en, item])).values(),
  );

  return (
    <section aria-label={t(T.label)} className="overflow-hidden border-y border-ink-800 py-6">
      {/* `stack-band` drops the marquee's edge fade: the reference band is sliced hard at both
          viewport edges, and a 6% fade made the end labels look dimmed rather than continuing. */}
      <Marquee duration={36} className="stack-band">
        {items.map((item) => (
          <span key={item.en} className="flex items-center">
            <span className="stack-item font-mono text-small uppercase text-chalk-faint">
              {t(item)}
            </span>
            <span aria-hidden="true" className="stack-star">✳</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}