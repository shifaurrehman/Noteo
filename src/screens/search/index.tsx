import { ConfirmationModal } from "@/components/modal/ConfirmationModal";
import { SelectionBottomSheet } from "@/components/modal/SelectionBottomSheet";
import { NoteCard } from "@/components/notes/NoteCard";
import { CategoryCard } from "@/components/category/CategoryCard";
import { AddCategoryBottomSheet } from "@/components/category/AddCategoryBottomSheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCategories, selectNotes } from "@/store/selectors";
import { useTheme } from "@/hooks/useTheme";
import { deleteNote, updateNote, deleteNotesByCategory } from "@/store/slices/notesSlice";
import { deleteCategory, updateCategory } from "@/store/slices/categoriesSlice";
import { Note } from "@/types/notes/notes.types";
import { Category } from "@/types/category/category.types";
import { useNavigation } from "@/utilities/routes/Routes";
import responsive, { useResponsive } from "@/utilities/responsive";
import { showErrorToast } from "@/utilities/toast/message-toast";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const SearchScreen: React.FC = () => {
  const router = useRouter();
  const { mode = "notes" } = useLocalSearchParams<{ mode: "notes" | "categories" }>();
  const isNotesMode = mode === "notes";

  const dispatch = useAppDispatch();
  const allNotes = useAppSelector(selectNotes);
  const categories = useAppSelector(selectCategories);
  const { colors, isDark } = useTheme();
  const { openEditNote, viewCategoryNotes } = useNavigation();

  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ type: "note" | "category", id: string } | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [noteToMove, setNoteToMove] = useState<Note | null>(null);
  
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const selectionSheetRef = useRef<BottomSheetModal>(null);
  const categorySheetRef = useRef<BottomSheetModal>(null);

  const { deviceType } = useResponsive();
  const [containerWidth, setContainerWidth] = useState(0);
  const { columns: numColumns, cardWidth, gap, sidePadding } = responsive.getGridLayout(containerWidth, deviceType);
  const cardHeight = cardWidth;

  // Auto-focus the search input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredNotes = useMemo(() => {
    if (!isNotesMode) return [];
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return allNotes.filter(
      (n) =>
        !n.isDeleted &&
        (n.title.toLowerCase().includes(trimmed) ||
          n.content?.toLowerCase().includes(trimmed))
    );
  }, [allNotes, query, isNotesMode]);

  const filteredCategories = useMemo(() => {
    if (isNotesMode) return [];
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return categories.filter((c) => c.name.toLowerCase().includes(trimmed));
  }, [categories, query, isNotesMode]);

  const confirmDelete = useCallback(() => {
    if (deleteTarget?.type === "note") {
      dispatch(deleteNote(deleteTarget.id));
    } else if (deleteTarget?.type === "category") {
      dispatch(deleteNotesByCategory(deleteTarget.id));
      dispatch(deleteCategory(deleteTarget.id));
    }
    setDeleteTarget(null);
  }, [dispatch, deleteTarget]);

  const handleToggleFavorite = useCallback(
    (note: Note) => {
      dispatch(updateNote({ id: note.id, updates: { isFavorite: !note.isFavorite } }));
    },
    [dispatch]
  );

  const handleEditNote = useCallback(
    (note: Note) => {
      openEditNote(note.categoryId, note.id);
    },
    [openEditNote]
  );

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

  const handleSaveEditedCategory = useCallback(({ name, color, icon }: { name: string; color: string; icon: string }) => {
    if (!editCategory) return;
    const isUnchanged = editCategory.name === name && editCategory.color === color && editCategory.icon === icon;
    if (isUnchanged) {
        showErrorToast({ message: "Nothing to update!" });
        return;
    }
    dispatch(
        updateCategory({
            id: editCategory.id,
            updates: { name, color, icon, updatedAt: new Date().toISOString() },
        })
    );
    setEditCategory(null);
    setShowCategoryModal(false);
    categorySheetRef.current?.dismiss();
  }, [dispatch, editCategory]);

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        id: cat.id,
        label: cat.name,
        icon: (cat.icon || "folder") as any,
      })),
    [categories]
  );

  const renderNoteItem = useCallback(
    ({ item }: { item: Note }) => {
      const category = categories.find((c) => c.id === item.categoryId);
      return (
        <NoteCard
          note={item}
          onPress={() => {
            setActiveMenuId(null);
            handleEditNote(item);
          }}
          onEdit={() => handleEditNote(item)}
          onDelete={() => setDeleteTarget({ type: "note", id: item.id })}
          onPin={() => handleToggleFavorite(item)}
          onMove={() => handleMoveNote(item)}
          isMenuVisible={activeMenuId === item.id}
          onToggleMenu={() =>
            setActiveMenuId(activeMenuId === item.id ? null : item.id)
          }
          categoryName={category?.name}
          categoryColor={category?.color}
        />
      );
    },
    [
      categories,
      activeMenuId,
      handleEditNote,
      handleToggleFavorite,
      handleMoveNote,
    ]
  );

  const renderCategoryItem = useCallback(
    ({ item, index }: { item: Category; index: number }) => {
      const isLastInRow = (index + 1) % numColumns === 0;
      const noteCount = allNotes.filter((n) => n.categoryId === item.id && !n.isDeleted).length;

      return (
        <CategoryCard
          category={item}
          onPress={() => {
            setActiveMenuId(null);
            viewCategoryNotes({ categoryId: item.id, categoryName: item.name, isFavorite: item.isFavorite });
          }}
          onEdit={() => {
            setEditCategory(item);
            setShowCategoryModal(true);
            categorySheetRef.current?.present();
          }}
          onDelete={() => setDeleteTarget({ type: "category", id: item.id })}
          onFavorite={() => dispatch(updateCategory({ id: item.id, updates: { isFavorite: !item.isFavorite } }))}
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
    [allNotes, numColumns, cardWidth, cardHeight, gap, activeMenuId, viewCategoryNotes, dispatch]
  );

  const renderEmpty = () => {
    const hasQuery = query.trim().length > 0;

    if (!hasQuery) {
      return (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconWrap, { backgroundColor: isDark ? "#1C1E3A" : colors.surface }]}>
            <Ionicons name="search" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textMain }]}>
            {isNotesMode ? "Search your notes" : "Search categories"}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {isNotesMode ? "Type above to search by title or content" : "Type above to search by name"}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={[styles.emptyIconWrap, { backgroundColor: isDark ? "#1C1E3A" : colors.surface }]}>
          <Ionicons name={isNotesMode ? "document-text-outline" : "folder-outline"} size={36} color={colors.textSecondary} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.textMain }]}>
          {isNotesMode ? "No notes found" : "No categories found"}
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          {isNotesMode ? `No notes matched "${query.trim()}"` : `No categories matched "${query.trim()}"`}
        </Text>
      </View>
    );
  };

  const currentData = isNotesMode ? filteredNotes : filteredCategories;
  const resultCount = currentData.length;
  const showCount = query.trim().length > 0;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => setActiveMenuId(null)}
        accessible={false}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: isDark ? "#ffffff08" : colors.border + "30" }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.5 : 1 }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={26} color={colors.textMain} />
          </Pressable>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark ? "#1C1E3A" : colors.surface,
                borderColor: isDark ? "#ffffff15" : colors.border + "50",
              },
            ]}
          >
            <Ionicons name="search-outline" size={17} color={colors.textSecondary} />
            <TextInput
              ref={inputRef}
              style={[styles.input, { color: colors.textMain }]}
              placeholder={isNotesMode ? "Search notes..." : "Search categories..."}
              placeholderTextColor={colors.textSecondary}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
              accessibilityLabel="Search input"
            />
            {query.length > 0 && (
              <Pressable
                onPress={() => setQuery("")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              >
                <Ionicons name="close-circle" size={17} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Result count badge */}
        {showCount && (
          <View style={styles.countRow}>
            <Text style={[styles.countText, { color: colors.textSecondary }]}>
              {resultCount === 0
                ? "No results"
                : `${resultCount} result${resultCount === 1 ? "" : "s"}`}
            </Text>
          </View>
        )}

        {/* Results */}
        <View 
            style={{ flex: 1 }} 
            onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
        >
            <FlashList
            data={currentData as any[]}
            keyExtractor={(item) => item.id}
            renderItem={isNotesMode ? renderNoteItem : (renderCategoryItem as any)}
            estimatedItemSize={isNotesMode ? 180 : cardHeight}
            numColumns={isNotesMode ? 1 : numColumns}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={[
                styles.listContent, 
                !isNotesMode && { paddingHorizontal: sidePadding }
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={() => setActiveMenuId(null)}
            />
        </View>

        {/* Delete Modal */}
        <ConfirmationModal
          visible={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          title={deleteTarget?.type === "note" ? "Delete Note?" : "Delete Category?"}
          message={
            deleteTarget?.type === "note"
              ? "Are you sure you want to delete this note? This action cannot be undone."
              : "Are you sure you want to delete this category? All associated notes will also be deleted."
          }
          confirmText="Delete"
          type="danger"
        />

        {/* Move Note Sheet */}
        <SelectionBottomSheet
          ref={selectionSheetRef}
          title="Move Note"
          description="Select a category to move this note to."
          options={categoryOptions}
          selectedValue={noteToMove?.categoryId || ""}
          onSelect={handleSelectCategory}
          colors={colors}
        />

        {/* Edit Category Sheet */}
        <AddCategoryBottomSheet
          ref={categorySheetRef}
          visible={showCategoryModal}
          onClose={() => {
              setEditCategory(null);
              setShowCategoryModal(false);
          }}
          onSave={handleSaveEditedCategory}
          initialValue={editCategory?.name}
          initialColor={editCategory?.color}
          initialIcon={editCategory?.icon}
        />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    padding: 0,
  },
  countRow: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 2,
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  listContent: {
    paddingTop: 14,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 14,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

export default SearchScreen;
