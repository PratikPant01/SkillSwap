import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#3fbaeb",
          DEFAULT: "#0fa9e6",
          dark: "#0c87b8",
          gapple: "#10bd81",
        },
      },
    },
  },
  plugins: [],
};

export default config;