export const palette = {
  light: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    primary: "#6366F1",
    textMain: "#0F172A",
    textSecondary: "#64748B",
    border: "#E2E8F0",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    shadow: "rgba(0, 0, 0, 0.05)",
    iconBg: "rgba(0, 0, 0, 0.05)",
    iconBgPressed: "rgba(0, 0, 0, 0.1)",
    disabled: "#CBD5E1",
    lableText:"#F1F5F9",
    // New Settings UI Colors - Aligned with Design System
    settingsIcon:"#6467F2",
    settingsBorder: "#334155",
    accentBlue: "#818CF8",
    accentPurple: "#818CF8", // Using brand primary for icons
    danger: "#f13838ff",
  },
  dark: {
    background: "#101122",
    surface: "rgba(100, 103, 242, 0.05)",
    primary: "#818CF8",
    textMain: "#F1F5F9",
    textSecondary: "#94A3B8",
    border: "#334155",
    error: "#F87171",
    success: "#34D399",
    warning: "#FBBF24",
    shadow: "rgba(0, 0, 0, 0.3)",
    iconBg: "rgba(255, 255, 255, 0.08)",
    iconBgPressed: "rgba(255, 255, 255, 0.15)",
    disabled: "#475569",
    lableText:"#F1F5F9",
    // New Settings UI Colors - Aligned with Design System
    settingsIcon:"#6467F2",
    settingsBorder: "#334155",
    accentBlue: "#818CF8",
    accentPurple: "#818CF8", // Using brand primary for icons
    danger: "#f13838ff",
  },
};

export const theme = {
  light: {
    colors: {
      ...palette.light,
      primaryPressed: "#4F46E5",
      headerBg: palette.light.surface,
      cardBg: palette.light.surface,
      favoriteNote: "#F59E0B",
      ...palette.light,
    },
  },
  dark: {
    colors: {
      ...palette.dark,
      primaryPressed: "#6366F1",
      headerBg: palette.dark.surface,
      cardBg: palette.dark.surface,
      favoriteNote: "#FBBF24",
      ...palette.dark,
    },
  },
};

export type ThemeColors = typeof theme.light.colors;
