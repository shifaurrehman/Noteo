# Material Top Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate custom ScrollView-based tabs to Material Top Tabs in HomeScreen and AllNotesScreen for premium native feel with smooth swipe gestures.

**Architecture:** Parent screens manage state and modals; child components are "dumb" UI components that accept data and handlers as props. Tab navigators handle routing and styling only.

**Tech Stack:** React Native, Expo, React Navigation (Material Top Tabs), TypeScript, Redux Toolkit, React.memo for performance optimization.

---

## File Structure

**New files:**
- `src/components/tabs/CategoryTabNavigator.tsx` - Material Top Tabs for HomeScreen (2 tabs)
- `src/components/tabs/NotesTabNavigator.tsx` - Material Top Tabs for AllNotesScreen (4 tabs)
- `src/components/category/CategoryListContent.tsx` - Dumb category list component
- `src/components/notes/NotesListContent.tsx` - Dumb notes list component

**Modified files:**
- `src/screens/home/index.tsx` - Simplified to use CategoryTabNavigator + useCategoriesList
- `src/screens/allNotes/index.tsx` - Simplified to use NotesTabNavigator

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Material Top Tabs and Pager View**

```bash
npm install @react-navigation/material-top-tabs react-native-pager-view
```

- [ ] **Step 2: Verify installation**

Run: `cat package.json | grep -A 2 -B 2 "material-top-tabs\|pager-view"`
Expected: Both packages listed in dependencies

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @react-navigation/material-top-tabs and react-native-pager-view"
```

---

## Task 2: Extract CategoryListContent Component

**Files:**
- Create: `src/components/category/CategoryListContent.tsx`

- [ ] **Step 1: Create CategoryListContent component file**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/category/CategoryListContent.tsx
git commit -m "feat: extract CategoryListContent dumb component for tab navigation"
```

---

## Task 3: Create CategoryTabNavigator

**Files:**
- Create: `src/components/tabs/CategoryTabNavigator.tsx`

- [ ] **Step 1: Create CategoryTabNavigator component**

```typescript
import { CategoryListContent } from "@/components/category/CategoryListContent";
import { useTheme } from "@/hooks/useTheme";
import { Category, Note } from "@/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";
import { filterCategories } from "@/utilities/home/HomeScreenUtils";

const Tab = createMaterialTopTabNavigator();

interface CategoryTabNavigatorProps {
  allCategories: Category[];
  notes: Note[];
  isLoading: boolean;
  isConnected: boolean;
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
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: 3,
            borderRadius: 3,
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: "600",
            letterSpacing: 0.2,
            textTransform: "none",
          },
          tabStyle: {
            paddingVertical: 12,
          },
        }}
        onIndexChange={() => setActiveMenuId(null)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/tabs/CategoryTabNavigator.tsx
git commit -m "feat: create CategoryTabNavigator with All and Favorites tabs"
```

---

## Task 4: Refactor HomeScreen to use CategoryTabNavigator

**Files:**
- Modify: `src/screens/home/index.tsx`

- [ ] **Step 1: Replace HomeScreen with new structure**

```typescript
import { IconPressable } from "@/components/button/IconPressable";
import { AddCategoryBottomSheet } from "@/components/category/AddCategoryBottomSheet";
import { CategoryTabNavigator } from "@/components/tabs/CategoryTabNavigator";
import { ConfirmationBottomSheet } from "@/components/modal/ConfirmationBottomSheet";
import { useCategoriesList } from "@/hooks/useCategoriesList";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "@/components/header/Header";
import { commonStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@/utilities/routes/Routes";

const HomeScreen: React.FC = () => {
  const { openSearch } = useNavigation();
  const { colors } = useTheme();

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
  } = useCategoriesList({ favoritesOnly: false });

  const handleOpenNotes = React.useCallback(
    (category: any) => {
      const { viewCategoryNotes } = useNavigation();
      viewCategoryNotes({
        categoryId: category.id,
        categoryName: category.name,
        isFavorite: category.isFavorite,
      });
    },
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => setActiveMenuId(null)}
        accessible={false}
      >
        <Header
          title={"Noteo"}
          backgroundColor={colors.background}
          titleStyle={{ color: colors.primary, textAlign: "left" }}
          showSettings
          rightIcon={<Ionicons name="search-outline" size={22} color={colors.textMain} />}
          onRightPress={() => openSearch("categories")}
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
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No TypeScript errors

- [ ] **Step 3: Run linter**

Run: `npm run lint`
Expected: No linting errors

- [ ] **Step 4: Commit**

```bash
git add src/screens/home/index.tsx
git commit -m "refactor: HomeScreen uses CategoryTabNavigator with Material Top Tabs"
```

---

## Task 5: Extract NotesListContent Component

**Files:**
- Create: `src/components/notes/NotesListContent.tsx`

- [ ] **Step 1: Create NotesListContent component file**

```typescript
import { NoteCard } from "@/components/notes/NoteCard";
import { useTheme } from "@/hooks/useTheme";
import { Category, Note } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

type FilterTab = "all" | "recent" | "pinned" | "drafts";

interface NotesListContentProps {
  allNotes: Note[];
  filterType: FilterTab;
  categories: Category[];
  isLoading: boolean;
  isConnected: boolean;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onToggleFavorite: (note: Note) => void;
  onMove: (note: Note) => void;
  activeNoteMenuId: string | null;
  onToggleMenu: (id: string | null) => void;
  onRefresh: () => void;
}

export const NotesListContent: React.FC<NotesListContentProps> = React.memo(
  ({
    allNotes,
    filterType,
    categories,
    isLoading,
    isConnected,
    onEdit,
    onDelete,
    onToggleFavorite,
    onMove,
    activeNoteMenuId,
    onToggleMenu,
    onRefresh,
  }) => {
    const { colors } = useTheme();

    const filteredNotes = useMemo(() => {
      switch (filterType) {
        case "recent": {
          const oneDayAgo = new Date();
          oneDayAgo.setDate(oneDayAgo.getDate() - 7);
          return allNotes
            .filter((n) => !n.isDeleted)
            .filter((n) => new Date(n.updatedAt ?? n.createdAt) >= oneDayAgo)
            .sort(
              (a, b) =>
                new Date(b.updatedAt ?? b.createdAt).getTime() -
                new Date(a.updatedAt ?? a.createdAt).getTime()
            );
        }
        case "pinned":
          return allNotes.filter((n) => !n.isDeleted && n.isFavorite);
        case "drafts":
          return allNotes.filter(
            (n) => !n.isDeleted && (!n.content?.trim() || !n.title?.trim())
          );
        default: // 'all'
          return allNotes
            .filter((n) => !n.isDeleted)
            .sort(
              (a, b) =>
                new Date(b.updatedAt ?? b.createdAt).getTime() -
                new Date(a.updatedAt ?? a.createdAt).getTime()
            );
      }
    }, [allNotes, filterType]);

    const renderItem = useCallback(
      ({ item }: { item: Note }) => {
        const category = categories.find((c) => c.id === item.categoryId);

        return (
          <NoteCard
            note={item}
            onPress={() => {
              onToggleMenu(null);
              onEdit(item);
            }}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
            onPin={() => onToggleFavorite(item)}
            onMove={() => onMove(item)}
            isMenuVisible={activeNoteMenuId === item.id}
            onToggleMenu={() =>
              onToggleMenu(activeNoteMenuId === item.id ? null : item.id)
            }
            categoryName={category?.name}
            categoryColor={category?.color}
          />
        );
      },
      [
        categories,
        activeNoteMenuId,
        onToggleMenu,
        onEdit,
        onDelete,
        onToggleFavorite,
        onMove,
      ]
    );

    const renderEmpty = useCallback(() => {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.textMain }]}>No notes yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Start by adding a note to any category
          </Text>
        </View>
      );
    }, [colors.textMain, colors.textSecondary]);

    const refreshControl = useCallback(
      () => (
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={colors.surface}
        />
      ),
      [isLoading, colors.primary, colors.surface, onRefresh]
    );

    return (
      <View style={styles.container}>
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl()}
        />
      </View>
    );
  }
);

NotesListContent.displayName = "NotesListContent";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/notes/NotesListContent.tsx
git commit -m "feat: extract NotesListContent dumb component for tab navigation"
```

---

## Task 6: Create NotesTabNavigator

**Files:**
- Create: `src/components/tabs/NotesTabNavigator.tsx`

- [ ] **Step 1: Create NotesTabNavigator component**

```typescript
import { NotesListContent } from "@/components/notes/NotesListContent";
import { useTheme } from "@/hooks/useTheme";
import { Category, Note } from "@/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";

const Tab = createMaterialTopTabNavigator();

type FilterTab = "all" | "recent" | "pinned" | "drafts";

interface NotesTabNavigatorProps {
  allNotes: Note[];
  categories: Category[];
  isLoading: boolean;
  isConnected: boolean;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onToggleFavorite: (note: Note) => void;
  onMove: (note: Note) => void;
  activeNoteMenuId: string | null;
  setActiveNoteMenuId: (id: string | null) => void;
  onRefresh: () => void;
}

export const NotesTabNavigator: React.FC<NotesTabNavigatorProps> = ({
  allNotes,
  categories,
  isLoading,
  isConnected,
  onEdit,
  onDelete,
  onToggleFavorite,
  onMove,
  activeNoteMenuId,
  setActiveNoteMenuId,
  onRefresh,
}) => {
  const { colors } = useTheme();

  const handleToggleMenu = React.useCallback(
    (id: string | null) => {
      setActiveNoteMenuId(id);
    },
    [setActiveNoteMenuId]
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
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: 3,
            borderRadius: 3,
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: "600",
            letterSpacing: 0.2,
            textTransform: "none",
          },
          tabStyle: {
            paddingVertical: 12,
          },
        }}
        onIndexChange={() => setActiveNoteMenuId(null)}
      >
        <Tab.Screen name="All">
          {() => (
            <NotesListContent
              allNotes={allNotes}
              filterType="all"
              categories={categories}
              isLoading={isLoading}
              isConnected={isConnected}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onMove={onMove}
              activeNoteMenuId={activeNoteMenuId}
              onToggleMenu={handleToggleMenu}
              onRefresh={onRefresh}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Recent">
          {() => (
            <NotesListContent
              allNotes={allNotes}
              filterType="recent"
              categories={categories}
              isLoading={isLoading}
              isConnected={isConnected}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onMove={onMove}
              activeNoteMenuId={activeNoteMenuId}
              onToggleMenu={handleToggleMenu}
              onRefresh={onRefresh}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Pinned">
          {() => (
            <NotesListContent
              allNotes={allNotes}
              filterType="pinned"
              categories={categories}
              isLoading={isLoading}
              isConnected={isConnected}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onMove={onMove}
              activeNoteMenuId={activeNoteMenuId}
              onToggleMenu={handleToggleMenu}
              onRefresh={onRefresh}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Drafts">
          {() => (
            <NotesListContent
              allNotes={allNotes}
              filterType="drafts"
              categories={categories}
              isLoading={isLoading}
              isConnected={isConnected}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onMove={onMove}
              activeNoteMenuId={activeNoteMenuId}
              onToggleMenu={handleToggleMenu}
              onRefresh={onRefresh}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/tabs/NotesTabNavigator.tsx
git commit -m "feat: create NotesTabNavigator with All, Recent, Pinned, Drafts tabs"
```

---

## Task 7: Refactor AllNotesScreen to use NotesTabNavigator

**Files:**
- Modify: `src/screens/allNotes/index.tsx`

- [ ] **Step 1: Replace AllNotesScreen with new structure**

```typescript
import { ConfirmationModal } from "@/components/modal/ConfirmationModal";
import { NotesTabNavigator } from "@/components/tabs/NotesTabNavigator";
import { SelectionBottomSheet } from "@/components/modal/SelectionBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectNotes, selectNotesLoading, selectCategories } from "@/store/selectors";
import { useTheme } from "@/hooks/useTheme";
import { deleteNote, fetchNotes, updateNote } from "@/store/slices/notesSlice";
import { Note } from "@/types/notes/notes.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@/utilities/routes/Routes";
import { IconPressable } from "@/components/button/IconPressable";
import { commonStyles } from "@/styles/global";

const AllNotesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const allNotes = useAppSelector(selectNotes);
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectNotesLoading);
  const { colors } = useTheme();
  const { openEditNote, openAddNote, openSearch } = useNavigation();

  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeNoteMenuId, setActiveNoteMenuId] = useState<string | null>(null);
  const [noteToMove, setNoteToMove] = useState<Note | null>(null);

  const selectionSheetRef = React.useRef<BottomSheetModal>(null);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleDeleteNote = useCallback((note: Note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteNote = useCallback(() => {
    if (noteToDelete) {
      dispatch(deleteNote(noteToDelete.id));
      setNoteToDelete(null);
      setShowDeleteModal(false);
    }
  }, [dispatch, noteToDelete]);

  const handleToggleFavorite = useCallback(
    (note: Note) => {
      dispatch(
        updateNote({ id: note.id, updates: { isFavorite: !note.isFavorite } })
      );
    },
    [dispatch]
  );

  const handleEditNote = useCallback(
    (note: Note) => {
      openEditNote(note.categoryId, note.id);
    },
    [openEditNote]
  );

  const handleCreateNote = useCallback(() => {
    openAddNote();
  }, [openAddNote]);

  const handleMoveNote = useCallback((note: Note) => {
    setNoteToMove(note);
    selectionSheetRef.current?.present();
  }, []);

  const handleSelectCategory = useCallback(
    (categoryId: string) => {
      if (noteToMove) {
        dispatch(updateNote({ id: noteToMove.id, updates: { categoryId } }));
        setNoteToMove(null);
      }
    },
    [dispatch, noteToMove]
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        id: cat.id,
        label: cat.name,
        icon: (cat.icon || "folder") as any,
      })),
    [categories]
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => setActiveNoteMenuId(null)}
        accessible={false}
      >
        <View style={styles.mainHeader}>
          <Text style={[styles.mainTitle, { color: colors.textMain }]}>
            Notes
          </Text>
          <View style={styles.headerRight}>
            <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
              {allNotes.length} items
            </Text>
            <Pressable
              onPress={() => openSearch('notes')}
              style={({ pressed }) => [
                styles.searchIconBtn,
                { opacity: pressed ? 0.6 : 1 },
              ]}
              accessibilityLabel="Open search"
            >
              <Ionicons name="search" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <NotesTabNavigator
          allNotes={allNotes}
          categories={categories}
          isLoading={isLoading}
          isConnected={true}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          onToggleFavorite={handleToggleFavorite}
          onMove={handleMoveNote}
          activeNoteMenuId={activeNoteMenuId}
          setActiveNoteMenuId={setActiveNoteMenuId}
          onRefresh={() => dispatch(fetchNotes())}
        />

        <IconPressable
          onPress={handleCreateNote}
          size={60}
          haptic="heavy"
          backgroundColor={colors.primary}
          pressedColor={colors.primaryPressed}
          style={commonStyles.floatingButton}
        >
          <Text style={commonStyles.floatingButtonText}>+</Text>
        </IconPressable>

        <ConfirmationModal
          visible={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setNoteToDelete(null);
          }}
          onConfirm={confirmDeleteNote}
          title="Delete Note?"
          message="Are you sure you want to delete this note? This action cannot be undone."
          confirmText="Delete"
          type="danger"
        />

        <SelectionBottomSheet
          ref={selectionSheetRef}
          title="Move Note"
          description="Select a category to move this note to."
          options={categoryOptions}
          selectedValue={noteToMove?.categoryId || ""}
          onSelect={handleSelectCategory}
          colors={colors}
        />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
  },
  searchIconBtn: {
    padding: 8,
    borderRadius: 12,
  },
});

export default AllNotesScreen;
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No TypeScript errors

- [ ] **Step 3: Run linter**

Run: `npm run lint`
Expected: No linting errors

- [ ] **Step 4: Commit**

```bash
git add src/screens/allNotes/index.tsx
git commit -m "refactor: AllNotesScreen uses NotesTabNavigator with Material Top Tabs"
```

---

## Task 8: Final Testing and Cleanup

**Files:**
- Verify: All modified files

- [ ] **Step 1: Run preflight checks**

Run: `npm run preflight`
Expected: Both lint and typecheck pass

- [ ] **Step 2: Start development server**

Run: `npm start`
Expected: Expo server starts successfully

- [ ] **Step 3: Manual testing checklist**

Test the following on a simulator/device:

**HomeScreen:**
- [ ] App launches successfully
- [ ] "All" tab shows all categories
- [ ] "Favorites" tab shows only favorite categories
- [ ] Swipe between tabs works smoothly
- [ ] Tap tabs to switch works
- [ ] FAB adds category from any tab
- [ ] Edit category works from any tab
- [ ] Delete category works from any tab
- [ ] Toggle favorite works from any tab
- [ ] Active menu closes when switching tabs
- [ ] Refresh control works
- [ ] Dark mode styling looks correct (no haze)

**AllNotesScreen:**
- [ ] App launches successfully
- [ ] "All" tab shows all notes
- [ ] "Recent" tab shows notes from last 7 days
- [ ] "Pinned" tab shows favorite notes
- [ ] "Drafts" tab shows notes without title or content
- [ ] Swipe between tabs works smoothly
- [ ] Tap tabs to switch works
- [ ] FAB adds note from any tab
- [ ] Edit note works from any tab
- [ ] Delete note works from any tab
- [ ] Pin/favorite note works from any tab
- [ ] Move note works from any tab
- [ ] Active menu closes when switching tabs
- [ ] Refresh control works
- [ ] Dark mode styling looks correct (no haze)

- [ ] **Step 4: Verify no console errors**

Check Expo and Metro logs for:
- No red/yellow screens
- No uncaught exceptions
- No navigation errors
- No warnings about unmounted components

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete Material Top Tabs migration for HomeScreen and AllNotesScreen

- Replace custom ScrollView tabs with @react-navigation/material-top-tabs
- Extract CategoryListContent and NotesListContent as dumb components
- Create CategoryTabNavigator with All and Favorites tabs
- Create NotesTabNavigator with All, Recent, Pinned, Drafts tabs
- Move state management and modals to parent screens
- Add React.memo for performance optimization
- Clean up active menus on tab switch
- Maintain FAB and modal visibility across all tabs
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Success Criteria Verification

- [ ] Material Top Tabs installed and working
- [ ] HomeScreen has "All" and "Favorites" tabs with smooth swipe
- [ ] AllNotesScreen has "All", "Recent", "Pinned", "Drafts" tabs with smooth swipe
- [ ] FAB works from any tab in both screens
- [ ] Modals persist and work correctly across tab switches
- [ ] Active menus close when switching tabs
- [ ] Styling matches current design system
- [ ] Dark mode works correctly (no "haze" overlays)
- [ ] Performance is smooth (no lag on tab switch)
- [ ] All CRUD operations work from any tab
- [ ] No TypeScript errors
- [ ] Linting passes
- [ ] Tests pass (if applicable)

---

## Rollback Plan

If issues arise during testing:

```bash
# Reset to before migration started
git log --oneline -10
# Find the commit before Task 1 (install dependencies)
git reset --hard <commit-hash-before-task-1>
# Remove installed packages
npm uninstall @react-navigation/material-top-tabs react-native-pager-view
```

All changes are contained in specific files; no database migrations or API changes required.
