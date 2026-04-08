import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { selectNoteById } from '@/store/selectors';
import { useTheme } from '@/hooks/useTheme';
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
  const { colors } = useTheme();
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
    if (!validateNote()) return;
    const newNote = createNewNote({title, content, categoryId});
    dispatch(addNote(newNote));
    router.back();
  };
  const handleUpdateNote = () => {
    if (!noteId || !validateNote()) return;
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>{noteId ? 'Edit Note' : 'New Note'}</Text>
        <IconPressable
          onPress={handleCancel}
          size={26}
          haptic="medium"
          backgroundColor={colors.iconBg}
          pressedColor={colors.iconBgPressed}
        >
          <Ionicons name="close" size={26} color={colors.textMain} />
        </IconPressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={styles.keyboardContainer}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TextInput
            ref={titleInputRef}
            value={title}
            onChangeText={setTitle}
            placeholder="Title..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { backgroundColor: colors.surface, color: colors.textMain, borderColor: colors.border }]}
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
            style={[styles.textArea, { backgroundColor: colors.surface, color: colors.textMain, borderColor: colors.border }]}
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
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    fontSize: 17,
    marginBottom: 16,
    borderWidth: 1,
  },
  textArea: {
    height: height / 2,
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 10,
  },
});
