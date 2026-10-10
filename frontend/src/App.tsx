import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { LanguageProvider } from './shared/context/LanguageProvider';
import { ThemeProvider } from './shared/context/ThemeProvider';
import { useLang } from './shared/context/language';
import { LoadingScreen } from './shared/components/LoadingScreen';
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
  const onHome = pathname === '/';

  useEffect(() => {
    history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    if (previousKey.current !== key) {
      rememberScroll(previousKey.current, currentScrollY());
      previousKey.current = key;
    }

    // On the deck a hash selects a panel; scrolling to an element that is not mounted yet (or
    // that sits inside the panel's own scroll box) would fight the panel switch.
    if (hash && !onHome) {
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
  }, [key, pathname, hash, navigationType, onHome]);

  return null;
}

function Shell() {
  const { pathname } = useLocation();
  const { t } = useLang();
  const onHome = pathname === '/';

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

      {/* On the deck the page is pinned to the viewport height: nothing outside a panel scrolls,
          so the header never slides out of view while a panel is being read. The top padding is
          the header's own height (h-16 / sm:72px) — the header is fixed, so it takes no space. */}
      <main
        id="main"
        tabIndex={-1}
        className={
          onHome
            ? 'h-[calc(100dvh-4rem)] overflow-hidden pt-16 sm:h-[calc(100dvh-4.5rem)] sm:pt-[72px]'
            : undefined
        }
      >
        <Suspense
          fallback={
            <div className="shell flex min-h-[70vh] items-center justify-center py-32">
              <p className="font-mono text-small text-chalk-faint">{t(T.loading)}</p>
            </div>
          }
        >
          <div key={pathname} className={onHome ? 'h-full' : 'animate-fade-in'}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </main>

      {/* The footer repeats the same destinations as the nav, so it would only add a second way
          to do the same thing on the deck. Kept on the pages that are genuinely scrollable. */}
      {!onHome && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <LoadingScreen />
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
}
