import "@testing-library/jest-native/extend-expect";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock NetInfo
jest.mock("@react-native-community/netinfo", () => ({
    addEventListener: jest.fn(),
    fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
    useNetInfo: jest.fn(() => ({ isConnected: true, isInternetReachable: true })),
}));

// Mock Reanimated
global.ReanimatedDataProxy = (next) => next;
jest.mock("react-native-reanimated", () => {
    const Reanimated = require("react-native-reanimated/mock");
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock Redux Persist
jest.mock("redux-persist", () => {
    const real = jest.requireActual("redux-persist");
    return {
        ...real,
        persistReducer: jest.fn().mockImplementation((config, reducer) => reducer),
    };
});

// 🔴 REQUIRED for Expo SDK 54+
// Prevent Expo winter runtime from loading in Jest
jest.mock("expo", () => ({
    ...jest.requireActual("expo"),
}));

jest.mock("expo-constants", () => ({
    expoConfig: {},
    manifest: {},
}));

