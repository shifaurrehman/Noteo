import { useColorScheme } from "react-native";
import { useAppSelector } from "../store/hooks";
import { selectTheme, selectThemeSettings } from "../store/selectors";
import { theme, ThemeColors, getScaledTypography } from "../theme";

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppSelector(selectTheme);
  const settings = useAppSelector(selectThemeSettings);

  const activeTheme =
    themeMode === "system" ? systemColorScheme || "light" : themeMode;
  
  const isDark = activeTheme === "dark";
  const colors: ThemeColors = isDark ? theme.dark.colors : theme.light.colors;

  const typography = getScaledTypography(settings.fontSize || 'medium');

  return {
    colors,
    typography,
    isDark,
    theme: activeTheme,
    mode: themeMode,
  };
};
