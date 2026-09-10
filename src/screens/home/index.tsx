import { IconPressable } from "@/components/button/IconPressable";
import { AddCategoryBottomSheet } from "@/components/category/AddCategoryBottomSheet";
import { CategoryTabNavigator } from "@/components/tabs/CategoryTabNavigator";
import { ConfirmationBottomSheet } from "@/components/modal/ConfirmationBottomSheet";
import { useCategoriesList } from "@/hooks/useCategoriesList";
import { useTheme } from "@/hooks/useTheme";
import { MainHeader } from "@/components/header/MainHeader";
import { commonStyles } from "@/styles/global";
import { Category } from "@/types/category/category.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@/utilities/routes/Routes";

const HomeScreen: React.FC = () => {
  const { openSearch, viewCategoryNotes } = useNavigation();
  const { colors } = useTheme();

  const {
    categories,
    notes,
    isLoading,
    isConnected,
    editCategory,
    showAddModal,
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
  } = useCategoriesList({ favoritesOnly: false });

  const handleOpenNotes = React.useCallback(
    (category: Category) => {
      viewCategoryNotes({
        categoryId: category.id,
        categoryName: category.name,
        isFavorite: category.isFavorite,
      });
    },
    [viewCategoryNotes]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => setActiveMenuId(null)}
        accessible={false}
      >
        <MainHeader
          title="Categories"
          rightComponent={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textSecondary, marginRight: 8 }}>
                {categories.length} items
              </Text>
              <Pressable
                onPress={() => openSearch("categories")}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 8 })}
              >
                <Ionicons name="search-outline" size={22} color={colors.textMain} />
              </Pressable>
            </View>
          }
          showBorder
        />

        <CategoryTabNavigator
          allCategories={categories}
          notes={notes}
          isLoading={isLoading}
          isConnected={isConnected}
          onRefresh={onRefresh}
          onOpenNotes={handleOpenNotes}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onFavoriteCategory={handleFavoriteCategory}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
        />

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
      </Pressable>
    </SafeAreaView>
  );
};

export default HomeScreen;
