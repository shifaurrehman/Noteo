import "@testing-library/jest-native/extend-expect";
import "./setupEnv";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock NetInfo for Offline-First testing
export const mockNetInfo = {
  addEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
  useNetInfo: jest.fn(() => ({ isConnected: true, isInternetReachable: true })),
};
jest.mock("@react-native-community/netinfo", () => mockNetInfo);

// Mock Reanimated
global.ReanimatedDataProxy = (next: any) => next;
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Redux Persist
jest.mock("redux-persist", () => {
  const real = jest.requireActual("redux-persist");
  return {
    ...real,
    persistReducer: jest.fn().mockImplementation((config, reducer) => reducer),
    persistStore: jest.fn().mockReturnValue({
      pause: jest.fn(),
      resume: jest.fn(),
      updateEntity: jest.fn(),
      persist: jest.fn(),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(),
      replaceReducer: jest.fn(),
      flush: jest.fn(),
      purge: jest.fn(),
    }),
  };
});

// Mock Expo Modules
jest.mock("expo-constants", () => ({
  expoConfig: { extra: { apiUrl: "https://api.example.com" } },
  manifest: {},
}));

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("expo-file-system", () => ({
  downloadAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  documentDirectory: "file:///mock-directory/",
}));

// Mock Expo Router & Navigation
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  setParams: jest.fn(),
  canGoBack: jest.fn(() => true),
};

jest.mock("expo-router", () => ({
  router: mockRouter,
  useLocalSearchParams: jest.fn(() => ({})),
  useGlobalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => "/"),
  Link: "Link",
  Stack: "Stack",
  Tabs: "Tabs",
}));

// Mock Gesture Handler
jest.mock("react-native-gesture-handler", () => {
  const ReactNative = require("react-native");
  return {
    ...ReactNative.NativeModules,
    GestureHandlerRootView: ReactNative.View,
    State: {},
    PanGestureHandler: ReactNative.View,
    BaseButton: ReactNative.View,
    RectButton: ReactNative.View,
    TapGestureHandler: ReactNative.View,
    DrawerLayout: ReactNative.View,
    ScrollView: ReactNative.ScrollView,
    FlatList: ReactNative.FlatList,
    TextInput: ReactNative.TextInput,
    Switch: ReactNative.Switch,
    NativeViewGestureHandler: ReactNative.View,
    createNativeWrapper: jest.fn(),
    Directions: {},
  };
});

// Mock Lottie
jest.mock("lottie-react-native", () => "LottieView");


// Silence specific warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("defaultProps") ||
      args[0].includes("React.createFactory") ||
      args[0].includes("Warning: An update to %s inside a test was not wrapped in act"))
  ) {
    return;
  }
  originalConsoleError(...args);
};
