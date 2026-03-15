import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { persistor, store } from "../store/store";
import "../../ReactotronConfig";


export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <SafeAreaProvider style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }} />
              <Toast />
            </SafeAreaProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
