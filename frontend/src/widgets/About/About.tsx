import { PROFILE } from '../../content';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';

const T = {
  eyebrow: { en: 'About', id: 'Tentang' },
  title: { en: 'Who you would be working with', id: 'Siapa yang akan mengerjakan proyek Anda' },
};

/** PROFILE.bio: the first paragraph leads, the rest are supporting prose. */
export function About() {
  const { t } = useLang();
  const [lead, ...rest] = PROFILE.bio;

  return (
    <Section id="about" eyebrow={t(T.eyebrow)} title={t(T.title)}>
      <Reveal>
        <div className="max-w-3xl">
          <p className="text-lead text-chalk">{t(lead)}</p>
          {rest.map((paragraph) => (
            <p key={t(paragraph)} className="mt-5 text-body text-chalk-muted">
              {t(paragraph)}
            </p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
