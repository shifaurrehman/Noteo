import { act, waitFor } from "@testing-library/react-native";

/**
 * Flushes the microtasks queue by awaiting a resolved promise.
 * Useful for ensuring all pending async operations (not controlled by timers) have completed.
 */
export const flushMicrotasksQueue = () => new Promise((resolve) => setImmediate(resolve));

/**
 * Simulates a network delay or specific wait period.
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper to wait for a condition to be met, with optional timeout.
 */
export const waitForAsync = async (callback: () => void | Promise<void>, timeout = 1000) => {
  await waitFor(callback, { timeout });
};

/**
 * Simulates switching from Online to Offline mode in tests.
 * @param isConnected - Boolean representing connection state
 */
export const setNetworkState = (isConnected: boolean) => {
  const { mockNetInfo } = require("../setup/setupTests");
  mockNetInfo.fetch.mockResolvedValue({ isConnected, isInternetReachable: isConnected });
  mockNetInfo.useNetInfo.mockReturnValue({ isConnected, isInternetReachable: isConnected });
};
