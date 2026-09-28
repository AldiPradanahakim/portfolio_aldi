/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // near-black neutrals with a cool cast: ink-950 page, ink-900 cards, ink-800 hairlines
        ink: {
          950: '#08090C',
          900: '#0C0E13',
          850: '#111419',
          800: '#181C24',
          700: '#242A35',
          600: '#39414F',
        },
        // on ink-950: chalk 17:1, muted 7.8:1, faint 5:1 — all AA for body text
        chalk: {
          DEFAULT: '#ECEEF2',
          muted: '#9AA3B2',
          faint: '#79818F',
        },
        // the one accent: 7.9:1 on ink-950, and ink-950 on accent is 7.9:1 for solid buttons
        accent: {
          DEFAULT: '#7AA2F7',
          soft: '#A9C1FF',
          deep: '#2A3B63',
        },
      },
      fontFamily: {
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
        display: ['clamp(2.5rem, 5.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        h2: ['clamp(1.5rem, 2.6vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h3: ['1.0625rem', { lineHeight: '1.45', letterSpacing: '-0.01em' }],
        lead: ['1.125rem', { lineHeight: '1.65' }],
        body: ['1rem', { lineHeight: '1.7' }],
        small: ['0.875rem', { lineHeight: '1.6' }],
        label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },
      maxWidth: { shell: '1120px' },
      borderRadius: { '3xl': '22px' },
    },
  },
  plugins: [],
};
