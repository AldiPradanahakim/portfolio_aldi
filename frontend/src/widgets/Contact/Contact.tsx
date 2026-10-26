import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Copy } from 'lucide-react';
import { useContent } from '../../data';
import { useLang } from '../../shared/context/language';
import { socialIcon } from '../../shared/lib/icons';

const T = {
  eyebrow: { en: 'Contact', id: 'Kontak' },
  title: { en: 'Contact', id: 'Kontak' },
  lead: {
    en: 'Reach me through any of the channels below.',
    id: 'Silakan hubungi lewat salah satu kanal berikut.',
  },
  copyEmail: { en: 'Copy address', id: 'Salin alamat' },
  copied: { en: 'Copied', id: 'Tersalin' },
};

/** What a channel reads as under its title — the handle, not a sentence. */
function handleOf(url: string) {
  if (url.startsWith('mailto:')) return url.slice(7);
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}

/**
 * Contact panel: the channel list on the right, everything else on the left. Deliberately not a
 * `Section` — the reference has no numbered header here, and the pills carry a stack signature
 * that would otherwise need a section of its own.
 */
export function Contact() {
  const { t } = useLang();
  const { content } = useContent();
  const profile = content.profile;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — the mailto link still works
    }
  };

  const channels = [
    { label: 'Email', url: `mailto:${profile.email}`, icon: 'mail' },
    ...profile.socials.filter((social) => social.icon !== 'mail'),
  ];

  // A flat, deduped slice of the stack: the pills are a signature, not the skills page. Only
  // bare technology names — a phrase would not fit a pill.
  const pills = Array.from(
    new Map(
      content.skills
        .flatMap((group) => group.items)
        .filter((item) => !/[\s&/()]/.test(item.en))
        .map((item) => [item.en, item]),
    ).values(),
  ).slice(0, 8);

  return (
    <section id="contact" aria-labelledby="contact-title" className="contact">
      <div className="shell">
        <div className="contact-panel">
          <div className="contact-grid">
            <div className="contact-col">
              <div>
                <p className="eyebrow">{t(T.eyebrow)}</p>
                <h2 id="contact-title" className="contact-title">{t(T.title)}</h2>
                <p className="contact-lead">{t(T.lead)}</p>

                <ul className="contact-pills">
                  {pills.map((pill) => (
                    <li key={pill.en}>{t(pill)}</li>
                  ))}
                </ul>
              </div>

              <div className="contact-foot">
                <span aria-hidden="true" className="rule" />
                <div className="contact-foot-row">
                  <p>© {new Date().getFullYear()} {profile.name}</p>
                  <button type="button" onClick={copyEmail} className="contact-copy">
                    {copied ? <CheckCircle2 aria-hidden="true" /> : <Copy aria-hidden="true" />}
                    {copied ? t(T.copied) : t(T.copyEmail)}
                  </button>
                </div>
              </div>
            </div>

            <ul className="contact-list">
              {channels.map((channel) => {
                const Icon = socialIcon(channel.icon);
                return (
                  <li key={channel.url}>
                    <a href={channel.url} target="_blank" rel="noopener noreferrer" className="contact-card">
                      <Icon aria-hidden="true" className="contact-card-icon" />
                      <span className="contact-card-text">
                        <span className="contact-card-title">{channel.label}</span>
                        <span className="contact-card-handle">{handleOf(channel.url)}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="contact-card-arrow" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
