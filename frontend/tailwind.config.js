/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Every colour resolves to a CSS variable declared in src/index.css. The variables are
        // the single theme mechanism: `:root` holds the dark ramp, `:root.light` (set by the
        // pre-paint script in index.html and by ThemeProvider) re-declares it. No `dark:`
        // variants anywhere, and the old ink/chalk/accent names keep working unchanged.
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
        display: [
          'ui-serif',
          'Iowan Old Style',
          'Palatino Linotype',
          'Book Antiqua',
          'Palatino',
          'Georgia',
          'serif',
        ],
        sans: [
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
          'ui-monospace',
          'Cascadia Mono',
          'Segoe UI Mono',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      // one size per role: display/h2 headings, h3 card titles, lead/body/small prose, label eyebrows
      fontSize: {
        hero: ['clamp(3rem, 7vw, 5.25rem)', { lineHeight: '0.92', letterSpacing: '-0.045em' }],
        display: ['clamp(2.5rem, 5.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        h2: ['clamp(1.5rem, 2.6vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h3: ['1.0625rem', { lineHeight: '1.45', letterSpacing: '-0.01em' }],
        lead: ['1.125rem', { lineHeight: '1.65' }],
        body: ['1rem', { lineHeight: '1.7' }],
        small: ['0.875rem', { lineHeight: '1.6' }],
        label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },
      // The motion vocabulary, defined once: one curve, three durations.
      transitionTimingFunction: { DEFAULT: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      transitionDuration: { DEFAULT: '220ms', fast: '150ms', slow: '600ms' },
      maxWidth: { shell: '1120px' },
      borderRadius: { '3xl': '22px' },
    },
  },
  plugins: [],
};
