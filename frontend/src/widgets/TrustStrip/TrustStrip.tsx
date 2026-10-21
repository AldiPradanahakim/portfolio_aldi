import { PROJECTS } from '../../content';
import { useLang } from '../../shared/context/language';
import { BackToTop } from '../../shared/components/BackToTop';

const T = {
  label: {
    en: 'Technologies used across the projects on this page',
    id: 'Teknologi yang dipakai di proyek-proyek pada halaman ini',
  },
  stack: { en: 'Stack', id: 'Teknologi' },
  backToTop: { en: 'Back to top', id: 'Kembali ke atas' },
};

/** Every name here comes from a project stack in the content data — nothing is added. */
const STACK = Array.from(new Set(PROJECTS.flatMap((project) => project.stack)));

export function TrustStrip() {
  const { t } = useLang();

  return (
    <section aria-label={t(T.label)} className="border-y border-ink-800 py-5">
      <div className="shell flex items-center gap-6">
        <span
          aria-hidden="true"
          className="hidden shrink-0 font-mono text-label uppercase text-chalk-faint sm:block"
        >
          {t(T.stack)}
        </span>
        <div className="marquee min-w-0 flex-1">
          <ul className="marquee-track items-center">
            {[...STACK, ...STACK].map((item, index) => (
              <li
                key={`${item}-${index}`}
                aria-hidden={index >= STACK.length ? true : undefined}
                className="shrink-0 whitespace-nowrap pr-10 font-mono text-small text-chalk-faint"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <BackToTop label={t(T.backToTop)} />
      </div>
    </section>
  );
}
