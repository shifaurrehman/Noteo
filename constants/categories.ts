import { Dimensions } from "react-native";
export const EmptyCategoryText = {
  noFound: "No categories found",
  noFavorites: "No favorite categories yet.",
  noCategories: "No categories yet. Tap + to add one",
};

const { width } = Dimensions.get("window");
export const CARD_MARGIN = 10;
export const NUM_COLUMNS = 2;
export const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS * 2 + 1)) / NUM_COLUMNS;
export const CARD_HEIGHT = CARD_WIDTH;
