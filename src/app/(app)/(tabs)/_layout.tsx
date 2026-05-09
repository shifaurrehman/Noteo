import { NetworkStatusBar } from "@/components/network/networkBar";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Ensuring enough clearance for Android navigation buttons
  const bottomPadding = Math.max(insets.bottom, 20);
  const totalHeight = 64 + bottomPadding;

  return (
    <View style={[
      styles.tabBarContainer,
      {
        backgroundColor: colors.background,
        borderTopColor: colors.border,
        height: totalHeight,
        paddingBottom: bottomPadding,
      }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = () => {
          switch (route.name) {
            case 'home': return 'grid';
            case 'favorites': return 'document-text';
            case 'settings': return 'settings';
            default: return 'square';
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.9}
            style={styles.tabItem}
          >
            {/* {isFocused && (
              <View style={[styles.hump, { backgroundColor: colors.background, borderColor: colors.border }]} />
            )} */}

            <View style={[styles.iconWrapper, isFocused && styles.activeIconWrapper]}>
              <Ionicons
                name={isFocused ? iconName() as any : `${iconName()}-outline` as any}
                size={24}
                color={isFocused ? colors.primary : colors.textSecondary}
              />
            </View>

            <Text style={[
              styles.tabLabel,
              { color: isFocused ? colors.primary : colors.textSecondary }
            ]}>
              {options.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <>
      <NetworkStatusBar />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{ title: "Categories" }}
        />
        <Tabs.Screen
          name="favorites"
          options={{ title: "Notes" }}
        />
        <Tabs.Screen
          name="settings"
          options={{ title: "Settings" }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    position: 'relative',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  hump: {
    position: 'absolute',
    top: -39,
    width: 58,
    height: 28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderBottomWidth: 0,
    zIndex: 0,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    zIndex: 2,
  },
  activeIconWrapper: {
    marginTop: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
    zIndex: 2,
  },
});
