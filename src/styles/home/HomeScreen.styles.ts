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
    guestBanner: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary + "10",
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 12,
      marginBottom: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    guestBannerTextContainer: {
      flex: 1,
      marginLeft: 12,
      marginRight: 8,
    },
    guestBannerText: {
      color: colors.textMain,
      fontSize: 14,
      fontWeight: "500",
    },
  });
