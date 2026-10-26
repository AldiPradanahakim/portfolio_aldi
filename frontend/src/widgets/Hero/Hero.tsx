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
  greeting: { en: 'hi, i\u2019m', id: 'hai, saya' },
};

/**
 * Hero: the full name set as one long line across the page, with the portrait standing behind it.
 * The name is the only thing at display scale — one line, no split, no second type voice — so the
 * eye reads "Aldi Pradana Hakim" in a single sweep instead of climbing between two blocks.
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

  // The name lifts and fades while the figure recedes: the two layers separate in depth.
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const typeFade = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const shotScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const shotFade = useTransform(scrollYProgress, [0, 0.95], [1, 0.55]);

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

      <motion.div
        aria-hidden="true"
        style={{ scale: shotScale, opacity: shotFade }}
        className="hero-figure"
      >
        {profile.photo ? <img src={profile.photo} alt="" decoding="async" fetchPriority="high" /> : null}
      </motion.div>

      <div className="hero-scene">
        <motion.div style={{ opacity: typeFade }} className="hero-lockup">
          <p aria-hidden="true" className="hero-greet">
            {t(T.greeting)}
          </p>
          <h1 id="hero-title" className="hero-name">
            <span className="sr-only">
              {profile.name} — {t(T.portfolio)}
            </span>
            <motion.span aria-hidden="true" style={{ y: nameY }} className="hero-name-line">
              {profile.name}
            </motion.span>
          </h1>
          <p aria-hidden="true" className="hero-subtitle">
            {t(T.portfolio)}
          </p>
        </motion.div>

        <div className="hero-captions">
          <p className="hero-caption">
            <span aria-hidden="true" className="hero-dot" />
            {t(profile.availability)}
          </p>
          <p className="hero-caption">{t(profile.role)}</p>
        </div>
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