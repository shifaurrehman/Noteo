import { SettingsButton } from "@/components/button/SettingsButton";
import { Header } from "@/components/header/Header";
import { getCurrentYear } from "@/constants/dateTime";
import { logout } from "@/store/slices/authSlice";
import { createSettingsScreenStyles } from "@/styles/settings/Settings.styles";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@/utilities/routes/Routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, updateSettings } from "@/store/slices/themeSlice";
import { selectColors, selectTheme, selectThemeSettings } from "@/store/selectors";


export default function SettingsScreen() {
  const { redirectLogin } = useNavigation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const settings = useAppSelector(selectThemeSettings);
  const colors = useAppSelector(selectColors);
  const styles = createSettingsScreenStyles(colors);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    dispatch(setTheme(newTheme));
  };

  const handleSettingsUpdate = (newSettings: Partial<typeof settings>) => {
    dispatch(updateSettings(newSettings));
  };
  const handleLogout = async () => {
    dispatch(logout());
    redirectLogin();
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <Header title="Settings" showSettings={false} onBack={() => router.back()} />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Theme Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <SettingsButton
              title="Light Mode"
              leftIcon="sunny-outline"
              rightIcon={theme === "light" ? "checkmark-circle" : undefined}
              active={theme === "light"}
              onPress={() => handleThemeChange("light")}
              colors={colors}
            />
            <SettingsButton
              title="Dark Mode"
              leftIcon="moon-outline"
              rightIcon={theme === "dark" ? "checkmark-circle" : undefined}
              active={theme === "dark"}
              onPress={() => handleThemeChange("dark")}
              colors={colors}
            />
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <SettingsButton
              title="Notifications"
              description="Receive alerts and reminders"
              switchValue={settings.notifications ?? true}
              onSwitchChange={(value) => handleSettingsUpdate({ notifications: value })}
              colors={colors}
            />
          </View>

          {/* Additional Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>App Version</Text>
                <Text style={styles.settingDescription}>1.0.0</Text>
              </View>
            </View>
            <SettingsButton
              title="Help & Support"
              description="Get help or report an issue"
              rightIcon="chevron-forward"
              onPress={() => {
                /* navigate */
              }}
              colors={colors}
            />

            <SettingsButton
              title="Privacy Policy"
              description="Learn how we handle your data"
              rightIcon="chevron-forward"
              onPress={() => {
                /* navigate */
              }}
              colors={colors}
            />
            <SettingsButton
              title="Logout"
              rightIcon="log-out-outline"
              onPress={handleLogout}
              colors={colors}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>AI Note Taker</Text>
            <Text style={styles.footerText}>© {getCurrentYear()} All rights reserved</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
