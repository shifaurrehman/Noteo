import { useColorScheme } from "react-native";
import { useAppSelector } from "../store/hooks";
import { selectTheme } from "../store/selectors";
import { theme, ThemeColors } from "../theme/colors";

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppSelector(selectTheme);

  const activeTheme =
    themeMode === "system" ? systemColorScheme || "light" : themeMode;
  
  const isDark = activeTheme === "dark";
  const colors: ThemeColors = isDark ? theme.dark.colors : theme.light.colors;

  return {
    colors,
    isDark,
    theme: activeTheme,
    mode: themeMode,
  };
};
