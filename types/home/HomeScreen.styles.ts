import { StyleSheet } from "react-native";
export const createHomeScreenStyles = (colors: {
  background: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  });
