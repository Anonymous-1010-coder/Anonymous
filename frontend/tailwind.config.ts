import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a0a0f',
          light: '#12121a',
          card: '#181825',
          border: '#2a2a3a',
        },
        primary: {
          DEFAULT: '#7c3aed',
          hover: '#8b5cf6',
          muted: '#7c3aed/20',
        },
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#22d3ee',
        },
      },
    },
  },
  plugins: [],
};

export default config;
