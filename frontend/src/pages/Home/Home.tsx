import { PROFILE } from '../../content';
import { useLang } from '../../shared/context/language';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';
import { About } from '../../widgets/About/About';
import { Contact } from '../../widgets/Contact/Contact';
import { Faq } from '../../widgets/Faq/Faq';
import { Hero } from '../../widgets/Hero/Hero';
import { Journey } from '../../widgets/Journey/Journey';
import { Process } from '../../widgets/Process/Process';
import { Services } from '../../widgets/Services/Services';
import { Skills } from '../../widgets/Skills/Skills';
import { TrustStrip } from '../../widgets/TrustStrip/TrustStrip';
import { Work } from '../../widgets/Work/Work';

export default function Home() {
  const { t } = useLang();

  useDocumentTitle(`${PROFILE.name} — ${t(PROFILE.role)}`);

  return (
    <>
      <Hero />
      <TrustStrip />
      <About />
      <Work />
      <Services />
      <Process />
      <Skills />
      <Journey />
      <Faq />
      <Contact />
    </>
  );
}
