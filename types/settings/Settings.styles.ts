import { StyleSheet } from "react-native";

export const createSettingsScreenStyles = (colors: {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      marginLeft: 6
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingInfo: {
      flex: 1,
      marginRight: 12,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: colors.border,
    },
    themeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    themeOptionText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    icon: {
      marginRight: 8,
    },
    footer: {
      // padding: 20,
      alignItems: "center",
      marginBottom: 35,
    },
    footerText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
