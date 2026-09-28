import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Copy, Send } from 'lucide-react';
import { PROFILE, type L } from '../../content';
import { Section } from '../../shared/components/Section';
import { useLang } from '../../shared/context/language';
import { useContactForm } from '../../shared/hooks/useContactForm';
import type { ContactErrorCode } from '../../shared/lib/api';
import { socialIcon } from '../../shared/lib/icons';
import { Button } from '../../shared/ui/Button';
import { TextAreaField, TextField } from '../../shared/ui/Field';

const T = {
  eyebrow: { en: 'Contact', id: 'Kontak' },
  title: { en: 'Tell me what you need built', id: 'Ceritakan apa yang perlu dibangun' },
  lead: {
    en: 'A short description of the problem is enough to start. The first reply comes with follow-up questions and, once the scope is clear, a written estimate.',
    id: 'Deskripsi singkat tentang masalahnya sudah cukup untuk memulai. Balasan pertama berisi pertanyaan lanjutan dan, setelah lingkupnya jelas, estimasi tertulis.',
  },
  name: { en: 'Name', id: 'Nama' },
  email: { en: 'Email', id: 'Email' },
  subject: { en: 'Subject', id: 'Subjek' },
  message: { en: 'Message', id: 'Pesan' },
  send: { en: 'Send message', id: 'Kirim pesan' },
  sending: { en: 'Sending…', id: 'Mengirim…' },
  required: { en: 'This field is required.', id: 'Bagian ini wajib diisi.' },
  invalidEmail: {
    en: 'Enter a valid email address.',
    id: 'Masukkan alamat email yang benar.',
  },
  successTitle: { en: 'Message sent', id: 'Pesan terkirim' },
  successBody: {
    en: 'Thank you. I usually answer within one business day.',
    id: 'Terima kasih. Pesan biasanya saya balas dalam satu hari kerja.',
  },
  sendAnother: { en: 'Send another message', id: 'Kirim pesan lain' },
  errorTitle: { en: 'The message was not sent', id: 'Pesan tidak terkirim' },
  emailInstead: { en: 'Email me directly instead', id: 'Kirim email langsung saja' },
  copyEmail: { en: 'Copy email address', id: 'Salin alamat email' },
  copied: { en: 'Copied', id: 'Tersalin' },
  fallbackSubject: { en: 'Project inquiry', id: 'Pertanyaan proyek' },
  details: { en: 'Details', id: 'Keterangan' },
  honeypotLabel: { en: 'Website', id: 'Situs web' },
  availability: { en: 'Availability', id: 'Ketersediaan' },
  responseTime: { en: 'Response time', id: 'Waktu balasan' },
};

/**
 * The backend message is Indonesian and meant for logs, so it is never rendered.
 * Every stable code maps to localised copy here; anything unrecognised falls to UNKNOWN.
 */
const CONTACT_ERROR_MESSAGES: Record<ContactErrorCode | 'UNKNOWN', L> = {
  INVALID_JSON: {
    en: 'The server could not read the message. Please try again.',
    id: 'Server tidak bisa membaca pesannya. Coba lagi.',
  },
  TOO_LARGE: {
    en: 'The message is too large. Please shorten it and try again.',
    id: 'Pesannya terlalu besar. Mohon dipersingkat lalu coba lagi.',
  },
  NOT_FOUND: {
    en: 'The contact form is unavailable right now. Please email me instead.',
    id: 'Formulir kontak sedang tidak tersedia. Silakan kirim email saja.',
  },
  RATE_LIMITED: {
    en: 'Too many messages from this connection. Please try again in a few minutes.',
    id: 'Terlalu banyak pesan dari koneksi ini. Coba lagi beberapa menit lagi.',
  },
  INVALID_BODY: {
    en: 'The form could not be processed. Please check the fields and try again.',
    id: 'Formulir tidak bisa diproses. Mohon periksa isian lalu coba lagi.',
  },
  MISSING_FIELDS: {
    en: 'Some required fields were empty. Please check them and try again.',
    id: 'Ada isian wajib yang kosong. Mohon diperiksa lalu coba lagi.',
  },
  NEWLINE_IN_HEADER: {
    en: 'The subject contains a line break. Please write it on one line.',
    id: 'Subjek mengandung baris baru. Mohon ditulis dalam satu baris.',
  },
  NAME_LENGTH: {
    en: 'The name is too long or too short.',
    id: 'Nama terlalu panjang atau terlalu pendek.',
  },
  EMAIL_INVALID: {
    en: 'The email address was rejected. Please check it and try again.',
    id: 'Alamat email ditolak. Mohon diperiksa lalu coba lagi.',
  },
  SUBJECT_LENGTH: {
    en: 'The subject is too long or too short.',
    id: 'Subjek terlalu panjang atau terlalu pendek.',
  },
  MESSAGE_LENGTH: {
    en: 'The message is too long or too short.',
    id: 'Pesan terlalu panjang atau terlalu pendek.',
  },
  SERVER_ERROR: {
    en: 'Something went wrong on the server. Please try again in a moment.',
    id: 'Terjadi kesalahan di server. Coba lagi sebentar lagi.',
  },
  UNKNOWN: {
    en: 'The message could not be sent.',
    id: 'Pesan tidak bisa dikirim.',
  },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY = { name: '', email: '', subject: '', message: '', honeypot: '' };

export function Contact() {
  const { t } = useLang();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const { status, errorCode, submit, reset } = useContactForm();
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const change = (field: keyof typeof EMPTY) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = t(T.required);

    const email = values.email.trim();
    if (!email) next.email = t(T.required);
    else if (!EMAIL_PATTERN.test(email)) next.email = t(T.invalidEmail);

    if (!values.subject.trim()) next.subject = t(T.required);
    if (!values.message.trim()) next.message = t(T.required);
    return next;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    const sent = await submit({
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
      honeypot: values.honeypot,
    });

    if (sent) setValues(EMPTY);
  };

  const mailtoHref = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
    values.subject.trim() || t(T.fallbackSubject),
  )}&body=${encodeURIComponent(values.message)}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — the mailto link next to this button still works
    }
  };

  return (
    <Section id="contact" eyebrow={t(T.eyebrow)} title={t(T.title)} lead={t(T.lead)}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          {status === 'success' ? (
            <div role="status" className="card flex flex-col items-start gap-4 p-6 sm:p-8">
              <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="text-h3 font-semibold text-chalk">{t(T.successTitle)}</h3>
              <p className="text-body text-chalk-muted">{t(T.successBody)}</p>
              <Button variant="secondary" onClick={reset}>
                {t(T.sendAnother)}
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
              {status === 'error' && (
                <div role="alert" className="rounded-xl border border-red-400/60 bg-ink-900 p-4">
                  <p className="flex items-center gap-2 text-small font-medium text-red-300">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {t(T.errorTitle)}
                  </p>
                  <p className="mt-2 text-small text-chalk-muted">
                    {t(CONTACT_ERROR_MESSAGES[errorCode ?? 'UNKNOWN'])}
                  </p>
                  <a
                    href={mailtoHref}
                    className="mt-3 inline-block text-small font-medium text-accent underline underline-offset-4"
                  >
                    {t(T.emailInstead)}
                  </a>
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <TextField
                  id="name"
                  label={t(T.name)}
                  error={errors.name}
                  value={values.name}
                  onChange={change('name')}
                  autoComplete="name"
                  required
                />
                <TextField
                  id="email"
                  label={t(T.email)}
                  error={errors.email}
                  value={values.email}
                  onChange={change('email')}
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <TextField
                id="subject"
                label={t(T.subject)}
                error={errors.subject}
                value={values.subject}
                onChange={change('subject')}
                required
              />

              <TextAreaField
                id="message"
                label={t(T.message)}
                error={errors.message}
                value={values.message}
                onChange={change('message')}
                required
              />

              {/* honeypot: hidden from users and from the tab order, filled only by bots */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">{t(T.honeypotLabel)}</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.honeypot}
                  onChange={change('honeypot')}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" size="lg" disabled={status === 'submitting'}>
                  {status === 'submitting' ? t(T.sending) : t(T.send)}
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
                <p className="text-small text-chalk-faint">{t(PROFILE.responseTime)}</p>
              </div>
            </form>
          )}
        </div>

        <aside className="flex flex-col gap-8">
          <div>
            <h3 className="font-mono text-label uppercase text-chalk-faint">{t(T.details)}</h3>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${PROFILE.email}`}
                className="text-body text-chalk underline decoration-ink-700 underline-offset-4 transition-colors duration-150 hover:decoration-accent"
              >
                {PROFILE.email}
              </a>
              <Button
                variant="secondary"
                size="sm"
                onClick={copyEmail}
                aria-label={copied ? t(T.copied) : t(T.copyEmail)}
              >
                {copied ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {copied ? t(T.copied) : t(T.copyEmail)}
              </Button>
            </div>
          </div>

          <dl className="flex flex-col gap-4 border-t border-ink-800 pt-6">
            <div>
              <dt className="font-mono text-label uppercase text-chalk-faint">
                {t(T.availability)}
              </dt>
              <dd className="mt-2 text-small text-chalk-muted">{t(PROFILE.availability)}</dd>
            </div>
            <div>
              <dt className="font-mono text-label uppercase text-chalk-faint">
                {t(T.responseTime)}
              </dt>
              <dd className="mt-2 text-small text-chalk-muted">{t(PROFILE.responseTime)}</dd>
            </div>
          </dl>

          <ul className="flex flex-col gap-3 border-t border-ink-800 pt-6">
            {PROFILE.socials.map((social) => {
              const Icon = socialIcon(social.icon);
              return (
                <li key={social.url}>
                  <a
                    href={social.url}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-small text-chalk-muted transition-colors duration-150 hover:text-chalk"
                  >
                    <Icon className="h-4 w-4 text-chalk-faint" aria-hidden="true" />
                    {social.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </Section>
  );
}
