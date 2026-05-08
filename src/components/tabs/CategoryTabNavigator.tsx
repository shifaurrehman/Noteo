import { CategoryListContent } from "@/components/category/CategoryListContent";
import { useTheme } from "@/hooks/useTheme";
import { Category, Note } from "@/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { View } from "react-native";
import { useResponsive } from "@/utilities/responsive";
import { filterCategories } from "@/utilities/home/HomeScreenUtils";

const Tab = createMaterialTopTabNavigator();

interface CategoryTabNavigatorProps {
  allCategories: Category[];
  notes: Note[];
  isLoading: boolean;
  isConnected: boolean | null;
  onRefresh: () => void;
  onOpenNotes: (category: Category) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onFavoriteCategory: (category: Category) => void;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
}

export const CategoryTabNavigator: React.FC<CategoryTabNavigatorProps> = ({
  allCategories,
  notes,
  isLoading,
  isConnected,
  onRefresh,
  onOpenNotes,
  onEditCategory,
  onDeleteCategory,
  onFavoriteCategory,
  activeMenuId,
  setActiveMenuId,
}) => {
  const { colors } = useTheme();
  const { width } = useResponsive();

  const handleToggleMenu = React.useCallback(
    (id: string | null) => {
      setActiveMenuId(id);
    },
    [setActiveMenuId]
  );

  const allCategoriesList = React.useMemo(
    () => filterCategories(allCategories, { favoritesOnly: false }),
    [allCategories]
  );

  const favoriteCategoriesList = React.useMemo(
    () => filterCategories(allCategories, { favoritesOnly: true }),
    [allCategories]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.background,
            borderBottomColor: "rgba(255, 255, 255, 0.05)",
            elevation: 0,
            shadowOpacity: 0,
            height: 48,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: 3,
            borderRadius: 3,
            width: 30,
            marginLeft: (width / 2 - 30) / 2,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
            letterSpacing: 0.2,
            textTransform: "none",
          },
          sceneStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Tab.Screen name="All">
          {() => (
            <CategoryListContent
              categories={allCategoriesList}
              notes={notes}
              isLoading={isLoading}
              isConnected={isConnected}
              onRefresh={onRefresh}
              onOpenNotes={onOpenNotes}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              onFavoriteCategory={onFavoriteCategory}
              activeMenuId={activeMenuId}
              onToggleMenu={handleToggleMenu}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Favorites">
          {() => (
            <CategoryListContent
              categories={favoriteCategoriesList}
              notes={notes}
              isLoading={isLoading}
              isConnected={isConnected}
              onRefresh={onRefresh}
              onOpenNotes={onOpenNotes}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              onFavoriteCategory={onFavoriteCategory}
              activeMenuId={activeMenuId}
              onToggleMenu={handleToggleMenu}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};
