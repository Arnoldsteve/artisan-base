/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Use the new package name here
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;