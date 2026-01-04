import { Header } from "@/components/header/Header";
import { NoteCard } from "@/components/notes/NoteCard";
import { createCategoryStyles } from "@/styles/category/Category.styles";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  selectCategoryById,
  selectColors,
  selectNotesByCategory,
  selectNotesError,
  selectNotesLoading,
  selectUser,
} from "@/store/selectors";
import { addNote, deleteNote, loadNotes, updateNote } from "@/store/slices/notesSlice";
import { Note } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNewNote } from "@/utilities/notes";
import { ShimmerNotesGrid } from "@/components/shimmer/notes/ShimmerNoteGrid";

const NotesScreen = () => {
  const { categoryId, name, isFavorite } = useLocalSearchParams<{ categoryId: string; name?: string; isFavorite?: string }>();
  // selectors
  const category = useAppSelector((state) => (categoryId ? selectCategoryById(state, categoryId) : null));
  const notes = useAppSelector((state) => (categoryId ? selectNotesByCategory(state, categoryId) : []));
  const loading = useAppSelector(selectNotesLoading);
  const error = useAppSelector(selectNotesError);
  const colors = useAppSelector(selectColors);
  const user = useAppSelector(selectUser);
  console.log("isFavorite note or not..... ", isFavorite);

  // useStates
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  // dispatcher and styles
  const dispatch = useAppDispatch();
  const styles = createCategoryStyles(colors);

  const categoryName = name || category?.name || "Notes";

  useEffect(() => {
    dispatch(loadNotes());
  }, [dispatch]);

  const handleAddNote = (title: string, content: string) => {
    if (categoryId && user?.id) {
      const newNote = createNewNote(title, content, categoryId, user.id);
      dispatch(addNote(newNote));
    } else {
      console.warn("failedd to create the note because category id not found...");
    }
  };

  const handleDeleteNote = (note: Note) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(deleteNote(note.id));
        },
      },
    ]);
  };

  const handleNotePress = (note: Note) => {
    setSelectedNote(note);
    setShowAddModal(true);
  };
  const handleOpenAddNote = (categoryId: string) => {
    router.push(`/home/notes/${categoryId}/addNote`);
  };
  const handleEditNote = (note: Note) => {
    router.push(`/home/notes/${categoryId}/addNote?noteId=${note.id}`);
  };



  const handleSaveNote = async (title: string, content: string) => {
    if (selectedNote) {
      // Update existing note
      dispatch(
        updateNote({
          id: selectedNote.id,
          updates: { title, content },
        })
      );
    } else {
      // Add new note
      await handleAddNote(title, content);
    }
    setSelectedNote(null);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedNote(null);
  };

  const handleOpenModal = () => {
    setSelectedNote(null);
    setShowAddModal(true);
  };

  const renderItem = ({ item }: { item: Note }) => {
    return (
      <NoteCard
        note={item}
        onPress={() => handleNotePress(item)}
        onDelete={() => handleDeleteNote(item)}
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
          {loading ? (
            <ShimmerNotesGrid />
          ) : (
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              renderItem={renderItem}
              ListEmptyComponent={emptyContainer()}
            />
          )}
        </View>

        {/* Floating Add Button */}
        {isFavorite === "true" ? null : (
        <TouchableOpacity style={styles.floatingButton} onPress={() => handleOpenAddNote(categoryId)} activeOpacity={0.8}>
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
export default NotesScreen;