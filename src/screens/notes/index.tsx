import { Header } from "@/components/header/Header";
import { ConfirmationModal } from "@/components/modal/ConfirmationModal";
import { NoteCard } from "@/components/notes/NoteCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createCategoryStyles } from "@/styles/category/Category.styles";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { IconPressable } from "@/components/button/IconPressable";
import {
  selectCategoryById,
  selectNotesByCategory,
} from "@/store/selectors";
import { useTheme } from "@/hooks/useTheme";
import { deleteNote, fetchNotes, updateNote } from "@/store/slices/notesSlice";
import { Note } from "@/types/notes/notes.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@/utilities/routes/Routes";

const NotesScreen = () => {
  const { categoryId, name, isFavorite } = useLocalSearchParams<{ categoryId: string; name?: string; isFavorite?: string }>();
  // selectors
  const category = useAppSelector((state) => (categoryId ? selectCategoryById(state, categoryId) : null));
  const notes = useAppSelector((state) => (categoryId ? selectNotesByCategory(state, categoryId) : []));
  const { colors } = useTheme();
  console.log("NOTES SCREEN: ", "isFavorite note or not..... ", isFavorite);

  // dispatcher and styles
  const dispatch = useAppDispatch();
  const { openAddNote, openEditNote } = useNavigation();
  const styles = createCategoryStyles(colors);

  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const categoryName = name || category?.name || "Notes";

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

  const handleToggleFavorite = (note: Note) => {
    dispatch(updateNote({ id: note.id, updates: { isFavorite: !note.isFavorite } }));
  };

  const handleOpenAddNote = (categoryId: string) => {
    openAddNote(categoryId);
  };
  const handleEditNote = (noteId: string) => {
    openEditNote(categoryId, noteId);
  };

  const renderItem = ({ item }: { item: Note }) => {
    return (
      <NoteCard
        note={item}
        onPress={() => handleEditNote(item.id)}
        onDelete={() => handleDeleteNote(item)}
        onToggleFavorite={() => handleToggleFavorite(item)}
      />
    )
  }

  const emptyContainer = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
        <Text style={styles.emptyText}>No notes yet</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <Header title={categoryName} showSettings={false} onBack={() => router.back()} />

        <View style={styles.content}>
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={renderItem}
            ListEmptyComponent={emptyContainer()}
          />
        </View>

        {/* Floating Add Button */}
        {isFavorite === "true" ? null : (
          <IconPressable
            onPress={() => handleOpenAddNote(categoryId)}
            size={60}
            haptic="heavy"
            backgroundColor={colors.primary}
            pressedColor={colors.primaryPressed}
            style={styles.floatingButton}
          >
            <Text style={styles.floatingButtonText}>+</Text>
          </IconPressable>
        )}

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
}
export default NotesScreen;