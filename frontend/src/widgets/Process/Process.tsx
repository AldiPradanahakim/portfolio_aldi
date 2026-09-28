import { PROCESS } from '../../content';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';

const T = {
  eyebrow: { en: 'How I work', id: 'Cara saya bekerja' },
  title: {
    en: 'Five steps from first message to handover',
    id: 'Lima langkah dari pesan pertama sampai serah terima',
  },
  lead: {
    en: 'What happens after you send the first message — including what is covered afterwards and what is not.',
    id: 'Apa yang terjadi setelah Anda mengirim pesan pertama — termasuk apa yang masih ditanggung setelahnya dan apa yang tidak.',
  },
};

export function Process() {
  const { t } = useLang();

  return (
    <Section id="process" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <Reveal>
        <ol className="flex flex-col gap-10 border-l border-ink-800 pl-6 sm:pl-8">
          {PROCESS.map((step) => (
            <li key={step.n}>
              <p className="font-mono text-small text-accent">{step.n}</p>
              <h3 className="mt-2 text-h3 font-semibold text-chalk">{t(step.title)}</h3>
              <p className="mt-2 max-w-3xl text-body text-chalk-muted">{t(step.detail)}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
