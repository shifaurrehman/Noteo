import { CategoryCard } from "@/components/category/CategoryCard";
import { useTheme } from "@/hooks/useTheme";
import { Category, Note } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createHomeScreenStyles } from "@/styles/home/HomeScreen.styles";
import responsive, { useResponsive } from "@/utilities/responsive";

interface CategoryListContentProps {
  categories: Category[];
  notes: Note[];
  isLoading: boolean;
  isConnected: boolean;
  onRefresh: () => void;
  onOpenNotes: (category: Category) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onFavoriteCategory: (category: Category) => void;
  activeMenuId: string | null;
  onToggleMenu: (id: string | null) => void;
}

export const CategoryListContent: React.FC<CategoryListContentProps> = React.memo(
  ({
    categories,
    notes,
    isLoading,
    isConnected,
    onRefresh,
    onOpenNotes,
    onEditCategory,
    onDeleteCategory,
    onFavoriteCategory,
    activeMenuId,
    onToggleMenu,
  }) => {
    const { deviceType } = useResponsive();
    const { colors } = useTheme();
    const [containerWidth, setContainerWidth] = React.useState(0);
    const styles = createHomeScreenStyles(colors);

    const { columns: numColumns, cardWidth, gap, sidePadding } = responsive.getGridLayout(
      containerWidth,
      deviceType
    );
    const cardHeight = cardWidth;

    const renderItem = useCallback(
      ({ item, index }: { item: Category; index: number }) => {
        const isLastInRow = (index + 1) % numColumns === 0;
        const noteCount = notes.filter((n) => n.categoryId === item.id && !n.isDeleted).length;

        return (
          <CategoryCard
            category={item}
            onPress={() => {
              onToggleMenu(null);
              onOpenNotes(item);
            }}
            onEdit={() => onEditCategory(item)}
            onDelete={() => onDeleteCategory(item.id)}
            onFavorite={() => onFavoriteCategory(item)}
            isMenuVisible={activeMenuId === item.id}
            onToggleMenu={() => onToggleMenu(activeMenuId === item.id ? null : item.id)}
            width={cardWidth}
            height={cardHeight}
            noteCount={noteCount}
            style={{
              marginRight: isLastInRow ? 0 : gap,
              marginBottom: gap,
            }}
          />
        );
      },
      [
        notes,
        numColumns,
        cardWidth,
        cardHeight,
        gap,
        activeMenuId,
        onToggleMenu,
        onOpenNotes,
        onEditCategory,
        onDeleteCategory,
        onFavoriteCategory,
      ]
    );

    const renderRefreshControl = useCallback(() => {
      if (!isConnected) return undefined;
      return (
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={colors.surface}
        />
      );
    }, [isLoading, colors.primary, colors.surface, isConnected, onRefresh]);

    const renderEmptyFlatListData = useCallback(() => {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No categories
          </Text>
        </View>
      );
    }, [styles.emptyContainer, styles.emptyText, colors.textSecondary]);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
        <View style={styles.container}>
          <FlatList
            data={categories}
            renderItem={renderItem}
            numColumns={numColumns}
            contentContainerStyle={{
              paddingHorizontal: sidePadding,
              paddingBottom: gap,
            }}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyFlatListData()}
            refreshControl={renderRefreshControl()}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setContainerWidth(width);
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
);

CategoryListContent.displayName = "CategoryListContent";
