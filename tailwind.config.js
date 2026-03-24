/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a5a4a',
          light: '#2d7a68',
          dark: '#134438',
        },
        accent: '#c9a962',
        surface: '#ffffff',
        background: '#fafaf8',
        border: '#e8e8e6',
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'Georgia', 'serif'],
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#1a1a1a',
            a: {
              color: '#1a5a4a',
              '&:hover': {
                color: '#2d7a68',
              },
            },
            code: {
              color: '#1a5a4a',
              backgroundColor: '#f0f0f0',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1a1a1a',
              color: '#f0f0f0',
            },
            blockquote: {
              borderLeftColor: '#1a5a4a',
              color: '#666666',
            },
          },
        },
      },
    },
  },
  plugins: [],
}
