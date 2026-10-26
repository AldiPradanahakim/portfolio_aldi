import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useContent } from '../../data';
import { Monogram } from '../../shared/components/Monogram';
import { Reveal } from '../../shared/components/Reveal';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';
import { CountUp } from '../../motion/CountUp';
import { SplitText } from '../../motion/SplitText';

const T = {
  eyebrow: { en: 'About', id: 'Tentang' },
  title: { en: 'Who you would be working with', id: 'Siapa yang akan mengerjakan proyek Anda' },
  philosophy: { en: 'The philosophy', id: 'Filosofinya' },
  projects: { en: 'Projects shipped', id: 'Proyek yang selesai' },
  tech: { en: 'Technologies', id: 'Teknologi' },
  milestones: { en: 'Milestones', id: 'Tonggak' },
};

export function About() {
  const { t } = useLang();
  const { content } = useContent();
  const profile = content.profile;
  const [lead, ...rest] = profile.bio;
  const [photoFailed, setPhotoFailed] = useState(false);
  const photo = profile.photo && !photoFailed ? profile.photo : null;

  // The portrait drifts against the reading direction while its column scrolls past — the same
  // scroll-linked trick as the hero, so it also runs backwards when you scroll back up.
  const asideRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: asideRef,
    offset: ['start end', 'end start'],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);
  const photoRotate = useTransform(scrollYProgress, [0, 1], [-2.2, 2.2]);

  const techCount = Array.from(
    new Map(content.skills.flatMap((group) => group.items).map((item) => [item.en, item])).values(),
  ).length;

  const stats = [
    { value: String(content.projects.length), label: T.projects },
    { value: String(techCount), label: T.tech },
    { value: String(content.journey.length), label: T.milestones },
  ];

  return (
    <Section id="about" eyebrow={t(T.eyebrow)} title={t(T.title)}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        {/* sticky portrait + counts */}
        <aside ref={asideRef} className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            style={{ y: photoY, rotate: photoRotate }}
            className="hero-arch mx-auto w-full max-w-[260px]"
            data-cursor="view"
          >
            {photo ? (
              <img
                src={photo}
                alt={profile.name}
                width={520}
                height={650}
                loading="lazy"
                decoding="async"
                onError={() => setPhotoFailed(true)}
              />
            ) : (
              <Monogram initials={profile.initials} className="h-full w-full !rounded-none border-0" />
            )}
          </motion.div>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-ink-800 pt-6">
            {stats.map((stat) => (
              <div key={stat.label.en}>
                <dt className="font-mono text-micro uppercase tracking-[0.2em] text-chalk-faint">
                  {t(stat.label)}
                </dt>
                <dd className="mt-2 font-display text-giant">
                  <CountUp value={stat.value} className="text-chalk" />
                </dd>
              </div>
            ))}
          </dl>
        </aside>

        {/* bio, word by word, then the philosophy statement */}
        <div>
          <Reveal>
            <blockquote className="border-l-2 border-accent pl-6 sm:pl-8">
              <p className="font-display text-statement text-chalk">{t(lead)}</p>
            </blockquote>
          </Reveal>

          <div className="mt-10 max-w-[62ch] space-y-6">
            {rest.map((paragraph, index) => (
              <SplitText
                key={index}
                as="p"
                text={t(paragraph)}
                stagger={10}
                className="text-body text-chalk-muted"
              />
            ))}
          </div>

          <div className="mt-14 border-t border-ink-800 pt-10">
            <p className="eyebrow">{t(T.philosophy)}</p>
            <SplitText
              as="p"
              text={t(profile.tagline)}
              stagger={30}
              className="mt-6 max-w-[24ch] font-display text-giant text-chalk"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}