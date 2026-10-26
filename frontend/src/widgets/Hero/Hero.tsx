import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useContent } from '../../data';
import { useLang } from '../../shared/context/language';
import { socialIcon } from '../../shared/lib/icons';
import { Marquee } from '../../motion/Marquee';

const T = {
  seeWork: { en: 'See the work', id: 'Lihat karya' },
  socials: { en: 'Social profiles', id: 'Media sosial' },
  portfolio: { en: 'Portfolio', id: 'Portofolio' },
};

/**
 * Hero: one gesture per screen — the name at poster scale with the figure standing in front of
 * it, occluding the letterforms. Two type voices only: heavy grotesque for ALDI PRADANA, one
 * italic serif for Hakim. Everything else is 11px metadata, which is what makes the scale read.
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

  // The two type groups drift apart and dissolve while the figure stays and recedes: the layers
  // separate in depth instead of sliding away as one flat card.
  const leftX = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const rightX = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const typeFade = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const shotScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const shotFade = useTransform(scrollYProgress, [0, 0.95], [1, 0.55]);

  const words = profile.name.trim().split(/\s+/);
  const given = words.slice(0, -1); // ALDI PRADANA
  const surname = words[words.length - 1]; // Hakim

  // no version numbers: those are dependency trivia that reads junior, and they rot
  const stack = Array.from(
    new Map(content.skills.flatMap((group) => group.items).map((item) => [item.en, item])).values(),
  )
    .slice(0, 8)
    .map((item) => t(item));

  const socials = profile.socials.filter((social) => social.icon !== 'mail').slice(0, 4);

  return (
    <section ref={sectionRef} id="hero" aria-labelledby="hero-title" className="hero-stage">
      <div aria-hidden="true" className="hero-bloom" />

      <div className="hero-scene">
        <div className="hero-col hero-col--left">
          <motion.div style={{ x: leftX, opacity: typeFade }}>
            <h1 id="hero-title" className="hero-mega">
              <span className="sr-only">{profile.name} — {t(T.portfolio)}</span>
              {given.map((word) => (
                <span key={word} aria-hidden="true" className="hero-word">
                  {word}
                </span>
              ))}
            </h1>
          </motion.div>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ scale: shotScale, opacity: shotFade }}
          className="hero-figure"
        >
          {profile.photo ? (
            <img src={profile.photo} alt="" decoding="async" fetchPriority="high" />
          ) : null}
        </motion.div>

        <div className="hero-col hero-col--right">
          <motion.div style={{ x: rightX, opacity: typeFade }}>
            <p aria-hidden="true" className="hero-surname">
              {surname}
            </p>
            {/* The third line of the lockup: the name ends with what this page is. Smaller and
                quieter so it extends the name without competing with it. */}
            <p aria-hidden="true" className="hero-subtitle">
              {t(T.portfolio)}
            </p>
          </motion.div>
        </div>

        {/* Row 2: the two eyebrows share one baseline in their own grid row. Inside the columns
            they inherited each column's own height and sat 42px apart, which read as a mistake. */}
        <motion.p style={{ opacity: typeFade }} className="hero-caption hero-caption--left">
          <span aria-hidden="true" className="hero-dot" />
          {t(profile.availability)}
        </motion.p>
        <motion.p style={{ opacity: typeFade }} className="hero-caption hero-caption--end">
          {t(profile.role)}
        </motion.p>
      </div>

      <div className="hero-bottom">
        <ul aria-label={t(T.socials)} className="hero-socials">
          {socials.map((social) => {
            const Icon = socialIcon(social.icon);
            return (
              <li key={social.url}>
                <a
                  href={social.url}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  data-cursor="link"
                  className="hero-social"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hero-links">
          <a href="#work" data-cursor="link" className="hero-link">
            {t(T.seeWork)}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a href={`mailto:${profile.email}`} data-cursor="link" className="hero-link hero-link--mail">
            {profile.email}
          </a>
        </div>
      </div>

      <Marquee duration={38} className="hero-marquee">
        <span className="hero-stack">
          {stack.map((item) => (
            <span key={item} className="hero-stack-item">
              {item}
              <span aria-hidden="true" className="hero-star">
                ✳
              </span>
            </span>
          ))}
        </span>
      </Marquee>
    </section>
  );
}