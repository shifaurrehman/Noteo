import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCategories, selectCategoriesByFilter, selectCategoriesLoading, selectIsConnected, selectNotes } from "@/store/selectors";
import { addCategory, deleteCategory, fetchCategories, updateCategory } from "@/store/slices/categoriesSlice";
import { deleteNotesByCategory } from "@/store/slices/notesSlice";
import { filterCategories } from "@/utilities/home/HomeScreenUtils";
import { Category } from "@/types/category/category.types";
import { CreateNewCategory } from "@/utilities/category/CategoryUtils";
import { showErrorToast } from "@/utilities/toast/message-toast";

interface UseCategoriesListProps {
  favoritesOnly: boolean;
  searchText?: string;
}

export const useCategoriesList = ({ favoritesOnly, searchText = "" }: UseCategoriesListProps) => {
  const dispatch = useAppDispatch();
  const allCategories = useAppSelector(selectCategories);
  const notes = useAppSelector(selectNotes);
  const isConnected = useAppSelector(selectIsConnected);
  const isLoading = useAppSelector(selectCategoriesLoading);

  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const bottomSheetRef = useRef<any>(null);
  const deleteSheetRef = useRef<any>(null);

  const filteredCategories = useMemo(() => {
    return filterCategories(allCategories, { favoritesOnly, searchText });
  }, [allCategories, favoritesOnly, searchText]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = useCallback(
    ({ name, color, icon }: { name: string; color: string; icon: string }) => {
      const isAuthenticated = true;
      const newCategory = CreateNewCategory({ name, color, icon });
      const categoryWithLocalFlag = { ...newCategory, isLocal: !isAuthenticated };
      dispatch(addCategory(categoryWithLocalFlag));
      setShowAddModal(false);
      bottomSheetRef.current?.dismiss();
    },
    [dispatch]
  );

  const handleEditCategory = useCallback((category: Category) => {
    setEditCategory(category);
    setShowAddModal(true);
    bottomSheetRef.current?.present();
  }, []);

  const handleSaveEditedCategory = useCallback(
    ({ name, color, icon }: { name: string; color: string; icon: string }) => {
      if (!editCategory) return;

      const isUnchanged =
        editCategory.name === name && editCategory.color === color && editCategory.icon === icon;

      if (isUnchanged) {
        showErrorToast({ message: "Nothing to update!" });
        return;
      }

      dispatch(
        updateCategory({
          id: editCategory.id,
          updates: {
            name,
            color,
            icon,
            updatedAt: new Date().toISOString(),
          },
        })
      );
      setEditCategory(null);
      setShowAddModal(false);
      bottomSheetRef.current?.dismiss();
    },
    [dispatch, editCategory]
  );

  const handleDeleteCategory = useCallback((id: string) => {
    setCategoryToDelete(id);
    deleteSheetRef.current?.present();
  }, []);

  const confirmDeleteCategory = useCallback(() => {
    if (categoryToDelete) {
      dispatch(deleteNotesByCategory(categoryToDelete));
      dispatch(deleteCategory(categoryToDelete));
      setCategoryToDelete(null);
      deleteSheetRef.current?.dismiss();
    }
  }, [dispatch, categoryToDelete]);

  const handleFavoriteCategory = useCallback(
    (category: Category) => {
      dispatch(
        updateCategory({
          id: category.id,
          updates: { isFavorite: !category.isFavorite },
        })
      );
      setActiveMenuId(null);
    },
    [dispatch]
  );

  const handleCloseModal = useCallback(() => {
    setEditCategory(null);
    setShowAddModal(false);
  }, []);

  const onRefresh = useCallback(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleShowAddModal = useCallback(() => {
    setEditCategory(null);
    setShowAddModal(true);
    bottomSheetRef.current?.present();
  }, []);

  return {
    categories: filteredCategories,
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
  };
};
