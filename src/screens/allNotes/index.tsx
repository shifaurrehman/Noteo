import { ConfirmationModal } from "@/components/modal/ConfirmationModal";
import { NoteCard } from "@/components/notes/NoteCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectNotes, selectNotesLoading, selectCategories } from "@/store/selectors";
import { useTheme } from "@/hooks/useTheme";
import { deleteNote, fetchNotes, updateNote } from "@/store/slices/notesSlice";
import { Note } from "@/types/notes/notes.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@/utilities/routes/Routes";
import { SearchBar } from "@/components/searchbar/SearchBar";
import { IconPressable } from "@/components/button/IconPressable";
import { commonStyles } from "@/styles/global";
import { SelectionBottomSheet } from "@/components/modal/SelectionBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type FilterTab = "all" | "recent" | "pinned" | "drafts";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "recent", label: "Recent" },
  { key: "pinned", label: "Pinned" },
  { key: "drafts", label: "Drafts" },
];

const AllNotesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const allNotes = useAppSelector(selectNotes);
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectNotesLoading);
  const { colors } = useTheme();
  const isDarkMode = colors.background === "#101122";
  const { openEditNote, openAddNote } = useNavigation();

  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeNoteMenuId, setActiveNoteMenuId] = useState<string | null>(null);
  const [noteToMove, setNoteToMove] = useState<Note | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Search bar animation
  const animatedSearchStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isSearchVisible ? 70 : 0, { duration: 300 }),
      opacity: withTiming(isSearchVisible ? 1 : 0, { duration: 250 }),
      transform: [
        { translateY: withTiming(isSearchVisible ? 0 : -20, { duration: 300 }) }
      ],
      overflow: 'hidden',
    };
  });

  const lastScrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const diff = currentY - lastScrollY.value;

      if (Math.abs(diff) < 5) return;

      // Hide when scrolling down beyond threshold
      if (diff > 0 && currentY > 150 && isSearchVisible && searchText === "") {
        runOnJS(setIsSearchVisible)(false);
      } 
      // Only reveal when pulling down at the very top
      else if (currentY <= 0 && diff < -10 && !isSearchVisible) {
        runOnJS(setIsSearchVisible)(true);
      }

      lastScrollY.value = currentY;
    },
  }, [isSearchVisible, searchText]);

  const selectionSheetRef = React.useRef<BottomSheetModal>(null);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const filteredNotes = useMemo(() => {
    let notes = allNotes.filter((n) => !n.isDeleted);

    // Apply filter tab
    if (activeFilter === "recent") {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 7);
      notes = notes.filter((n) => new Date(n.updatedAt ?? n.createdAt) >= oneDayAgo);
      notes = [...notes].sort(
        (a, b) =>
          new Date(b.updatedAt ?? b.createdAt).getTime() - new Date(a.updatedAt ?? a.createdAt).getTime()
      );
    } else if (activeFilter === "pinned") {
      notes = notes.filter((n) => n.isFavorite);
    } else if (activeFilter === "drafts") {
      // Drafts = notes with no content or title
      notes = notes.filter((n) => !n.content?.trim() || !n.title?.trim());
    } else {
      // All – sort most recent first
      notes = [...notes].sort(
        (a, b) =>
          new Date(b.updatedAt ?? b.createdAt).getTime() - new Date(a.updatedAt ?? a.createdAt).getTime()
      );
    }

    // Apply search
    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(lower) ||
          n.content?.toLowerCase().includes(lower)
      );
    }

    return notes;
  }, [allNotes, activeFilter, searchText]);

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

  const handleCreateNote = useCallback(() => {
    openAddNote();
  }, [openAddNote]);

  const handleMoveNote = useCallback((note: Note) => {
    setNoteToMove(note);
    selectionSheetRef.current?.present();
  }, []);

  const handleSelectCategory = useCallback((categoryId: string) => {
    if (noteToMove) {
      dispatch(updateNote({ id: noteToMove.id, updates: { categoryId } }));
      setNoteToMove(null);
    }
  }, [dispatch, noteToMove]);

  const categoryOptions = useMemo(() => {
    return categories.map(cat => ({
      id: cat.id,
      label: cat.name,
      icon: (cat.icon || 'folder') as any
    }));
  }, [categories]);

  const renderItem = ({ item }: { item: Note }) => {
    const category = categories.find(c => c.id === item.categoryId);
    
    return (
      <NoteCard
        note={item}
        onPress={() => {
          setActiveNoteMenuId(null);
          handleEditNote(item);
        }}
        onEdit={() => handleEditNote(item)}
        onDelete={() => handleDeleteNote(item)}
        onPin={() => handleToggleFavorite(item)}
        onMove={() => handleMoveNote(item)}
        isMenuVisible={activeNoteMenuId === item.id}
        onToggleMenu={() => setActiveNoteMenuId(activeNoteMenuId === item.id ? null : item.id)}
        categoryName={category?.name}
        categoryColor={category?.color}
      />
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.textMain }]}>
        {searchText ? "No notes found" : "No notes yet"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchText
          ? "Try a different search or filter"
          : "Start by adding a note to any category"}
      </Text>
    </View>
  );

  const refreshControl = useCallback(() => {
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchNotes())}
        tintColor={colors.primary}
        colors={[colors.primary]}
        progressBackgroundColor={colors.surface}
      />
    )
  }, [isLoading, colors.primary, colors.surface, dispatch])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <Pressable 
        style={{ flex: 1 }} 
        onPress={() => setActiveNoteMenuId(null)}
        accessible={false}
      >
        <View style={styles.mainHeader}>
          <Text style={[styles.mainTitle, { color: colors.textMain }]}>Notes</Text>
          <View style={styles.headerRight}>
            <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
              {allNotes.length} items
            </Text>
            <Pressable 
              onPress={() => setIsSearchVisible(!isSearchVisible)}
              style={({ pressed }) => [
                styles.searchIconBtn,
                { opacity: pressed ? 0.6 : 1 }
              ]}
            >
              <Ionicons 
                name={isSearchVisible ? "close" : "search"} 
                size={22} 
                color={colors.textSecondary} 
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.container}>
          {/* Filter Tabs */}
          <View style={styles.tabsWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContent}
            >
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => {
                      setActiveNoteMenuId(null);
                      setActiveFilter(tab.key);
                    }}
                    style={styles.filterTab}
                  >
                    <Text
                      style={[
                        styles.filterTabText,
                        { 
                          color: isActive ? colors.primary : colors.textSecondary,
                          fontWeight: isActive ? "800" : "600"
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                    {isActive && (
                      <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Animated Search Bar */}
          <Animated.View style={animatedSearchStyle}>
            <View style={styles.searchContainer}>
              <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                placeholder={"Search notes..."}
                colors={{
                  surface: isDarkMode ? "#1C1E3A" : colors.surface,
                  textMain: colors.textMain,
                  textSecondary: colors.textSecondary,
                  border: "transparent",
                  primary: colors.primary,
                }}
              />
            </View>
          </Animated.View>

          {/* Notes List */}
          <Animated.FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl()}
            onScroll={onScroll}
            scrollEventThrottle={16}
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

          {/* Delete Confirmation Modal */}
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

          {/* Move Note Modal */}
          <SelectionBottomSheet
            ref={selectionSheetRef}
            title="Move Note"
            description="Select a category to move this note to."
            options={categoryOptions}
            selectedValue={noteToMove?.categoryId || ""}
            onSelect={handleSelectCategory}
            colors={colors}
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
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
  tabsWrapper: {
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  tabsContent: {
    paddingHorizontal: 24,
    gap: 28,
  },
  filterTab: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  filterTabText: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 3,
    borderRadius: 3,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
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

export default AllNotesScreen;
