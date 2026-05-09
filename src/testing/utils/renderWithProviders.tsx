import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import authReducer from "@/store/slices/authSlice";
import categoriesReducer from "@/store/slices/categoriesSlice";
import networkReducer from "@/store/slices/networkSlice";
import notesReducer from "@/store/slices/notesSlice";
import settingsReducer from "@/store/slices/settingsSlice";
import { RootState } from "@/store/store";

export function createMockStore(preloadedState?: PreloadedState<RootState>) {
  const appReducer = combineReducers({
    categories: categoriesReducer,
    notes: notesReducer,
    settings: settingsReducer,
    auth: authReducer,
    network: networkReducer,
  });

  return configureStore({
    reducer: appReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
}

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: ReturnType<typeof createMockStore>;
}

function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {} as any,
    store = createMockStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { readonly children: React.ReactNode }): ReactElement {
    return (
      <Provider store={store}>
        <ThemeProvider value={DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <SafeAreaProvider
                initialMetrics={{
                  frame: { x: 0, y: 0, width: 0, height: 0 },
                  insets: { top: 0, left: 0, right: 0, bottom: 0 },
                }}
              >
                {children}
              </SafeAreaProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from "@testing-library/react-native";
export { renderWithProviders };
