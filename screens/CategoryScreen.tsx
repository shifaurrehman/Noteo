import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCategories, selectColors } from "@/store/selectors";
import { addCategory, updateCategory, deleteCategory, fetchCategories } from "@/store/slices/categoriesSlice";
import { deleteNotesByCategory } from "@/store/slices/notesSlice";
import { Category } from "@/types";
import { CreateNewCategory, filterCategories } from "@/utilities/home/HomeScreenUtils";
import { openNotes } from "@/utilities/routes/Routes";

import { Header } from "@/components/header/Header";
import { SearchBar } from "@/components/searchbar/SearchBar";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { ShimmerCategoryGrid } from "@/components/shimmer/category/ShimmerCategoryGrid";
import { AddButton } from "@/components/button/AddButton";
import { AddCategoryModal } from "@/components/category/AddCategoryModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { createHomeScreenStyles } from "@/types/home/HomeScreen.styles";
import { EmptyCategoryText } from "@/constants/categories";

interface Props {
  title?: string;
  showFavoritesOnly?: boolean;
}

export const CategoryScreen: React.FC<Props> = ({ title = "Ai Note Taker", showFavoritesOnly = false }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const colors = useAppSelector(selectColors);
  const loading = useAppSelector((state) => state.categories.loading);
  const error = useAppSelector((state) => state.categories.error);
  const user = useAppSelector((state) => state.auth.user);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  console.log("error: ", error, "loading: ", loading, "user: ", user);

  const [searchText, setSearchText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const styles = createHomeScreenStyles(colors);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = useMemo(() => {
    return filterCategories(categories, { searchText, favoritesOnly: showFavoritesOnly });
  }, [categories, searchText, showFavoritesOnly]);

  const handleAddCategory = useCallback(
    (name: string) => {
      if (!user?.id) return;
      const newCategory: Category = CreateNewCategory(name, user.id);
      dispatch(addCategory(newCategory));
      setShowAddModal(false);
    },
    [dispatch, user?.id]
  );

  const handleEditCategory = useCallback((category: Category) => {
    console.log("handleEditCategory calledd with ", category);

    setEditCategory(category);
    setShowAddModal(true);
  }, []);

  const handleSaveEditedCategory = useCallback(
    (newName: string) => {
      if (!editCategory) return;
      dispatch(
        updateCategory({
          id: editCategory.id,
          updates: { name: newName },
        })
      );
      setEditCategory(null);
      setShowAddModal(false);
    },
    [dispatch, editCategory]
  );

  const handleDeleteCategory = useCallback(
    (id: string) => {
      dispatch(deleteNotesByCategory(id)); // remove all notes of this category
      dispatch(deleteCategory(id));
      setShowAddModal(false);
    },
    [dispatch]
  );

  const handleFavoriteCategory = useCallback(
    (category: Category) => {
      dispatch(
        updateCategory({
          id: category.id,
          updates: { isFavorite: !category.isFavorite },
        })
      );
    },
    [dispatch]
  );

  const handleOpenNotes = useCallback((category: Category) => {
    openNotes(category.id, category.name);
  }, []);

  const handleCloseModal = () => {
    setEditCategory(null);
    setShowAddModal(false);
  };
  const emptyText = () => {
    if (searchText) return EmptyCategoryText.noFound;
    if (showFavoritesOnly) {
      return EmptyCategoryText.noFavorites;
    } else {
      return EmptyCategoryText.noCategories;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <Header title={title} titleStyle={{ color: colors.primary }} />

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onClear={() => setSearchText("")}
          placeholder={showFavoritesOnly ? "Search favorites..." : "Search categories..."}
          colors={{
            surface: colors.surface,
            text: colors.text,
            textSecondary: colors.textSecondary,
            border: colors.border,
            primary: colors.primary,
          }}
        />
        {loading ? (
          <ShimmerCategoryGrid />
        ) : (
          <CategoryGrid
            categories={filteredCategories}
            onPress={handleOpenNotes}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onFavorite={handleFavoriteCategory}
            emptyText={emptyText()}
            colors={colors}
          />
        )}

        {/* Add Category Button */}
        {!showFavoritesOnly && (
          <AddButton
            onPress={() => setShowAddModal(true)}
            colors={{
              primary: colors.primary,
              shadow: colors.shadow,
            }}
          />
        )}

        {/* Add Category Modal */}
        <AddCategoryModal
          visible={showAddModal}
          onClose={handleCloseModal}
          onSave={editCategory ? handleSaveEditedCategory : handleAddCategory}
          initialValue={editCategory?.name}
        />
      </View>
    </SafeAreaView>
  );
};
