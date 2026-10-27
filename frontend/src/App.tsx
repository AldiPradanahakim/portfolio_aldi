import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { ContentProvider } from './data';
import { LanguageProvider } from './shared/context/LanguageProvider';
import { ThemeProvider } from './shared/context/ThemeProvider';
import { useLang } from './shared/context/language';
import { ScrollProgressBar } from './shared/components/ScrollProgressBar';
import { FloatingCubes } from './widgets/FloatingCubes/FloatingCubes';
import { recallScroll, rememberScroll } from './shared/lib/scroll';
import Home from './pages/Home/Home';
import { Footer } from './widgets/Footer/Footer';
import { Nav } from './widgets/Nav/Nav';

const AdminApp = lazy(() => import('./admin/AdminApp'));

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
  const previousPath = useRef(pathname);
  const mounted = useRef(false);

  useEffect(() => {
    history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    if (previousKey.current !== key) {
      rememberScroll(previousKey.current, window.scrollY);
      previousKey.current = key;
    }

    // A hash always targets a section in the current document. Wait for this commit's DOM (two
    // frames) so the sections exist; a click on the same page glides, a fresh arrival jumps.
    const samePage = mounted.current && previousPath.current === pathname;
    previousPath.current = pathname;
    mounted.current = true;

    if (hash) {
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => {
          document.getElementById(hash.slice(1))?.scrollIntoView({
            block: 'start',
            behavior: samePage ? 'smooth' : 'instant',
          });
        });
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
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

      {/* Kubus hiasan: `position: fixed` di viewport supaya tetap melayang sepanjang halaman,
          bukan hilang saat hero digulir. Ditaruh sebelum <main> agar berada di lapisan paling
          bawah; komponennya sendiri aria-hidden dan pointer-events: none. */}
      <FloatingCubes />

      <Nav />

      {/* The document scrolls under the floating nav pill. `pt-16` reserves its height plus the
          12px it floats above the fold; the pill takes no space of its own. */}
      {/* `relative z-[1]`: konten harus berada di atas lapisan kubus. Tanpa ini kubus yang
          `position: fixed` menang melawan section yang tidak punya stacking context sendiri. */}
      <main
        id="main"
        tabIndex={-1}
        className={onHome ? 'relative z-[1] pt-16' : 'relative z-[1]'}
      >
        <Suspense
          fallback={
            <div className="shell flex min-h-[70vh] items-center justify-center py-32">
              <p className="font-mono text-small text-chalk-faint">{t(T.loading)}</p>
            </div>
          }
        >
          <div key={pathname} className={onHome ? undefined : 'animate-fade-in'}>
            <Outlet />
          </div>
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

/** Rute publik: chrome situs (Nav/Footer/ScrollProgressBar) + provider bahasa & tema. */
function Site() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ScrollProgressBar />
        <Shell />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center bg-ink-950">
                    <p className="font-mono text-small text-chalk-faint">{T.loading.id}</p>
                  </div>
                }
              >
                <AdminApp />
              </Suspense>
            }
          />
          <Route element={<Site />}>
            <Route path="/" element={<Home />} />
            {/* One page only: anything that is not /admin lands on the home page. */}
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}