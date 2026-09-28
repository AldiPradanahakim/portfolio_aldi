import { Check } from 'lucide-react';
import { SERVICES } from '../../content';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';
import { serviceIcon } from '../../shared/lib/icons';

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

  return (
    <Section id="services" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => {
          const Icon = serviceIcon(service.icon);
          return (
            <li key={service.id} className="h-full">
              <Reveal delay={(index % 3) * 80} className="h-full">
                <div className="card card-hover flex h-full flex-col gap-4 p-6">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="text-h3 font-semibold text-chalk">{t(service.title)}</h3>
                  <p className="text-small text-chalk-muted">{t(service.description)}</p>
                  <ul className="mt-auto flex flex-col gap-2 pt-4">
                    {service.deliverables.map((deliverable) => (
                      <li
                        key={t(deliverable)}
                        className="flex gap-2 text-small text-chalk-muted"
                      >
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
