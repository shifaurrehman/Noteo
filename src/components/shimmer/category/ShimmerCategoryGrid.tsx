import React from "react";
import { View, Dimensions, ScrollView } from "react-native";
import { ShimmerCategoryCard } from "./ShimmerCategoryCard";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 10;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS * 2 + 2)) / NUM_COLUMNS;
const CARD_HEIGHT = CARD_WIDTH;

export const ShimmerCategoryGrid = () => {
  const placeholders = Array.from({ length: 8 });

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: 10,
        }}
      >
        {placeholders.map((_, index) => (
          <ShimmerCategoryCard key={index} width={CARD_WIDTH} height={CARD_HEIGHT} />
        ))}
      </View>
    </ScrollView>
  );
};
