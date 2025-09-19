module.exports = {
  rootDir: ".",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/__tests__/**/*.test.(ts|tsx|js)"],
  moduleNameMapper: {
    "^@/(.*)$": [
      "<rootDir>/src/$1",
      "<rootDir>/../../../../Personal Work/artisan-base/packages/ui/src/$1",
    ],
    "^@repo/ui$":
      "<rootDir>/../../../../Personal Work/artisan-base/packages/ui/src/index.ts",
    "^@repo/ui/(.*)$":
      "<rootDir>/../../../../Personal Work/artisan-base/packages/ui/src/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!(\@repo/ui|@repo/.+?)/)"],
};
