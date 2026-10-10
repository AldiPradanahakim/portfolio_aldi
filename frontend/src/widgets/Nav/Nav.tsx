import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PROFILE, type Lang } from '../../content';
import { ThemeToggle } from '../../shared/components/ThemeToggle';
import { useLang } from '../../shared/context/language';
import { NAV_SECTIONS } from '../../shared/constants/sections';
import { useFocusTrap } from '../../shared/hooks/useFocusTrap';
import { useScrolled } from '../../shared/hooks/useScrolled';
import { cx } from '../../shared/lib/cn';
import { socialIcon } from '../../shared/lib/icons';
import { buttonStyles } from '../../shared/ui/buttonStyles';

const T = {
  primaryNav: { en: 'Primary', id: 'Utama' },
  language: { en: 'Language', id: 'Bahasa' },
  openMenu: { en: 'Open menu', id: 'Buka menu' },
  closeMenu: { en: 'Close menu', id: 'Tutup menu' },
  hire: { en: 'Hire me', id: 'Hubungi saya' },
};

function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  const options: Lang[] = ['en', 'id'];

  return (
    <div
      role="group"
      aria-label={t(T.language)}
      className={cx('flex items-center rounded-full border border-ink-800 p-0.5', className)}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className={cx(
            'press rounded-full px-2.5 py-1 font-mono text-[11px] uppercase',
            lang === option ? 'bg-ink-800 text-chalk' : 'text-chalk-muted hover:text-chalk',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const { t } = useLang();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const onHome = pathname === '/';
  // On the deck the document never scrolls — the panel does — so the scroll-driven background
  // would never appear while text slides under the header. There it is opaque from the start.
  const opaque = useScrolled(24) || onHome;
  // The deck renders exactly one panel, so the hash *is* the active section — no observer needed.
  const active = onHome ? hash.slice(1) : '';
  const drawerRef = useFocusTrap<HTMLDivElement>(open, () => setOpen(false));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors',
        opaque || open ? 'border-ink-800 bg-ink-950/95' : 'border-transparent',
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 sm:h-[72px]">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 text-small font-medium text-chalk"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-xl border border-ink-800 bg-ink-900 font-mono text-[11px] tracking-widest text-accent"
          >
            {PROFILE.initials}
          </span>
          <span className="hidden sm:inline">{PROFILE.name}</span>
        </Link>

        <nav aria-label={t(T.primaryNav)} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_SECTIONS.map((link) => (
              <li key={link.id}>
                <Link
                  to={`/#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={cx(
                    'relative block rounded-full px-3 py-2 text-small transition-colors duration-fast',
                    active === link.id ? 'text-chalk' : 'text-chalk-muted hover:text-chalk',
                  )}
                >
                  {t(link.label)}
                  <span
                    aria-hidden="true"
                    className={cx(
                      'absolute inset-x-3 bottom-0.5 h-px origin-center bg-accent transition-[opacity,transform]',
                      active === link.id ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0',
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle className="hidden sm:flex" />
          <Link to="/#contact" className={cx(buttonStyles('primary', 'sm'), 'hidden md:inline-flex')}>
            {t(T.hire)}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label={open ? t(T.closeMenu) : t(T.openMenu)}
            className="press rounded-full border border-ink-800 p-2 text-chalk-muted hover:border-ink-700 hover:text-chalk lg:hidden"
          >
            {open ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden">
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="animate-fade-in fixed inset-x-0 bottom-0 top-16 bg-ink-950/80 sm:top-[72px]"
          />
          <div
            id="nav-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={t(T.primaryNav)}
            className="animate-drawer-in fixed bottom-0 right-0 top-16 w-full max-w-sm overflow-y-auto border-l border-ink-800 bg-ink-950 p-6 sm:top-[72px]"
          >
            <ul className="flex flex-col gap-1">
              {NAV_SECTIONS.map((link) => (
                <li key={link.id}>
                  <Link
                    to={`/#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-h3 text-chalk-muted transition-colors duration-fast hover:bg-ink-900 hover:text-chalk"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-4 border-t border-ink-800 pt-6">
              <Link
                to="/#contact"
                onClick={() => setOpen(false)}
                className={buttonStyles('primary', 'md')}
              >
                {t(T.hire)}
              </Link>
              {/* the theme toggle stays in the header row, which remains visible above the drawer */}
              <LanguageToggle className="self-start" />
              <ul className="flex flex-col gap-3">
                {PROFILE.socials.map((social) => {
                  const Icon = socialIcon(social.icon);
                  return (
                    <li key={social.url}>
                      <a
                        href={social.url}
                        className="inline-flex items-center gap-2 text-small text-chalk-muted transition-colors duration-fast hover:text-chalk"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {social.icon === 'mail' ? PROFILE.email : social.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
