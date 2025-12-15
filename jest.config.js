module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  testMatch: [
    "<rootDir>/tests/**/*.(spec|test).(js|jsx)",
    "<rootDir>/**/?(*.)+(spec|test).(js|jsx)",
  ],
  moduleNameMapper: {
    "\\.(css|png|jpg|gif|svg)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/index.jsx"],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov"],
  transformIgnorePatterns: ["/node_modules/"],
};
