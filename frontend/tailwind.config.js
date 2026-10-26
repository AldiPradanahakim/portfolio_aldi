/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Every colour resolves to a CSS variable declared in src/index.css. The variables are
        // the single theme mechanism: `:root` holds the dark ramp, `:root.light` (set by the
        // pre-paint script in index.html and by ThemeProvider) re-declares it. No `dark:`
        // variants anywhere, and the original ink/chalk/accent names keep working unchanged.
        ink: {
          950: 'rgb(var(--bg) / <alpha-value>)', // page background
          900: 'rgb(var(--surface) / <alpha-value>)', // cards, fields
          850: 'rgb(var(--surface-raised) / <alpha-value>)', // chips, wells
          800: 'rgb(var(--border) / <alpha-value>)', // hairlines
          700: 'rgb(var(--border-strong) / <alpha-value>)',
          600: 'rgb(var(--border-hover) / <alpha-value>)',
        },
        chalk: {
          DEFAULT: 'rgb(var(--text) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
          faint: 'rgb(var(--text-faint) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          deep: 'rgb(var(--accent-deep) / <alpha-value>)',
        },
        // The one hot colour: ember is the softer companion used for glows and secondary marks.
        ember: 'rgb(var(--ember) / <alpha-value>)',
        // Cool metal for meta rows and timestamps — the only non-warm neutral in the palette.
        steel: 'rgb(var(--steel) / <alpha-value>)',
        danger: {
          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
          border: 'rgb(var(--danger-border) / <alpha-value>)',
        },
        // Project covers are dark UI mockups; they stay on a dark surface in both themes.
        media: {
          DEFAULT: 'rgb(var(--media) / <alpha-value>)',
          ring: 'rgb(var(--media-ring) / <alpha-value>)',
          text: 'rgb(var(--media-text) / <alpha-value>)',
        },
      },
      fontFamily: {
        // Instrument Serif for statements, Inter Tight for names and UI, JetBrains Mono for
        // labels. System fallbacks follow each family so offline dev keeps the same rhythm.
        display: [
          'Instrument Serif',
          'Iowan Old Style',
          'Palatino Linotype',
          'Book Antiqua',
          'Palatino',
          'Georgia',
          'serif',
        ],
        sans: [
          'Inter Tight',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI Variable Text',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'Cascadia Mono',
          'Segoe UI Mono',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      // One size per role. `mega`/`giant`/`statement` are the editorial scale; the rest are the
      // original roles, kept so nothing that reads them changes size unexpectedly.
      fontSize: {
        mega: ['clamp(3.4rem, 21vw, 13rem)', { lineHeight: '0.82', letterSpacing: '-0.055em' }],
        giant: ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '0.92', letterSpacing: '-0.045em' }],
        statement: ['clamp(1.6rem, 3.6vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        hero: ['clamp(2.75rem, 7vw, 5.5rem)', { lineHeight: '0.9', letterSpacing: '-0.045em' }],
        display: ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        h2: ['clamp(1.5rem, 2.6vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h3: ['1.0625rem', { lineHeight: '1.45', letterSpacing: '-0.01em' }],
        lead: ['1.125rem', { lineHeight: '1.65' }],
        body: ['1rem', { lineHeight: '1.7' }],
        small: ['0.875rem', { lineHeight: '1.6' }],
        label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
        micro: ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.28em' }],
      },
      // One curve per intent; the raw custom properties live in index.css for CSS-only motion.
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.22, 1, 0.36, 1)',
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        quint: 'cubic-bezier(0.83, 0, 0.17, 1)',
      },
      transitionDuration: { DEFAULT: '240ms', fast: '160ms', slow: '640ms' },
      maxWidth: { shell: '1280px', measure: '62ch' },
      borderRadius: { '3xl': '22px' },
    },
  },
  plugins: [],
};
