import { StyleSheet } from "react-native";
export const createHomeScreenStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingVertical: 16,
    },
    flashListWrapper: {
      flex: 1,
      width: "100%",
    },
    listContainer: {
      paddingBottom: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 100,
    },
    emptyText: {
      fontSize: 16,
      textAlign: "center",
    },
  });
