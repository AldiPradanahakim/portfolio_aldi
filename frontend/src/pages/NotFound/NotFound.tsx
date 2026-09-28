import { Link } from 'react-router-dom';
import { PROFILE } from '../../content';
import { useLang } from '../../shared/context/language';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';
import { buttonStyles } from '../../shared/ui/buttonStyles';

const T = {
  eyebrow: { en: 'Error 404', id: 'Galat 404' },
  title: { en: 'This page does not exist', id: 'Halaman ini tidak ada' },
  body: {
    en: 'The address may be mistyped, or the page may have been moved. The projects and the contact form are one click away.',
    id: 'Alamatnya mungkin salah ketik, atau halamannya sudah dipindahkan. Proyek dan formulir kontaknya hanya berjarak satu klik.',
  },
  home: { en: 'Back to the home page', id: 'Kembali ke beranda' },
  pageTitle: { en: 'Page not found', id: 'Halaman tidak ditemukan' },
  work: { en: 'See the projects', id: 'Lihat proyek' },
};

export default function NotFound() {
  const { t } = useLang();

  useDocumentTitle(`${t(T.pageTitle)} — ${PROFILE.name}`);

  return (
    <section
      aria-labelledby="not-found-title"
      className="shell flex min-h-[70vh] flex-col items-start justify-center py-32"
    >
      <p className="font-mono text-label uppercase text-accent">{t(T.eyebrow)}</p>
      <h1 id="not-found-title" className="mt-4 text-balance text-display font-semibold text-chalk">
        {t(T.title)}
      </h1>
      <p className="mt-6 max-w-lg text-body text-chalk-muted">{t(T.body)}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/" className={buttonStyles('primary', 'md')}>
          {t(T.home)}
        </Link>
        <Link to="/#work" className={buttonStyles('secondary', 'md')}>
          {t(T.work)}
        </Link>
      </div>
    </section>
  );
}
