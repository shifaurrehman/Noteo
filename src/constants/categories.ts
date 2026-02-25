import { isWeb } from "@/utilities/global";
import { Dimensions } from "react-native";
export const EmptyCategoryText = {
  noFound: "No categories found",
  noFavorites: "No favorite categories yet.",
  noCategories: "No categories yet. Tap + to add one",
};

const { width } = Dimensions.get("window");
export const CARD_MARGIN = 10;
// default mobile columns
let numColumns = 2;

// adjust columns for web based on width
if (isWeb) {
  if (width > 1200) numColumns = 4;
  else if (width > 900) numColumns = 3;
  else numColumns = 2;
}

export const NUM_COLUMNS = numColumns;
export const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS * 2 + 1)) / NUM_COLUMNS;
export const CARD_HEIGHT = CARD_WIDTH;
