module.exports = {
    preset: "jest-expo",
    setupFilesAfterEnv: ["./jest.setup.js"],
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@reduxjs/.*|immer|uuid|react-redux)",
    ],
    collectCoverage: false,
    collectCoverageFrom: [
        "**/*.{js,jsx,ts,tsx}",
        "!**/node_modules/**",
        "!**/babel.config.js",
        "!**/jest.setup.js",
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
};
