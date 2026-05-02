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
