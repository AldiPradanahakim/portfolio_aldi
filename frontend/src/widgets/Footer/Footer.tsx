import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { PROFILE } from '../../content';
import { NAV_SECTIONS } from '../../shared/constants/sections';
import { useLang } from '../../shared/context/language';
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
                    className="text-small text-chalk-muted transition-colors duration-150 hover:text-chalk"
                  >
                    {t(section.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {PROFILE.socials.map((social) => {
              const Icon = socialIcon(social.icon);
              return (
                <a
                  key={social.url}
                  href={social.url}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-full border border-ink-800 p-2 text-chalk-muted transition-colors duration-150 hover:text-chalk"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0 })}
              aria-label={t(T.backToTop)}
              className="rounded-full border border-ink-800 p-2 text-chalk-muted transition-colors duration-150 hover:text-chalk"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="text-small text-chalk-faint">
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
      </div>
    </footer>
  );
}
