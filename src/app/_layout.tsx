import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { persistor, store } from "../store/store";
import { useTheme } from "@/hooks/useTheme";
import "../../ReactotronConfig";

function ThemeWrapper({ children }: { readonly children: React.ReactNode }) {
  const { isDark } = useTheme();
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeWrapper>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <SafeAreaProvider style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }} />
                <Toast />
              </SafeAreaProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeWrapper>
      </PersistGate>
    </Provider>
  );
}
