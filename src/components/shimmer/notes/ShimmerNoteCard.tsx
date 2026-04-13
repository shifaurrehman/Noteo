import React from "react";
import { View, StyleSheet } from "react-native";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks/useTheme";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export const ShimmerNoteCard = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      width: "100%",
      height: 170,
      backgroundColor: colors.cardBg,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },

    shimmerTitle: {
      width: "70%",
      height: 22,
      borderRadius: 12,
    },

    shimmerDelete: {
      width: 28,
      height: 28,
      borderRadius: 50,
      marginBottom: 8,
    },

    shimmerContent: {
      width: "100%",
      height: 12,
      borderRadius: 20,
      marginBottom: 8,
    },

    dateRow: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 6,
    },

    shimmerDateItem: {
      width: "30%",
      height: 20,
      borderRadius: 18,
    },
  });

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        {/* Title Shimmer */}
        <ShimmerPlaceholder style={styles.shimmerTitle} />

        {/* Delete Button Shimmer */}
        <ShimmerPlaceholder style={styles.shimmerDelete} />
      </View>

      {/* 4 Lines of Content */}
      <ShimmerPlaceholder style={styles.shimmerContent} />
      <ShimmerPlaceholder style={styles.shimmerContent} />
      <ShimmerPlaceholder style={styles.shimmerContent} />
      <ShimmerPlaceholder style={styles.shimmerContent} />

      {/* Date Container */}
      <View style={styles.dateRow}>
        <ShimmerPlaceholder style={styles.shimmerDateItem} />
        <ShimmerPlaceholder style={styles.shimmerDateItem} />
      </View>
    </View>
  );
};
