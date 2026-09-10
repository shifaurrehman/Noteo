import { logout } from "@/store/slices/authSlice";
import React, { useState, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, updateSettings } from "@/store/slices/settingsSlice";
import { selectSettings, selectIsAuthenticated, selectUser } from "@/store/selectors";
import { useTheme } from "@/hooks/useTheme";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { SettingItem } from "@/components/settings/SettingItem";
import { MainHeader } from "@/components/header/MainHeader";
import { SelectionBottomSheet } from "@/components/modal/SelectionBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ConfirmationBottomSheet } from "@/components/modal/ConfirmationBottomSheet";

type SelectionType = "theme" | "fontSize" | "gridDensity";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  console.log("settings", JSON.stringify(settings, null, 2));
   const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  console.log("DEBUG: isAuthenticated:", isAuthenticated);
  console.log("DEBUG: userEmail:", user?.email);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const deleteSheetRef = useRef<BottomSheetModal>(null);
  const [selectionType, setSelectionType] = useState<SelectionType>("theme");

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    dispatch(setTheme(newTheme));
  };

  const handleSettingsUpdate = (newSettings: Partial<typeof settings>) => {
    dispatch(updateSettings(newSettings));
  };

  const handleLogout = async () => {
    dispatch(logout());
  };

  const openSelectionSheet = (type: SelectionType) => {
    setSelectionType(type);
    bottomSheetRef.current?.present();
  };

  const handleSelectOption = (value: string) => {
    if (selectionType === "theme") {
      handleThemeChange(value as any);
    } else if (selectionType === "fontSize") {
      handleSettingsUpdate({ fontSize: value as any });
    } else if (selectionType === "gridDensity") {
      handleSettingsUpdate({ gridDensity: value as any });
    }
  };

  const themeOptions = [
    { id: "light", label: "Light", icon: "sunny-outline" as const },
    { id: "dark", label: "Dark", icon: "moon-outline" as const },
    { id: "system", label: "System Default", icon: "settings-outline" as const },
  ];

  const fontSizeOptions = [
    { id: "small", label: "Small", icon: "text-outline" as const },
    { id: "medium", label: "Medium", icon: "text-outline" as const },
    { id: "large", label: "Large", icon: "text-outline" as const },
  ];

  const gridDensityOptions = [
    { id: "comfortable", label: "Comfortable", icon: "grid-outline" as const },
    { id: "compact", label: "Compact", icon: "apps-outline" as const },
  ];

  const getCurrentOptions = () => {
    switch (selectionType) {
      case "theme": return themeOptions;
      case "fontSize": return fontSizeOptions;
      case "gridDensity": return gridDensityOptions;
      default: return [];
    }
  };

  const getCurrentValue = () => {
    switch (selectionType) {
      case "theme": return settings.theme;
      case "fontSize": return settings.fontSize || "medium";
      case "gridDensity": return settings.gridDensity || "comfortable";
      default: return "";
    }
  };

  const getTitle = () => {
    switch (selectionType) {
      case "theme": return "Select Theme";
      case "fontSize": return "Select Font Size";
      case "gridDensity": return "Select Grid Density";
      default: return "";
    }
  };

  const getDescription = () => {
    switch (selectionType) {
      case "theme": return "Choose how AI Notes looks on your device";
      case "fontSize": return "Choose the font size for your editor";
      case "gridDensity": return "Choose how much content you see at once";
      default: return "";
    }
  };

  const getSyncStatusDisplay = () => {
    switch (settings.syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync Failed';
      case 'synced':
      default:
        return 'Synced';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <MainHeader title="Settings" showBorder />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <SettingGroup title="Appearance" colors={colors}>
          <SettingItem
            title="Theme"
            leftIcon="color-palette"
            value={settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}
            onPress={() => openSelectionSheet("theme")}
            colors={colors}
          />
          <SettingItem
            title="Font Size"
            leftIcon="text"
            value={settings.fontSize ? settings.fontSize.charAt(0).toUpperCase() + settings.fontSize.slice(1) : "Medium"}
            onPress={() => openSelectionSheet("fontSize")}
            colors={colors}
          />
          <SettingItem
            title="Grid Density"
            leftIcon="grid"
            value={settings.gridDensity === 'comfortable' ? 'Comfortable' : 'Compact'}
            onPress={() => openSelectionSheet("gridDensity")}
            colors={colors}
          />
        </SettingGroup>

        <SettingGroup title="Account" colors={colors}>
          {!isAuthenticated && (
            <SettingItem
              title="Login"
              leftIcon="log-in-outline"
              onPress={() => router.push("/(auth)/login")}
              colors={colors}
            />
          )}
          {!isAuthenticated && (
            <SettingItem
              title="Create Account"
              leftIcon="person-add-outline"
              onPress={() => router.push("/(auth)/register")}
              colors={colors}
            />
          )}

          {isAuthenticated && (
            <SettingItem
              title="Email"
              leftIcon="mail-outline"
              value={user?.email}
              colors={colors}
            />
          )}
          {isAuthenticated && (
            <SettingItem
              title="Backup & Restore"
              leftIcon="cloud-upload-outline"
              switchValue={settings.backupEnabled}
              onSwitchChange={(value) => handleSettingsUpdate({ backupEnabled: value })}
              colors={colors}
            />
          )}
          {isAuthenticated && settings.backupEnabled && (
            <SettingItem
              title="Sync Status"
              leftIcon="sync-outline"
              value={getSyncStatusDisplay()}
              colors={colors}
            />
          )}
          {isAuthenticated && (
            <SettingItem
              title="Logout"
              leftIcon="log-out-outline"
              onPress={handleLogout}
              colors={colors}
            />
          )}
          {isAuthenticated && (
            <SettingItem
              title="Delete Account"
              leftIcon="trash-outline"
              danger
              onPress={() => deleteSheetRef.current?.present()}
              colors={colors}
            />
          )}
        </SettingGroup>

        {/* About Section */}
        <SettingGroup title="About" colors={colors}>
          <SettingItem
            title="Version"
            leftIcon="information-circle-outline"
            value="v2.4.0-stable"
            colors={colors}
          />
          <SettingItem
            title="Terms of Service"
            leftIcon="document-text-outline"
            onPress={() => router.push("/terms")}
            colors={colors}
            rightIcon="open-outline"
          />
        </SettingGroup>
        <View style={{ height: 20 }} />
      </ScrollView>

      <ConfirmationBottomSheet
        ref={deleteSheetRef}
        title="Delete Account"
        message="Your account will be permanently deleted after 30 days if you do not recover it."
        confirmText="Permanently Delete"
        onConfirm={() => {
          // Add deletion logic here
          console.log("Account deletion confirmed");
        }}
        colors={colors}
        type="danger"
      />

      <SelectionBottomSheet
        ref={bottomSheetRef}
        title={getTitle()}
        description={getDescription()}
        options={getCurrentOptions()}
        selectedValue={getCurrentValue()}
        onSelect={handleSelectOption}
        colors={colors}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: "left",
    paddingHorizontal: 4,
    marginBottom: 40,
  }
});


