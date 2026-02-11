import { NetworkStatusBar } from "@/components/network/networkBar";
import { useAppSelector } from "@/store/hooks";
import { selectColors, selectIsAuthenticated } from "@/store/selectors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";

export default function TabLayout() {
  const colors = useAppSelector(selectColors);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/auth/Login" />;
  }

  return (
    <>
    <NetworkStatusBar/>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="heart" color={color} />
          ),
        }}
      />
    </Tabs>
    </>
  );
}
