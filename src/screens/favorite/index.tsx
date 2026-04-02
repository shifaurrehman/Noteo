import { AddCategoryBottomSheet } from "@/components/category/AddCategoryBottomSheet";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Header } from "@/components/header/Header";
import { SearchBar } from "@/components/searchbar/SearchBar";
import { EmptyCategoryText } from "@/constants/categories";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCategories, selectCategoriesLoading, selectIsConnected } from "@/store/selectors";
import { useTheme } from "@/hooks/useTheme";
import { deleteCategory, fetchCategories, updateCategory } from "@/store/slices/categoriesSlice";
import { deleteNotesByCategory } from "@/store/slices/notesSlice";
import { createHomeScreenStyles } from "@/styles/home/HomeScreen.styles";
import { Category } from "@/types/category/category.types";
import { filterCategories } from "@/utilities/home/HomeScreenUtils";
import responsive, { useResponsive } from "@/utilities/responsive";
import { useNavigation } from "@/utilities/routes/Routes";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const FavoriteScreen: React.FC = () => {
    const { viewCategoryNotes } = useNavigation();
    const { deviceType } = useResponsive();
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategories);
    const { colors } = useTheme();
    const isConnected = useAppSelector(selectIsConnected);
    const isLoading = useAppSelector(selectCategoriesLoading);
    const bottomSheetRef = useRef<any>(null);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [searchText, setSearchText] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const styles = createHomeScreenStyles(colors);
    const { columns: numColumns, cardWidth, gap, sidePadding } = responsive.getGridLayout(containerWidth, deviceType);
    const cardHeight = cardWidth;

    const filteredCategories = useMemo(() => {
        return filterCategories(categories, { searchText, favoritesOnly: true });
    }, [categories, searchText]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleEditCategory = useCallback((category: Category) => {
        setEditCategory(category);
        setShowAddModal(true);
    }, []);

    const handleSaveEditedCategory = useCallback(
        (category: { name: string; color: string; icon: string }) => {
            if (!editCategory) return;
            dispatch(
                updateCategory({
                    id: editCategory.id,
                    updates: { name: category.name },
                })
            );
            setEditCategory(null);
            setShowAddModal(false);
            bottomSheetRef.current?.dismiss();
        },
        [dispatch, editCategory]
    );

    const handleDeleteCategory = useCallback(
        (id: string) => {
            dispatch(deleteNotesByCategory(id)); // remove all notes of this category
            dispatch(deleteCategory(id));
            setActiveMenuId(null);
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
            setActiveMenuId(null);
        },
        [dispatch]
    );

    const handleOpenNotes = useCallback((category: Category) => {
        viewCategoryNotes({ categoryId: category.id, categoryName: category.name, isFavorite: true });
    }, [viewCategoryNotes]);

    const handleCloseModal = () => {
        setEditCategory(null);
        setShowAddModal(false);
    };
    const emptyText = () => {
        if (searchText) return EmptyCategoryText.noFound;
        return EmptyCategoryText.noCategories;
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

    const renderItem = ({ item, index }: { item: Category, index: number }) => {
        const isLastInRow = (index + 1) % numColumns === 0;
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
                style={{
                    marginRight: isLastInRow ? 0 : gap,
                    marginBottom: gap,
                }}
            />
        );
    }

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
            <View style={styles.container}>
                {/* header */}
                <Header title={"Ai Note Taker"} backgroundColor={colors.background} titleStyle={{ color: colors.primary }} />

                {/* search bar */}
                <SearchBar
                    value={searchText}
                    onChangeText={setSearchText}
                    onClear={() => setSearchText("")}
                    placeholder={"Search favorites..."}
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

                {/* Add/Edit Category Bottom Sheet */}
                <AddCategoryBottomSheet
                    ref={bottomSheetRef}
                    visible={showAddModal}
                    onClose={handleCloseModal}
                    onSave={handleSaveEditedCategory}
                    initialValue={editCategory?.name}
                />
            </View>
        </SafeAreaView>
    );
};

export default FavoriteScreen;