import { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useContent } from '../../data';
import { useLang } from '../../shared/context/language';
import { Magnetic } from '../../motion/Magnetic';
import { Marquee } from '../../motion/Marquee';

const T = {
  seeWork: { en: 'See the work', id: 'Lihat karya' },
  hireMe: { en: 'Get in touch', id: 'Hubungi' },
  scroll: { en: 'Scroll', id: 'Gulir' },
};

/**
 * Hero: one gesture per screen.
 *
 * Rebuilt after a design audit against the 2026 reference set — the previous version stacked
 * eight decorations (rings, halo, giant monogram, status pill, version chips, numeric rail) and
 * the largest object on screen was a watermark, not the message. Here the portrait is the ground,
 * the name is the focal object, and there is exactly one accent colour and one CTA row.
 */
export function Hero() {
  const { t } = useLang();
  const { content } = useContent();
  const profile = content.profile;

  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // The name drifts up and dissolves; the portrait stays and only dims, so the two layers
  // separate in depth instead of sliding as one flat card.
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);
  const nameFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const shotScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const shotFade = useTransform(scrollYProgress, [0, 0.9], [1, 0.55]);

  const nameWords = profile.name.trim().split(/\s+/);

  // no version numbers: those are dependency trivia that reads junior, and they rot
  const stack = Array.from(
    new Map(content.skills.flatMap((group) => group.items).map((item) => [item.en, item])).values(),
  )
    .slice(0, 8)
    .map((item) => t(item));

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-title"
      className="hero-stage relative flex flex-col justify-between overflow-hidden pb-0 pt-16 sm:pt-20"
    >
      {/* the only decoration: one ember bloom behind the subject */}
      <div aria-hidden="true" className="hero-bloom" />

      <motion.div aria-hidden="true" style={{ scale: shotScale, opacity: shotFade }} className="hero-shot">
        {profile.photo ? <img src={profile.photo} alt="" decoding="async" fetchPriority="high" /> : null}
      </motion.div>

      <div className="shell relative z-10">
        <motion.div style={{ y: nameY, opacity: nameFade }}>
          <p className="hero-status">
            <span aria-hidden="true" className="hero-dot" />
            {t(profile.availability)}
          </p>

          <h1 id="hero-title" aria-label={profile.name} className="hero-title mt-6">
            {/* Last word in italic serif: the one piece of typographic contrast on the page. */}
            <span className="sr-only">{profile.name}</span>
            <span aria-hidden="true" className="block">
              {nameWords.slice(0, -1).join(' ')}{' '}
              <span className="st-numeral">{nameWords[nameWords.length - 1]}</span>
            </span>
          </h1>

          <div className="hero-foot">
            <div className="max-w-md">
              <p className="hero-role">{t(profile.role)}</p>
              <p className="mt-4 text-body text-chalk-muted">{t(profile.tagline)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href="#work" data-cursor="link" className="hero-cta">
                  {t(T.seeWork)}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contact" data-cursor="link" className="hero-cta hero-cta--ghost">
                  {t(T.hireMe)}
                </a>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10">
        <Marquee duration={38} className="hero-marquee">
          <span className="hero-stack">
            {stack.map((item) => (
              <span key={item} className="hero-stack-item">
                {item}
                <span aria-hidden="true" className="hero-star">✳</span>
              </span>
            ))}
          </span>
        </Marquee>

        <a
          href="#about"
          data-cursor="link"
          className="hero-scroll shell"
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          {t(T.scroll)}
        </a>
      </div>
    </section>
  );
}
