import { Link } from 'react-router-dom';
import { useContent } from '../../data';
import { NAV_SECTIONS } from '../../shared/constants/sections';
import { useLang } from '../../shared/context/language';
import { BackToTop } from '../../shared/components/BackToTop';
import { Marquee } from '../../motion/Marquee';
import { socialIcon } from '../../shared/lib/icons';

const T = {
  footerNav: { en: 'Footer', id: 'Footer' },
  backToTop: { en: 'Back to top', id: 'Kembali ke atas' },
};

export function Footer() {
  const { t } = useLang();
  const { content } = useContent();
  const profile = content.profile;

  const navItems = NAV_SECTIONS.map((section) => {
    const custom = content.settings.nav.find((item) => item.id === section.id);
    return { id: section.id, label: custom?.label ?? section.label };
  });

  return (
    <footer className="overflow-hidden border-t border-ink-800">
      <Marquee duration={42} repeat={6} className="border-b border-ink-800 py-6">
        <span className="px-6 font-mono text-small uppercase tracking-[0.24em] text-chalk-faint">
          {t(content.settings.footerNote)}
        </span>
        <span aria-hidden="true" className="marquee-dot" />
      </Marquee>

      <div className="shell flex flex-col gap-10 py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-small font-medium text-chalk">{profile.name}</p>
            <p className="mt-1 text-small text-chalk-muted">
              {t(profile.role)} · {t(profile.location)}
            </p>
          </div>

          <nav aria-label={t(T.footerNav)}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navItems.map((section) => (
                <li key={section.id}>
                  <Link
                    to={`/#${section.id}`}
                    data-cursor="link"
                    className="link-sweep text-small text-chalk-muted transition-colors duration-fast hover:text-chalk"
                  >
                    {t(section.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {profile.socials.map((social) => {
              const Icon = socialIcon(social.icon);
              return (
                <a
                  key={social.url}
                  href={social.url}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  data-cursor="link"
                  className="press rounded-full border border-ink-800 p-2 text-chalk-muted hover:border-ink-700 hover:text-chalk"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              );
            })}
            <BackToTop label={t(T.backToTop)} />
          </div>
        </div>
      </div>

      {/* The name runs as a marquee instead of a static lockup: at 11rem it stopped ~250px short on
          a wide screen and started too far from the left edge, so the type sat off to one side with
          dead space beside it. As a loop the band fills any width. */}
      <Marquee duration={34} repeat={2} className="wordmark-band">
        <span aria-hidden="true" className="wordmark px-[clamp(0.75rem,2vw,2rem)]">
          {profile.name}
        </span>
        <span aria-hidden="true" className="marquee-dot mx-[clamp(0.75rem,2vw,2rem)]" />
      </Marquee>

      <div className="shell flex flex-col gap-3 border-t border-ink-800/60 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-chalk-faint">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-chalk-faint">
          Indonesia · Remote
        </p>
      </div>
    </footer>
  );
}