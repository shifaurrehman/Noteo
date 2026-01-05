import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { selectColors, selectNoteById } from '@/store/selectors';
import { IconPressable } from '@/components/button/IconPressable';
import { AppButton } from '@/components/button/AppButton';
import { createNewNote } from '@/utilities/notes';
import { useDispatch } from 'react-redux';
import { addNote, updateNote } from '@/store/slices/notesSlice';
import { showValidationToast } from '@/utilities/toast';
const { height } = Dimensions.get('window');
const AddNoteScreen = () => {
  const { categoryId, noteId } = useLocalSearchParams<{ categoryId: string; noteId?: string }>();
  const dispatch = useDispatch();
  const colors = useAppSelector(selectColors);
  const user = useAppSelector((state) => state.auth.user);
  const note = useAppSelector(state => noteId ? selectNoteById(state, noteId) : undefined);
  const isEditMode = Boolean(noteId);

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const hasChanges = isEditMode ? title.trim() !== (note?.title ?? '').trim() || content.trim() !== (note?.content ?? '').trim() : true;

  // Refs for TextInputs
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  // Autofocus logic
  useEffect(() => {
    if (isEditMode) {
      contentInputRef.current?.focus();
    } else {
      titleInputRef.current?.focus();
    }
  }, [isEditMode]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const validateNote = () => {
    if (!content.trim()) {
      showValidationToast("Note content is required");
      return false;
    }
    return true;
  };

  const handleCreateNote = () => {
    if (!user || !validateNote()) return;
    const newNote = createNewNote(title, content, categoryId, user.id);
    dispatch(addNote(newNote));
    router.back();
  };
  const handleUpdateNote = () => {
    if (!user || !noteId || !validateNote()) return;
    if (!hasChanges) {
      showValidationToast("No changes detected");
      return;
    }
    dispatch(updateNote({
      id: noteId,
      updates: {
        title,
        content,
      }
    }));
    router.back();
  };

  const handleCancel = () => router.back();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{noteId ? 'Edit Note' : 'New Note'}</Text>
        <IconPressable
          onPress={handleCancel}
          size={26}
          haptic="medium"
          backgroundColor={colors.iconBg}
          pressedColor={colors.iconBgPressed}
        >
          <Ionicons name="close" size={26} color={colors.text} />
        </IconPressable>
      </View>

      <TextInput
        ref={titleInputRef}
        value={title}
        onChangeText={setTitle}
        placeholder="Title..."
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
        autoFocus={true}
      />
      <TextInput
        ref={contentInputRef}
        value={content}
        onChangeText={setContent}
        placeholder="Write your note here..."
        placeholderTextColor={colors.textSecondary}
        multiline
        textAlignVertical="top"
        textAlign="left"
        style={[styles.textArea, { backgroundColor: colors.background, color: colors.text }]}
      />

      <View style={styles.footer}>
        <AppButton
          title="Cancel"
          variant="secondary"
          onPress={handleCancel}
          haptic="medium"
          colors={colors}
        />

        <AppButton
          title={isEditMode ? "Update" : "Save"}
          variant="primary"
          onPress={isEditMode ? handleUpdateNote : handleCreateNote}
          haptic="medium"
          colors={colors}
        />
      </View>

    </SafeAreaView>
  );
};

export default AddNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700'
  },
  input: {
    padding: 14,
    borderRadius: 10,
    fontSize: 17,
    marginBottom: 16
  },
  textArea: {
    height: height / 2,
    padding: 14,
    borderRadius: 10,
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
});
