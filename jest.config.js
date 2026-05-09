module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/src/testing/setup/setupTests.ts"],
  testEnvironment: "node",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@reduxjs/.*|immer|uuid|react-redux|redux-persist|@gorhom/.*)",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/types.ts",
    "!src/testing/**",
    "!src/assets/**",
    "!src/styles/**",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 0.1,
      functions: 0.1,
      lines: 0.1,
      statements: 0.1,
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/testing/mocks/fileMock.ts",
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  verbose: false, // Set to false for cleaner output in large suites
  maxWorkers: "50%", // Optimize resource usage
};
