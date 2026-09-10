import { renderHook } from "@testing-library/react-native";
import { useAuth } from "../../useAuth";
import { Provider } from "react-redux";
import { createMockStore } from "@/testing/utils/renderWithProviders";
import React from "react";

describe("useAuth", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const store = createMockStore();
    return <Provider store={store}>{children}</Provider>;
  };

  it("should return initial auth state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("should return loading state from store", () => {
    const preloadedState = {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true,
        error: null,
      },
    } as any;

    const wrapperWithState = ({ children }: { children: React.ReactNode }) => {
      const store = createMockStore(preloadedState);
      return <Provider store={store}>{children}</Provider>;
    };

    const { result } = renderHook(() => useAuth(), { wrapper: wrapperWithState });
    expect(result.current.loading).toBe(true);
  });
});
