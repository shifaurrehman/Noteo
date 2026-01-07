import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";
import { useEffect } from "react";
import NetInfo from '@react-native-community/netinfo';
import { setNetworkState } from "@/store/slices/networkSlice";

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setNetworkState(!!state.isConnected));
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Slot />
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
