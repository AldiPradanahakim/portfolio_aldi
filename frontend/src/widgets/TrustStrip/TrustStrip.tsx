import { PROJECTS } from '../../content';
import { useLang } from '../../shared/context/language';

const T = {
  label: {
    en: 'Technologies used across the projects on this page',
    id: 'Teknologi yang dipakai di proyek-proyek pada halaman ini',
  },
};

/** Every name here comes from a project stack in the content data — nothing is added. */
const STACK = Array.from(new Set(PROJECTS.flatMap((project) => project.stack)));

export function TrustStrip() {
  const { t } = useLang();

  return (
    <section aria-label={t(T.label)} className="border-y border-ink-800 py-6">
      <div className="marquee">
        <ul className="marquee-track items-center gap-10 pr-10">
          {[...STACK, ...STACK].map((item, index) => (
            <li
              key={`${item}-${index}`}
              aria-hidden={index >= STACK.length ? true : undefined}
              className="whitespace-nowrap font-mono text-small text-chalk-faint"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
