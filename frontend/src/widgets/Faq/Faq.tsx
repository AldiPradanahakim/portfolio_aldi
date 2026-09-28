import { useState } from 'react';
import { Plus } from 'lucide-react';
import { FAQ } from '../../content';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';
import { cx } from '../../shared/lib/cn';

const T = {
  eyebrow: { en: 'FAQ', id: 'FAQ' },
  title: {
    en: 'Questions clients ask before starting',
    id: 'Pertanyaan yang biasanya muncul sebelum mulai',
  },
  lead: {
    en: 'Straight answers about timing, revisions, code ownership, and what happens after handover.',
    id: 'Jawaban langsung soal waktu pengerjaan, revisi, kepemilikan kode, dan apa yang terjadi setelah serah terima.',
  },
};

export function Faq() {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <Reveal>
        <ul className="divide-y divide-ink-800 border-y border-ink-800">
          {FAQ.map((item, index) => {
            const open = openIndex === index;
            return (
              <li key={t(item.q)}>
                <h3>
                  <button
                    type="button"
                    id={`faq-button-${index}`}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-h3 font-medium text-chalk">{t(item.q)}</span>
                    <Plus
                      aria-hidden="true"
                      className={cx(
                        'h-4 w-4 shrink-0 text-accent transition-transform duration-200',
                        open && 'rotate-45',
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  hidden={!open}
                  className="pb-6"
                >
                  <p className="max-w-3xl text-body text-chalk-muted">{t(item.a)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
