import type { Lang } from '../../content';

/** One PDF per language under `public/cv`, so the button follows the page language instead of
 *  handing an Indonesian recruiter an English sheet. */
export const CV_HREF: Record<Lang, string> = {
  en: '/cv/aldi-pradana-hakim-cv-en.pdf',
  id: '/cv/aldi-pradana-hakim-cv-id.pdf',
};

export const CV_FILENAME: Record<Lang, string> = {
  en: 'CV_Aldi_Pradana_Hakim_EN.pdf',
  id: 'CV_Aldi_Pradana_Hakim_ID.pdf',
};
