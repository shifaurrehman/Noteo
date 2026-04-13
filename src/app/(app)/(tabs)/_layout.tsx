import { NetworkStatusBar } from "@/components/network/networkBar";
import { useTheme } from "@/hooks/useTheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

const CategoriesIcon = ({ color }: { color: string }) => (
  <FontAwesome size={28} name="folder" color={color} />
);

const NotesIcon = ({ color }: { color: string }) => (
  <FontAwesome size={28} name="file-text" color={color} />
);

const SettingsIcon = ({ color }: { color: string }) => (
  <FontAwesome size={28} name="cog" color={color} />
);

export default function TabLayout() {
  const { colors } = useTheme();

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
            title: "Categories",
            tabBarIcon: CategoriesIcon,
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: "Notes",
            tabBarIcon: NotesIcon,
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
