import { Header } from "@/components/header/Header";
import { NoteCard } from "@/components/notes/NoteCard";
import { createCategoryStyles } from "@/styles/category/Category.styles";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  selectCategoryById,
  selectColors,
  selectNotesByCategory,
} from "@/store/selectors";
import { deleteNote, loadNotes, updateNote } from "@/store/slices/notesSlice";
import { Note } from "@/types/notes/notes.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconPressable } from "@/components/button/IconPressable";

const NotesScreen = () => {
  const { categoryId, name, isFavorite } = useLocalSearchParams<{ categoryId: string; name?: string; isFavorite?: string }>();
  // selectors
  const category = useAppSelector((state) => (categoryId ? selectCategoryById(state, categoryId) : null));
  const notes = useAppSelector((state) => (categoryId ? selectNotesByCategory(state, categoryId) : []));
  const colors = useAppSelector(selectColors);
  console.log("NOTES SCREEN: ","isFavorite note or not..... ", isFavorite);

  // dispatcher and styles
  const dispatch = useAppDispatch();
  const styles = createCategoryStyles(colors);

  const categoryName = name || category?.name || "Notes";

  useEffect(() => {
    dispatch(loadNotes());
  }, [dispatch]);

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

  const handleToggleFavorite = (note: Note) => {
    dispatch(updateNote({ id: note.id, updates: { isFavorite: !note.isFavorite } }));
  };

  const handleOpenAddNote = (categoryId: string) => {
    router.push(`/home/notes/${categoryId}/addNote`);
  };
  const editNote = (noteId: string) => {
    router.push(`/home/notes/${categoryId}/addNote?noteId=${noteId}`);
  };

  const renderItem = ({ item }: { item: Note }) => {
    return (
      <NoteCard
        note={item}
        onPress={() => editNote(item.id)}
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
      </View>
    </SafeAreaView>
  );
}
export default NotesScreen;