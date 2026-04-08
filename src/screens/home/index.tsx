import { IconPressable } from "@/components/button/IconPressable";
import { AddCategoryBottomSheet } from "@/components/category/AddCategoryBottomSheet";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Header } from "@/components/header/Header";
import { ConfirmationBottomSheet } from "@/components/modal/ConfirmationBottomSheet";
import { SearchBar } from "@/components/searchbar/SearchBar";
import { EmptyCategoryText } from "@/constants/categories";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCategories, selectCategoriesLoading, selectIsConnected, selectNotes } from "@/store/selectors";
import { useTheme } from "@/hooks/useTheme";
import { addCategory, deleteCategory, fetchCategories, updateCategory } from "@/store/slices/categoriesSlice";
import { deleteNotesByCategory } from "@/store/slices/notesSlice";
import { commonStyles } from "@/styles/global";
import { createHomeScreenStyles } from "@/styles/home/HomeScreen.styles";
import { Category, CategoryApi } from "@/types/category/category.types";
import { CreateNewCategory } from "@/utilities/category/CategoryUtils";
import { filterCategories } from "@/utilities/home/HomeScreenUtils";
import responsive, { useResponsive } from "@/utilities/responsive";
import { useNavigation } from "@/utilities/routes/Routes";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";

import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState, useRef } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen: React.FC = () => {
    const { viewCategoryNotes } = useNavigation();
    const { deviceType } = useResponsive();
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategories);
    const notes = useAppSelector(selectNotes);
    const { colors } = useTheme();
    const isConnected = useAppSelector(selectIsConnected);
    const isLoading = useAppSelector(selectCategoriesLoading);
    console.log("Categories in home screen: ", JSON.stringify(categories, null, 2))

    const bottomSheetRef = useRef<any>(null);
    const deleteSheetRef = useRef<any>(null);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [searchText, setSearchText] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const styles = createHomeScreenStyles(colors);

    // Log initial state - only run on mount
    /* eslint-disable react-hooks/exhaustive-deps */
    React.useEffect(() => {
        console.log("=== HomeScreen mounted - initial showAddModal:", showAddModal, "initial editCategory:", editCategory);
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    const { columns: numColumns, cardWidth, gap, sidePadding } = responsive.getGridLayout(containerWidth, deviceType); 
    const cardHeight = cardWidth;

    const filteredCategories = useMemo(() => {
        return filterCategories(categories, { searchText });
    }, [categories, searchText]);

    const handleAddCategory = useCallback(({ name, color, icon }: { name: string; color: string; icon: string }) => {
        const newCategory: CategoryApi = CreateNewCategory({ name, color, icon });
        dispatch(addCategory(newCategory));
        showSuccessToast({ message: "Category created successfully" });
        setShowAddModal(false);
        bottomSheetRef.current?.dismiss();
    }, [dispatch]);



    const handleEditCategory = useCallback((category: Category) => {
        setEditCategory(category);
        bottomSheetRef.current?.present();
    }, []);

    const handleShowAddModal = useCallback(() => {
        console.log("=== handleShowAddModal called ===");
        console.log("Before state update - showAddModal:", showAddModal, "editCategory:", editCategory);
        setEditCategory(null);
        setShowAddModal((prev) => {
            console.log("setShowAddModal callback - previous value:", prev, "new value: true");
            return true;
        });
        console.log("After state update call - setting showAddModal to true");
        console.log("Bottom sheet ref:", bottomSheetRef);
        bottomSheetRef.current?.present();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSaveEditedCategory = useCallback(({ name, color, icon }: { name: string; color: string; icon: string }) => {
        if (!editCategory) return;
        
        const isUnchanged = editCategory.name === name && 
                           editCategory.color === color && 
                           editCategory.icon === icon;

        if (isUnchanged) {
            showErrorToast({ message: "Nothing to update!" })
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
        showSuccessToast({ message: "Category updated successfully" });
        setEditCategory(null);
        setShowAddModal(false);
        bottomSheetRef.current?.dismiss();
    }, [dispatch, editCategory]);



    const handleDeleteCategory = useCallback(
        (id: string) => {
            setCategoryToDelete(id);
            deleteSheetRef.current?.present();
        },
        []
    );

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

    const handleOpenNotes = useCallback((category: Category) => {
        viewCategoryNotes({ categoryId: category.id, categoryName: category.name, isFavorite: category.isFavorite });
    }, [viewCategoryNotes]);

    const handleCloseModal = () => {
        setEditCategory(null);
        setShowAddModal(false);
    };

    const onRefresh = useCallback(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const renderRefreshControl = () => {
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
    };

    const emptyText = () => {
        if (searchText) return EmptyCategoryText.noFound;
        return EmptyCategoryText.noCategories;
    };

    const renderItem = ({ item, index }: { item: Category; index: number }) => {
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
    };

    const renderEmptyFlatListData = () => {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="folder-outline" size={64} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{emptyText()}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
            <Header title={"Noteo"} backgroundColor={colors.background} titleStyle={{ color: colors.primary, textAlign: "left" }} />
            <View style={styles.container}>
                {/* header */}

                {/* search bar */}
                <SearchBar
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder={"Search categories..."}
                    colors={{
                        surface: colors.surface,
                        textMain: colors.textMain,
                        textSecondary: colors.textSecondary,
                        border: colors.border,
                        primary: colors.primary,
                    }}
                />

                {/* categories list */}
                <View style={styles.flashListWrapper}
                    onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setContainerWidth(width);
                    }}>
                    <FlatList
                        data={filteredCategories}
                        renderItem={renderItem}
                        numColumns={numColumns}
                        contentContainerStyle={{
                            paddingHorizontal: sidePadding,
                            paddingVertical: gap,
                        }}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={renderEmptyFlatListData}
                        refreshControl={renderRefreshControl()}
                    />
                </View>

                <IconPressable
                    onPress={() => {
                        console.log("=== Floating button pressed");
                        handleShowAddModal();
                    }}
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

                {/* Delete Confirmation Bottom Sheet */}
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

export default HomeScreen;