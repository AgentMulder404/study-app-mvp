import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // This tells Tailwind to scan all files inside your `app` directory
    // and your `components` directory for class names.
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;