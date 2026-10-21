import { Link } from 'react-router-dom';
import { PROFILE } from '../../content';
import { NAV_SECTIONS } from '../../shared/constants/sections';
import { useLang } from '../../shared/context/language';
import { BackToTop } from '../../shared/components/BackToTop';
import { socialIcon } from '../../shared/lib/icons';

const T = {
  footerNav: { en: 'Footer', id: 'Footer' },
  backToTop: { en: 'Back to top', id: 'Kembali ke atas' },
};

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-ink-800 py-12">
      <div className="shell flex flex-col gap-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-small font-medium text-chalk">{PROFILE.name}</p>
            <p className="mt-1 text-small text-chalk-muted">
              {t(PROFILE.role)} · {t(PROFILE.location)}
            </p>
          </div>

          <nav aria-label={t(T.footerNav)}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_SECTIONS.map((section) => (
                <li key={section.id}>
                  <Link
                    to={`/#${section.id}`}
                    className="link-sweep text-small text-chalk-muted transition-colors duration-fast hover:text-chalk"
                  >
                    {t(section.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {PROFILE.socials.map((social) => {
              const Icon = socialIcon(social.icon);
              return (
                <a
                  key={social.url}
                  href={social.url}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-full border border-ink-800 p-2 text-chalk-muted transition-colors duration-fast hover:border-ink-700 hover:text-chalk"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              );
            })}
            <BackToTop label={t(T.backToTop)} />
          </div>
        </div>
      </div>

      <div className="marquee mt-10" aria-hidden="true">
        <div className="marquee-track items-center">
          {[0, 1].map((copy) => (
            <span key={copy} className="marquee-wordmark shrink-0 pr-16">
              {PROFILE.name}
            </span>
          ))}
        </div>
      </div>

      <div className="shell mt-10 flex flex-col gap-3 border-t border-ink-800/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-chalk-faint">
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-chalk-faint">
          Indonesia · Remote
        </p>
      </div>
    </footer>
  );
}
