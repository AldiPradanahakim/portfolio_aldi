import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/* The boot splash in index.html holds #root at opacity 0. Once the app has painted, hand the page
   over: the site-in animation fades the real site in underneath the splash's collapse, so the two
   overlap instead of cutting. The splash then removes itself — nothing here can trap the page. */
const boot = document.getElementById('boot');
boot?.addEventListener('animationend', (event) => {
  if (event.animationName === 'boot-exit') boot.remove();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

requestAnimationFrame(() => {
  document.documentElement.classList.add('boot-ready');
});
