if (__DEV__) {
  require("../../ReactotronConfig");
}

import { logout } from "@/store/slices/authSlice";
import { setNetworkState } from "@/store/slices/networkSlice";
import { authEvents, FORCE_LOGOUT_EVENT } from "@/utilities/events";
import { isWeb } from "@/utilities/global";
import NetInfo from '@react-native-community/netinfo';
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";
import { WebSidebar } from "@/components/web/WebSidebar";

function AppContent() {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const showSideBar = isWeb && width >= 768;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setNetworkState(!!state.isConnected));
    });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const onLogout = () => {
      store.dispatch(logout());
    };
    authEvents.on(FORCE_LOGOUT_EVENT, onLogout);
    return () => {
      authEvents.off(FORCE_LOGOUT_EVENT, onLogout);
    }
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: isWeb ? "row" : "column" }}>
        {showSideBar && <WebSidebar categories={[]} selectedCategory={null} onSelectCategory={() => { }} />}
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </View>
      <Toast />
    </SafeAreaProvider>
  );
}

// 2. The Main RootLayout only provides the Redux context
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
