if (__DEV__) {
  require("../../ReactotronConfig");
}

import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
