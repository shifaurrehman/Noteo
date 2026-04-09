import { WebSidebar } from "@/components/web/WebSidebar";
import { logout } from "@/store/slices/authSlice";
import { setNetworkState } from "@/store/slices/networkSlice";
import { store } from "@/store/store";
import { authEvents, FORCE_LOGOUT_EVENT } from "@/utilities/events";
import { isWeb } from "@/utilities/global";
import NetInfo from '@react-native-community/netinfo';
import {  Stack } from "expo-router";
import React, { useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import { useDispatch } from "react-redux";

export default function AppLayout() {
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
        <View style={{ flex: 1, flexDirection: isWeb ? "row" : "column" }}>
            {showSideBar && <WebSidebar categories={[]} selectedCategory={null} onSelectCategory={() => { }} />}
            <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="notes" options={{ headerShown: false }} />
                </Stack>
            </View>
        </View>
    );
}
