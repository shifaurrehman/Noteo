import { ConfirmationModal } from "@/components/modal/ConfirmationModal";
import { NoteCard } from "@/components/notes/NoteCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectNotes, selectNotesLoading } from "@/store/selectors";
import { useTheme } from "@/hooks/useTheme";
import { deleteNote, fetchNotes, updateNote } from "@/store/slices/notesSlice";
import { Note } from "@/types/notes/notes.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@/utilities/routes/Routes";
import { SearchBar } from "@/components/searchbar/SearchBar";
import { Header } from "@/components/header/Header";

type FilterTab = "all" | "recent" | "pinned" | "drafts";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All Notes" },
  { key: "recent", label: "Recent" },
  { key: "pinned", label: "Pinned" },
  { key: "drafts", label: "Drafts" },
];

const AllNotesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const allNotes = useAppSelector(selectNotes);
  const isLoading = useAppSelector(selectNotesLoading);
  const { colors } = useTheme();
  const { openEditNote } = useNavigation();

  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const renderItem = ({ item }: { item: Note }) => (
    <NoteCard
      note={item}
      onPress={() => handleEditNote(item)}
      onDelete={() => handleDeleteNote(item)}
      onToggleFavorite={() => handleToggleFavorite(item)}
    />
  );

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
      />
    )
  }, [isLoading, colors.primary, dispatch])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <Header title={"Notes"} backgroundColor={colors.background} titleStyle={{ color: colors.primary, textAlign: "left" }} />
      <View style={styles.container}>

        {/* search bar */}
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder={"Search notes..."}
          colors={{
            surface: colors.surface,
            textMain: colors.textMain,
            textSecondary: colors.textSecondary,
            border: colors.border,
            primary: colors.primary,
          }}
        />

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsWrapper}
          contentContainerStyle={styles.tabsContent}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveFilter(tab.key)}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: isActive ? colors.primary : "transparent",
                    borderColor: isActive ? colors.primary : colors.border + "80",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    { color: isActive ? "#fff" : colors.textSecondary },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Notes List */}
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl()}
        />

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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  tabsWrapper: {
    marginBottom: 8,
    marginTop: 10,
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  filterTab: {
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  listContainer: {
    paddingTop: 8,
    paddingBottom: 100,
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
