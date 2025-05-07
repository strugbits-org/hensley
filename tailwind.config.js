/** @type {import('tailwindcss').Config} */

import { fontFamily } from 'tailwindcss/defaultTheme';

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary)",
        "primary-alt": "var(--primary-alt)",
        "primary-glass": "var(--primary-glass)",
        "secondary": "var(--secondary)",
        "secondary-alt": "var(--secondary-alt)",
        "secondary-glass": "var(--secondary-glass)",
        "primary-border": "var(--primary-border)",
        "glass-white": "var(--glass-white)",
        "button-border":"#2C2216"
      },
      fontFamily: {
        haasRegular: ['var(--font-neue-haas-display-regular)', ...fontFamily.sans],
        haasLight: ['var(--font-neue-haas-display-light)', ...fontFamily.sans],
        haasMedium: ['var(--font-neue-haas-display-medium)', ...fontFamily.sans],
        haasBold: ['var(--font-neue-haas-display-bold)', ...fontFamily.sans],
        recklessRegular: ['var(--font-reckless-neue-regular)', ...fontFamily.sans],
        recklessLight: ['var(--font-reckless-neue-light)', ...fontFamily.sans],
        recklessMedium: ['var(--font-reckless-neue-medium)', ...fontFamily.sans],
        recklessBold: ['var(--font-reckless-neue-bold)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
