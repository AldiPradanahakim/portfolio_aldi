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
  projects: { en: 'Projects shipped', id: 'Proyek selesai' },
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
  const photoY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);
  const photoRotate = useTransform(scrollYProgress, [0, 1], [-1.6, 1.6]);

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
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-14">
        {/* portrait on top with the three counts right beneath it. The old sticky aside left the
            left column half empty the whole way down, which read as a layout bug. */}
        <aside ref={asideRef}>
          <motion.div
            style={{ y: photoY, rotate: photoRotate }}
            className="hero-arch w-full"
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

          <dl className="mt-6 grid grid-cols-3 divide-x divide-ink-800 border-y border-ink-800">
            {stats.map((stat) => (
              <div key={stat.label.en} className="px-1 py-4 first:pl-0 last:pr-0">
                <dd className="font-display text-h2 leading-none">
                  <CountUp value={stat.value} className="text-chalk" />
                </dd>
                <dt className="mt-2 font-mono text-[10px] uppercase leading-tight tracking-[0.16em] text-chalk-faint">
                  {t(stat.label)}
                </dt>
              </div>
            ))}
          </dl>
        </aside>

        <div>
          <Reveal>
            <blockquote className="border-l-2 border-accent pl-5 sm:pl-6">
              <p className="font-display text-statement text-chalk">{t(lead)}</p>
            </blockquote>
          </Reveal>

          <div className="mt-8 max-w-[64ch] space-y-5">
            {rest.map((paragraph, index) => (
              <SplitText
                key={index}
                as="p"
                text={t(paragraph)}
                stagger={8}
                className="text-body text-chalk-muted"
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}