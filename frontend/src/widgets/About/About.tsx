import { PROFILE } from '../../content';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';

const T = {
  eyebrow: { en: 'About', id: 'Tentang' },
  title: { en: 'Who you would be working with', id: 'Siapa yang akan mengerjakan proyek Anda' },
  location: { en: 'Location', id: 'Lokasi' },
  availability: { en: 'Availability', id: 'Ketersediaan' },
  responseTime: { en: 'Response time', id: 'Waktu balasan' },
};

/** PROFILE.bio: the first paragraph leads, the rest are supporting prose. */
export function About() {
  const { t } = useLang();
  const [lead, ...rest] = PROFILE.bio;

  return (
    <Section id="about" eyebrow={t(T.eyebrow)} title={t(T.title)}>
      <Reveal>
        <div className="max-w-3xl">
          <blockquote className="border-l-2 border-accent pl-6 sm:pl-8">
            <p className="text-lead text-chalk">{t(lead)}</p>
          </blockquote>

          <div className="mt-8 max-w-[62ch]">
            {rest.map((paragraph) => (
              <p key={t(paragraph)} className="mb-5 text-body text-chalk-muted last:mb-0">
                {t(paragraph)}
              </p>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <dl className="mt-10 grid gap-6 border-t border-ink-800 pt-8 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-label uppercase text-chalk-faint">{t(T.location)}</dt>
            <dd className="mt-2 text-small text-chalk-muted">{t(PROFILE.location)}</dd>
          </div>
          <div>
            <dt className="font-mono text-label uppercase text-chalk-faint">
              {t(T.availability)}
            </dt>
            <dd className="mt-2 text-small text-chalk-muted">{t(PROFILE.availability)}</dd>
          </div>
          <div>
            <dt className="font-mono text-label uppercase text-chalk-faint">
              {t(T.responseTime)}
            </dt>
            <dd className="mt-2 text-small text-chalk-muted">{t(PROFILE.responseTime)}</dd>
          </div>
        </dl>
      </Reveal>
    </Section>
  );
}
