import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { LanguageProvider } from './shared/context/LanguageProvider';
import { useLang } from './shared/context/language';
import { currentScrollY, recallScroll, rememberScroll } from './shared/lib/scroll';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import { Footer } from './widgets/Footer/Footer';
import { Nav } from './widgets/Nav/Nav';

const ProjectDetail = lazy(() => import('./pages/ProjectDetail/ProjectDetail'));

const T = {
  skip: { en: 'Skip to content', id: 'Lewati ke konten' },
  loading: { en: 'Loading…', id: 'Memuat…' },
};

/**
 * Scroll restoration, owned here rather than by the browser: `html { scroll-behavior: smooth }`
 * makes the native restoration animate, and that animation loses to the scroll-to-top of the
 * route that follows it. Positions are remembered per history entry and restored on POP.
 */
function ScrollManager() {
  const { key, pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const previousKey = useRef(key);

  useEffect(() => {
    history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    if (previousKey.current !== key) {
      rememberScroll(previousKey.current, currentScrollY());
      previousKey.current = key;
    }

    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }

    if (navigationType === 'POP') {
      const remembered = recallScroll(key);
      if (remembered === null) return;
      window.scrollTo({ top: remembered, behavior: 'instant' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [key, pathname, hash, navigationType]);

  return null;
}

function Shell() {
  const { pathname } = useLocation();
  const { t } = useLang();

  return (
    <>
      <ScrollManager />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-ink-950"
      >
        {t(T.skip)}
      </a>

      <Nav />

      <main id="main" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="shell flex min-h-[70vh] items-center justify-center py-32">
              <p className="font-mono text-small text-chalk-faint">{t(T.loading)}</p>
            </div>
          }
        >
          <div key={pathname} className="animate-fade-in">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </LanguageProvider>
  );
}
