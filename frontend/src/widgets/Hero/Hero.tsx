import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { PROFILE } from '../../content';
import { Monogram } from '../../shared/components/Monogram';
import { useLang } from '../../shared/context/language';
import { buttonStyles } from '../../shared/ui/buttonStyles';

const T = {
  seeWork: { en: 'See my work', id: 'Lihat proyek saya' },
  hireMe: { en: 'Hire me', id: 'Hubungi saya' },
};

export function Hero() {
  const { t } = useLang();

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40"
    >
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[560px]"
      />

      <div className="shell relative">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="animate-fade-in">
            <p className="inline-flex items-center gap-2 rounded-full border border-ink-800 bg-ink-900 px-3 py-1.5 text-small text-chalk-muted">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t(PROFILE.availability)}
            </p>

            <h1 id="hero-title" className="mt-6 text-display font-semibold text-chalk">
              {PROFILE.name}
            </h1>

            <p className="mt-4 font-mono text-label uppercase text-accent">{t(PROFILE.role)}</p>

            <p className="mt-6 max-w-xl text-body text-chalk-muted">{t(PROFILE.tagline)}</p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#work" className={buttonStyles('primary', 'lg')}>
                {t(T.seeWork)}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#contact" className={buttonStyles('secondary', 'lg')}>
                {t(T.hireMe)}
              </a>
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-small text-chalk-muted">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-chalk-faint" aria-hidden="true" />
                {t(PROFILE.location)}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-chalk-faint" aria-hidden="true" />
                {t(PROFILE.responseTime)}
              </li>
            </ul>
          </div>

          {PROFILE.photo ? (
            <img
              src={PROFILE.photo}
              alt={PROFILE.name}
              width={800}
              height={800}
              loading="eager"
              decoding="async"
              className="mx-auto aspect-square w-full max-w-[260px] rounded-3xl border border-ink-800 bg-ink-900 object-cover lg:max-w-none"
            />
          ) : (
            <Monogram
              initials={PROFILE.initials}
              className="mx-auto w-full max-w-[260px] lg:max-w-none"
            />
          )}
        </div>
      </div>
    </section>
  );
}
