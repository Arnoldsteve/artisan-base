import uiConfig from "@repo/ui/tailwind.config";

/** @type {import('tailwindcss').Config} */
const config = {
  // 1. Spread the config to inherit everything
  ...uiConfig,

  // 2. Override the content to scan BOTH packages
  content: [
    ...uiConfig.content, // Scans the UI package
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Scans the dashboard
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;