import { Briefcase, FolderGit2, GraduationCap, type LucideIcon } from 'lucide-react';
import { JOURNEY, type L, type Milestone } from '../../content';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';

const KIND_ICON: Record<Milestone['kind'], LucideIcon> = {
  education: GraduationCap,
  project: FolderGit2,
  work: Briefcase,
};

const KIND_LABEL: Record<Milestone['kind'], L> = {
  education: { en: 'Education', id: 'Pendidikan' },
  project: { en: 'Project', id: 'Proyek' },
  work: { en: 'Work', id: 'Pekerjaan' },
};

const T = {
  eyebrow: { en: 'Journey', id: 'Perjalanan' },
  title: {
    en: 'Coursework, capstone and thesis, in the order they happened',
    id: 'Perkuliahan, capstone, dan tugas akhir, sesuai urutan kejadiannya',
  },
  lead: {
    en: 'Each milestone below is tied to a period that can be checked against the project pages.',
    id: 'Setiap tonggak di bawah ini terikat pada rentang waktu yang bisa dicocokkan dengan halaman proyeknya.',
  },
};

export function Journey() {
  const { t } = useLang();

  return (
    <Section id="journey" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <Reveal>
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute bottom-5 left-[19px] top-5 w-px bg-ink-800"
          />
          <ol className="flex flex-col gap-10">
          {JOURNEY.map((milestone) => {
            const Icon = KIND_ICON[milestone.kind];
            return (
              <li
                key={`${milestone.period}-${t(milestone.title)}`}
                className="grid gap-4 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-6"
              >
                <span
                  aria-hidden="true"
                  className="relative grid h-10 w-10 place-items-center rounded-xl border border-ink-800 bg-ink-900 text-accent"
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="flex flex-wrap items-center gap-3 font-mono text-label uppercase text-chalk-faint">
                    <span>{milestone.period}</span>
                    <span aria-hidden="true">/</span>
                    <span>{t(KIND_LABEL[milestone.kind])}</span>
                  </p>
                  <h3 className="mt-2 text-h3 font-semibold text-chalk">{t(milestone.title)}</h3>
                  <p className="mt-1 text-small text-accent">{t(milestone.org)}</p>
                  <p className="mt-3 max-w-3xl text-body text-chalk-muted">{t(milestone.detail)}</p>
                </div>
              </li>
            );
            })}
          </ol>
        </div>
      </Reveal>
    </Section>
  );
}
