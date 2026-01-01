import React from "react";
import { FlatList, View, Text, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CategoryCard } from "./CategoryCard";
import { Category } from "@/types/category";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 10;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS * 2 + 2)) / NUM_COLUMNS;
const CARD_HEIGHT = CARD_WIDTH;

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onFavorite: (category: Category) => void;
  onPress: (category: Category) => void;
  colors: any;
  emptyText?: string;
}

export const CategoryGrid: React.FC<Props> = ({
  categories,
  onEdit,
  onDelete,
  onFavorite,
  onPress,
  colors,
  emptyText,
}) => {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const renderItem = ({ item }: { item: Category }) => (
    <CategoryCard
      category={item}
      onPress={() => {
        setActiveMenuId(null);
        onPress(item);
      }}
      onEdit={() => onEdit(item)}
      onDelete={() => onDelete(item.id)}
      onFavorite={() => onFavorite(item)}
      isMenuVisible={activeMenuId === item.id}
      onToggleMenu={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
    />
  );

  const renderEmptyFlatListData = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="folder-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{emptyText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.flatListWrapper}>
      <FlatList
        contentContainerStyle={[
          styles.listContainer,
          categories.length > 1 && { flexGrow: 1 },
        ]}
        data={categories}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        numColumns={NUM_COLUMNS}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyFlatListData}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "flex-start" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatListWrapper: {
    flex: 1,
    width: "100%",
    justifyContent:"center",
    alignItems:"center",
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
