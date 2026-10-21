import { Check } from 'lucide-react';
import { SERVICES } from '../../content';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';
import { serviceIcon } from '../../shared/lib/icons';
import { cx } from '../../shared/lib/cn';

const T = {
  eyebrow: { en: 'Services', id: 'Layanan' },
  title: { en: 'What I can build for you', id: 'Yang bisa saya bangun untuk Anda' },
  lead: {
    en: 'Each service below maps to work already shipped in the projects above. There is no price list — scope decides the number, and you get it in writing before anything starts.',
    id: 'Setiap layanan di bawah ini berkaitan dengan pekerjaan yang sudah jadi pada proyek-proyek di atas. Tidak ada daftar harga — besarannya ditentukan lingkup, dan Anda menerimanya tertulis sebelum pekerjaan dimulai.',
  },
};

export function Services() {
  const { t } = useLang();
  const reduced = usePrefersReducedMotion();

  return (
    <Section id="services" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <ul className="divide-y divide-ink-800 border-y border-ink-800">
        {SERVICES.map((service, index) => {
          const Icon = serviceIcon(service.icon);
          return (
            <li key={service.id} className="group">
              <Reveal delay={index * 60}>
                <div className="grid gap-6 py-8 sm:py-10 md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,22rem)] md:gap-10">
                  <span
                    aria-hidden="true"
                    className="font-mono text-h2 leading-none text-ink-700 transition-colors duration-fast group-hover:text-accent"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <div className="flex items-center gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-ink-800 bg-ink-850 text-accent">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="text-h3 font-semibold text-chalk">{t(service.title)}</h3>
                    </div>
                    <p className="mt-4 max-w-xl text-small text-chalk-muted">
                      {t(service.description)}
                    </p>
                  </div>

                  {/* reveal on hover/focus; always expanded on mobile and for reduced motion */}
                  <ul
                    className={cx(
                      'flex flex-col gap-2.5 transition-[opacity,transform] duration-slow motion-reduce:transition-none',
                      reduced
                        ? ''
                        : 'md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100',
                    )}
                  >
                    {service.deliverables.map((deliverable) => (
                      <li key={t(deliverable)} className="flex gap-2 text-small text-chalk-muted">
                        <Check
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        {t(deliverable)}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
