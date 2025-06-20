module.exports = {
  extends: ["next", "turbo", "plugin:react/recommended", "prettier"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
};