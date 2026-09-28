import { SKILL_GROUPS } from '../../content';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';

const T = {
  eyebrow: { en: 'Stack', id: 'Teknologi' },
  title: {
    en: 'Tools I actually use, grouped by where they sit',
    id: 'Perkakas yang benar-benar saya pakai, dikelompokkan menurut posisinya',
  },
  lead: {
    en: 'From the database and background workers up to the interface — the same stack that appears in the project pages.',
    id: 'Dari database dan proses latar belakang sampai antarmukanya — teknologi yang sama dengan yang ada di halaman proyek.',
  },
};

export function Skills() {
  const { t } = useLang();

  return (
    <Section id="skills" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((group, index) => (
          <Reveal key={group.id} delay={(index % 3) * 80}>
            <h3 className="text-h3 font-semibold text-chalk">{t(group.title)}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item.en} className="chip">
                  {t(item)}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
