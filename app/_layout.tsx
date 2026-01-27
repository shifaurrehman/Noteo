import { logout } from "@/store/slices/authSlice";
import { authEvents, FORCE_LOGOUT_EVENT } from "@/utilities/events";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";
import React, { useEffect } from "react";
import NetInfo from '@react-native-community/netinfo';
import { setNetworkState } from "@/store/slices/networkSlice";
import Toast from "react-native-toast-message";

function AppContent() {
  const dispatch = useDispatch();

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
      <Stack screenOptions={{ headerShown: false }} />
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
