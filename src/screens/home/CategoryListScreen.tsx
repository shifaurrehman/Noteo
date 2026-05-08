import { CategoryCard } from "@/components/category/CategoryCard";
import { AddCategoryBottomSheet } from "@/components/category/AddCategoryBottomSheet";
import { ConfirmationBottomSheet } from "@/components/modal/ConfirmationBottomSheet";
import { EmptyCategoryText } from "@/constants/categories";
import { useNavigation } from "@/utilities/routes/Routes";
import { useCategoriesList } from "@/hooks/useCategoriesList";
import { useTheme } from "@/hooks/useTheme";
import { Category } from "@/types/category/category.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonStyles } from "@/styles/global";
import { createHomeScreenStyles } from "@/styles/home/HomeScreen.styles";
import responsive, { useResponsive } from "@/utilities/responsive";
import { IconPressable } from "@/components/button/IconPressable";

interface CategoryListScreenProps {
  favoritesOnly: boolean;
  showAddButton?: boolean;
}

const CategoryListScreen: React.FC<CategoryListScreenProps> = ({
  favoritesOnly,
  showAddButton = true,
}) => {
  const { viewCategoryNotes, openSearch } = useNavigation();
  const { deviceType } = useResponsive();
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = React.useState(0);
  const styles = createHomeScreenStyles(colors);

  const {
    categories,
    notes,
    isLoading,
    isConnected,
    editCategory,
    showAddModal,
    categoryToDelete,
    activeMenuId,
    setActiveMenuId,
    bottomSheetRef,
    deleteSheetRef,
    handleAddCategory,
    handleEditCategory,
    handleSaveEditedCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
    handleFavoriteCategory,
    handleCloseModal,
    onRefresh,
    handleShowAddModal,
  } = useCategoriesList({ favoritesOnly });

  const { columns: numColumns, cardWidth, gap, sidePadding } = responsive.getGridLayout(containerWidth, deviceType);
  const cardHeight = cardWidth;

  const handleOpenNotes = React.useCallback(
    (category: Category) => {
      viewCategoryNotes({ categoryId: category.id, categoryName: category.name, isFavorite: category.isFavorite });
    },
    [viewCategoryNotes]
  );

  const emptyText = React.useCallback(() => {
    if (favoritesOnly) {
      return EmptyCategoryText.noCategories;
    }
    return EmptyCategoryText.noCategories;
  }, [favoritesOnly]);

  const renderRefreshControl = React.useCallback(() => {
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

  const renderItem = React.useCallback(
    ({ item, index }: { item: Category; index: number }) => {
      const isLastInRow = (index + 1) % numColumns === 0;
      const noteCount = notes.filter((n) => n.categoryId === item.id && !n.isDeleted).length;

      return (
        <CategoryCard
          category={item}
          onPress={() => {
            setActiveMenuId(null);
            handleOpenNotes(item);
          }}
          onEdit={() => handleEditCategory(item)}
          onDelete={() => handleDeleteCategory(item.id)}
          onFavorite={() => handleFavoriteCategory(item)}
          isMenuVisible={activeMenuId === item.id}
          onToggleMenu={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
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
      setActiveMenuId,
      handleOpenNotes,
      handleEditCategory,
      handleDeleteCategory,
      handleFavoriteCategory,
    ]
  );

  const renderEmptyFlatListData = React.useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="folder-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{emptyText()}</Text>
      </View>
    );
  }, [styles.emptyContainer, styles.emptyText, colors.textSecondary, emptyText]);

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

        {showAddButton && (
          <IconPressable
            onPress={handleShowAddModal}
            size={60}
            haptic="heavy"
            pressedColor={colors.primaryPressed}
            backgroundColor={colors.primary}
            style={commonStyles.floatingButton}
          >
            <Text style={commonStyles.floatingButtonText}>+</Text>
          </IconPressable>
        )}

        <AddCategoryBottomSheet
          ref={bottomSheetRef}
          visible={showAddModal}
          onClose={handleCloseModal}
          onSave={editCategory ? handleSaveEditedCategory : handleAddCategory}
          initialValue={editCategory?.name}
          initialColor={editCategory?.color}
          initialIcon={editCategory?.icon}
        />

        <ConfirmationBottomSheet
          ref={deleteSheetRef}
          title="Delete Category"
          message="Are you sure you want to delete this category? All notes associated with it will also be permanently deleted."
          confirmText="Permanently Delete"
          onConfirm={confirmDeleteCategory}
          colors={colors}
          type="danger"
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoryListScreen;
