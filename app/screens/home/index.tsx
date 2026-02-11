import { IconPressable } from "@/components/button/IconPressable";
import { AddCategoryModal } from "@/components/category/AddCategoryModal";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Header } from "@/components/header/Header";
import { ConfirmationModal } from "@/components/modal/ConfirmationModal";
import { SearchBar } from "@/components/searchbar/SearchBar";
import { CARD_HEIGHT, EmptyCategoryText, NUM_COLUMNS } from "@/constants/categories";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCategories, selectColors, selectUser } from "@/store/selectors";
import { addCategory, deleteCategory, updateCategory } from "@/store/slices/categoriesSlice";
import { deleteNotesByCategory } from "@/store/slices/notesSlice";
import { commonStyles } from "@/styles/global";
import { createHomeScreenStyles } from "@/styles/home/HomeScreen.styles";
import { Category, CategoryApi } from "@/types/category/category.types";
import { CreateNewCategory } from "@/utilities/category/CategoryUtils";
import { filterCategories } from "@/utilities/home/HomeScreenUtils";
import { useNavigation } from "@/utilities/routes/Routes";
import { showErrorToast } from "@/utilities/toast/message-toast";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen: React.FC = () => {
    const { viewCategoryNotes } = useNavigation();
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategories);
    const user = useAppSelector(selectUser);
    const colors = useAppSelector(selectColors);

    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [searchText, setSearchText] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
    const styles = createHomeScreenStyles(colors);

    const filteredCategories = useMemo(() => {
        return filterCategories(categories, { searchText });
    }, [categories, searchText]);

    const handleAddCategory = useCallback((name: string) => {
        if (!user?.id) return;
        const newCategory: CategoryApi = CreateNewCategory({ name: name });
        dispatch(addCategory(newCategory));
        setShowAddModal(false);
    }, [dispatch, user?.id]);

    const handleEditCategory = useCallback((category: Category) => {
        setEditCategory(category);
        setShowAddModal(true);
    }, []);

    const handleSaveEditedCategory = useCallback((newName: string) => {
        if (editCategory?.name === newName) {
            showErrorToast({ message: "Nothing to update!" })
            return;
        }
        console.log("New name in edit category...", newName);
        if (!editCategory) return;
        dispatch(
            updateCategory({
                id: editCategory.id,
                updates: {
                    name: newName,
                    updatedAt: new Date().toISOString(),
                },
            })
        );
        setEditCategory(null);
        setShowAddModal(false);
    }, [dispatch, editCategory]);

    const handleDeleteCategory = useCallback(
        (id: string) => {
            setCategoryToDelete(id);
            setShowDeleteModal(true);
        },
        []
    );

    const confirmDeleteCategory = useCallback(() => {
        if (categoryToDelete) {
            dispatch(deleteNotesByCategory(categoryToDelete));
            dispatch(deleteCategory(categoryToDelete));
            setCategoryToDelete(null);
            setShowDeleteModal(false);
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
        },
        [dispatch]
    );

    const handleOpenNotes = useCallback((category: Category) => {
        viewCategoryNotes({ categoryId: category.id, categoryName: category.name });
    }, []);

    const handleCloseModal = () => {
        setEditCategory(null);
        setShowAddModal(false);
    };
    const emptyText = () => {
        if (searchText) return EmptyCategoryText.noFound;
        return EmptyCategoryText.noCategories;
    };

    const renderItem = ({ item }: { item: Category }) => (
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
        />
    );

    const renderEmptyFlatListData = () => {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="folder-outline" size={64} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{emptyText()}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <View style={styles.container}>
                {/* header */}
                <Header title={"Ai Note Taker"} titleStyle={{ color: colors.primary }} />

                {/* search bar */}
                <SearchBar
                    value={searchText}
                    onChangeText={setSearchText}
                    onClear={() => setSearchText("")}
                    placeholder={"Search categories..."}
                    colors={{
                        surface: colors.surface,
                        text: colors.text,
                        textSecondary: colors.textSecondary,
                        border: colors.border,
                        primary: colors.primary,
                    }}
                />

                {/* categories list */}
                <View style={styles.flashListWrapper}>
                    <FlashList
                        data={filteredCategories}
                        renderItem={renderItem}
                        estimatedItemSize={CARD_HEIGHT}
                        numColumns={NUM_COLUMNS}
                        contentContainerStyle={styles.listContainer}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={renderEmptyFlatListData}
                        style={{ flex: 1, width: "100%", paddingHorizontal: 5, }}
                    />
                </View>

                <IconPressable
                    onPress={() => setShowAddModal(true)}
                    size={60}
                    haptic="heavy"
                    pressedColor={colors.primaryPressed}
                    backgroundColor={colors.primary}
                    style={commonStyles.floatingButton}
                >
                    <Text style={commonStyles.floatingButtonText}>+</Text>
                </IconPressable>
                {/* Add Category Modal */}
                {showAddModal && (
                    <AddCategoryModal
                        visible={showAddModal}
                        onClose={handleCloseModal}
                        onSave={editCategory ? handleSaveEditedCategory : handleAddCategory}
                        initialValue={editCategory?.name}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDeleteCategory}
                    title="Delete Category?"
                    message="Are you sure you want to delete this category? All notes associated with it will also be permanently deleted."
                    confirmText="Delete"
                    type="danger"
                />
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;