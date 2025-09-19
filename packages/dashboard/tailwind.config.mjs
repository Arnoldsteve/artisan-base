import uiConfig from "@repo/ui/tailwind.config";

/** @type {import('tailwindcss').Config} */
const config = {
  // Use the preset from the UI package to get the theme, plugins, etc.
  presets: [uiConfig],

  // This is the critical fix. We explicitly tell Tailwind to scan
  // both the local dashboard files AND the shared UI package's source files.
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',

    // Path to the shared UI package, relative from this config file.
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;