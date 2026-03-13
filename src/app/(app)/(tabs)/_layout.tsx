import { NetworkStatusBar } from "@/components/network/networkBar";
import { useAppSelector } from "@/store/hooks";
import { selectColors } from "@/store/selectors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

const HomeIcon = ({ color }: { color: string }) => (
  <FontAwesome size={28} name="home" color={color} />
);

const HeartIcon = ({ color }: { color: string }) => (
  <FontAwesome size={28} name="heart" color={color} />
);

const SettingsIcon = ({ color }: { color: string }) => (
  <FontAwesome size={28} name="cog" color={color} />
);

export default function TabLayout() {
  const colors = useAppSelector(selectColors);

  return (
    <>
      <NetworkStatusBar />
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
            tabBarIcon: HomeIcon,
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            tabBarIcon: HeartIcon,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: SettingsIcon,
          }}
        />
      </Tabs>
    </>
  );
}
