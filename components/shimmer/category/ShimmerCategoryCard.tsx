import React from "react";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const Shimmer = createShimmerPlaceholder(LinearGradient);

export const ShimmerCategoryCard = ({ width, height }: { width: number; height: number }) => {
  return (
    <Shimmer
      style={{
        width: width || 150,
        height: height || 150,
        borderRadius: 16,
        margin: 8,
      }}
    />
  );
};
