import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Lang } from '../../content';
import { useContent } from '../../data';
import { ThemeToggle } from '../../shared/components/ThemeToggle';
import { useLang } from '../../shared/context/language';
import { NAV_SECTIONS } from '../../shared/constants/sections';
import { useFocusTrap } from '../../shared/hooks/useFocusTrap';
import { cx } from '../../shared/lib/cn';
import { socialIcon } from '../../shared/lib/icons';
import { Cursor } from '../../motion/Cursor';

const T = {
  primaryNav: { en: 'Primary', id: 'Utama' },
  language: { en: 'Language', id: 'Bahasa' },
  openMenu: { en: 'Open menu', id: 'Buka menu' },
  closeMenu: { en: 'Close menu', id: 'Tutup menu' },
  hire: { en: 'Hire me', id: 'Hubungi saya' },
  home: { en: 'Back to top', id: 'Kembali ke atas' },
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

/** Which nav section the reading line is over; '' when none (hero is not a nav target). */
function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState('');

  useEffect(() => {
    const visible: Record<string, boolean> = {};
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible[entry.target.id] = entry.isIntersecting;
        setActive(ids.find((id) => visible[id]) ?? '');
      },
      // the middle band of the viewport decides, so a tall section does not win from its edge
      { rootMargin: '-45% 0px -45% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function Nav() {
  const { t } = useLang();
  const { content } = useContent();
  const profile = content.profile;

  const [open, setOpen] = useState(false);
  const drawerRef = useFocusTrap<HTMLDivElement>(open, () => setOpen(false));

  // Labels come from the CMS when set; NAV_SECTIONS keeps the ids and fallback labels so the
  // active-state detection always matches the sections that actually render.
  const navItems = NAV_SECTIONS.map((section) => {
    const custom = content.settings.nav.find((item) => item.id === section.id);
    return { id: section.id, label: custom?.label ?? section.label };
  });
  const ids = navItems.map((item) => item.id);
  const active = useActiveSection(ids);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <Cursor />

      {/* One floating pill at every width, like the reference: mark left, links centred, actions
          right. The old vertical rail reserved 92px on every desktop viewport and left the
          numerals reading as a bare numbered strip; the pill costs only the 12px above the fold. */}
      <header className="nav-shell">
        <nav aria-label={t(T.primaryNav)} className="nav-pill">
          <a href="#hero" aria-label={t(T.home)} data-cursor="link" className="nav-mark">
            <span aria-hidden="true" className="nav-badge">
              {profile.initials}
            </span>
            <span className="nav-name">{profile.name}</span>
          </a>

          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  data-cursor="link"
                  aria-current={active === item.id ? 'true' : undefined}
                  className={cx('nav-link', active === item.id && 'is-active')}
                >
                  {t(item.label)}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <ThemeToggle />
            <LanguageToggle className="hidden sm:flex" />
            <a href="#contact" data-cursor="link" className="nav-cta hidden md:inline-flex">
              {t(T.hire)}
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="nav-drawer"
              aria-label={open ? t(T.closeMenu) : t(T.openMenu)}
              className="nav-burger"
            >
              <span aria-hidden="true" className="menu-glyph" data-open={open} />
            </button>
          </div>
        </nav>
      </header>

      {/* Sibling of <header>, not a child: `backdrop-blur` on the pill would become the containing
          block for `position: fixed` and collapse the drawer to the pill's own height. */}
      <AnimatePresence>
        {open && (
          <div>
            <motion.div
              aria-hidden="true"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              className="fixed inset-0 z-[60] bg-ink-950/80"
            />
            <motion.div
              id="nav-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label={t(T.primaryNav)}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-0 right-0 top-0 z-[61] w-full max-w-xs overflow-y-auto border-l border-ink-800 bg-ink-950 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-micro uppercase tracking-[0.2em] text-chalk-faint">
                  {t(T.primaryNav)}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t(T.closeMenu)}
                  className="press grid h-9 w-9 place-items-center rounded-full border border-ink-800 text-chalk-muted hover:border-ink-700 hover:text-chalk"
                >
                  <span aria-hidden="true" className="menu-glyph" data-open />
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {navItems.map((link, index) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.045, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === link.id ? 'true' : undefined}
                      className={cx(
                        'block rounded-xl px-3 py-3 text-h3 transition-colors duration-fast hover:bg-ink-900',
                        active === link.id ? 'text-chalk' : 'text-chalk-muted hover:text-chalk',
                      )}
                    >
                      <span className="font-mono text-micro text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="ml-3">{t(link.label)}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-4 border-t border-ink-800 pt-6">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="press rounded-full bg-accent px-5 py-3 text-center text-small font-medium text-ink-950"
                >
                  {t(T.hire)}
                </a>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
                <ul className="flex flex-col gap-3">
                  {profile.socials.map((social) => {
                    const Icon = socialIcon(social.icon);
                    return (
                      <li key={social.url}>
                        <a
                          href={social.url}
                          className="inline-flex items-center gap-2 text-small text-chalk-muted transition-colors duration-fast hover:text-chalk"
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {social.icon === 'mail' ? profile.email : social.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
