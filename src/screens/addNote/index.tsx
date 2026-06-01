import { IconPressable } from '@/components/button/IconPressable';
import { NoteEditingToolbar } from '@/components/notes/NoteEditingToolbar';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { selectCategoryById, selectIsAuthenticated, selectNoteById } from '@/store/selectors';
import { addNote, updateNote } from '@/store/slices/notesSlice';
import { createNewNote } from '@/utilities/notes';
import { showValidationToast } from '@/utilities/toast';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { RichEditor } from 'react-native-pell-rich-editor';

const { height } = Dimensions.get('window');

const AddNoteScreen = () => {
  const { categoryId, noteId } = useLocalSearchParams<{ categoryId?: string; noteId?: string }>();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const note = useAppSelector(state => noteId ? selectNoteById(state, noteId) : undefined);
  const category = useAppSelector(state => categoryId ? selectCategoryById(state, categoryId) : undefined);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isEditMode = Boolean(noteId);

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isFavorite, setIsFavorite] = useState(note?.isFavorite || false);

  const hasChanges = isEditMode
    ? title.trim() !== (note?.title ?? '').trim() ||
    content.trim() !== (note?.content ?? '').trim() ||
    isFavorite !== note?.isFavorite
    : true;

  // Refs for TextInputs
  const titleInputRef = useRef<TextInput>(null);
  const richTextRef = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);

  // Autofocus logic
  useEffect(() => {
    if (isEditMode) {
      richTextRef.current?.focusContentEditor();
    } else {
      titleInputRef.current?.focus();
    }
  }, [isEditMode]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsFavorite(note.isFavorite || false);
    }
  }, [note]);

  const validateNote = () => {
    if (!content.trim() && !title.trim()) {
      showValidationToast("Note cannot be empty");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateNote()) return;

    if (isEditMode) {
      if (!hasChanges) {
        router.back();
        return;
      }
      dispatch(updateNote({
        id: noteId!,
        updates: { title, content, isFavorite }
      }));
    } else {
      const newNote = createNewNote({ title, content, categoryId });
      const noteWithLocalFlag = {
        ...newNote,
        isLocal: !isAuthenticated,
        isFavorite
      };
      dispatch(addNote(noteWithLocalFlag));
    }
    router.back();
  };

  const handleBack = () => router.back();
  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const editedTime = useMemo(() => {
    const date = note?.updatedAt ? new Date(note.updatedAt) : new Date();
    return moment(date).format('DD-MM-YYYY hh:mm A');
  }, [note]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <IconPressable onPress={handleBack} size={28}>
          <Ionicons name="arrow-back" size={26} color={colors.textMain} />
        </IconPressable>

        <View style={styles.headerRight}>
          <IconPressable onPress={toggleFavorite} size={28}>
            <Image
              source={isFavorite
                ? require('@/assets/images/pin-filled.png')
                : require('@/assets/images/pin-empty.png')
              }
              style={{ width: 22, height: 22, tintColor: colors.primary }}
              resizeMode="contain"
            />
          </IconPressable>
          <IconPressable size={28}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.textMain} />
          </IconPressable>
        </View>
      </View>

      {/* META INFO ROW */}
      <View style={styles.metaRow}>
        <View style={styles.flexRow}>
          <Text style={[styles.editedText, { color: colors.textSecondary }]}>
            Edited: {editedTime}
          </Text>
        </View>
        {category && (
          <View style={styles.categoryBadge}>
            <View style={[styles.categoryDot, { backgroundColor: category.color || colors.primary }]} />
            <Text style={[styles.categoryName, { color: colors.textSecondary }]}>{category.name}</Text>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
        style={styles.flexOne}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <TextInput
            ref={titleInputRef}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, styles.titleInput, { backgroundColor: colors.surface, color: colors.textMain, borderColor: colors.border }]}
            multiline
          />
          <View style={styles.contentInputContainer}>
            <RichEditor
              ref={richTextRef}
              initialContentHTML={content}
              // @ts-ignore: Type definitions for onChange in this version might be incorrect
              onChange={(html: string) => setContent(html)}
              placeholder="Start typing..."
              autoCorrect={false}
              spellCheck={false}
              useCharacter={false}
              onCursorPosition={(scrollY: number) => {
                // Adjust scroll position when typing to keep cursor visible
                scrollRef.current?.scrollTo({ y: scrollY - 30, animated: true });
              }}
              editorInitializedCallback={() => {
                richTextRef.current?.commandDOM(`
                  document.body.setAttribute('spellcheck', 'false');
                  document.body.setAttribute('autocorrect', 'off');
                  document.body.setAttribute('autocapitalize', 'off');
                  document.body.setAttribute('autocomplete', 'off');
                  
                  // Disable spellcheck on all elements to prevent system underlines
                  var all = document.querySelectorAll('*');
                  for (var i = 0; i < all.length; i++) {
                    all[i].setAttribute('spellcheck', 'false');
                    all[i].setAttribute('autocorrect', 'off');
                  }

                  var editor = document.getElementById('editor');
                  if (editor) {
                    editor.setAttribute('spellcheck', 'false');
                    editor.setAttribute('autocorrect', 'off');
                    editor.style.outline = 'none';
                    editor.style.webkitTapHighlightColor = 'transparent';
                  }
                `);
              }}
              editorStyle={{
                backgroundColor: colors.surface,
                color: colors.textMain,
                placeholderColor: colors.textSecondary,
                contentCSSText: `
                  font-size: 16px; 
                  font-family: sans-serif; 
                  line-height: 1.5;
                  -webkit-spellcheck: false;
                `,
                cssText: `
                  * { -webkit-spellcheck: false; spellcheck: false; }
                  [contenteditable] { -webkit-tap-highlight-color: transparent; outline: none; }
                `,
              }}
              style={[styles.input, styles.contentInput, { backgroundColor: colors.surface, borderColor: colors.border, padding: 0 }]}
            />
          </View>
        </ScrollView>

        {/* BOTTOM EDITING BAR */}
        <NoteEditingToolbar 
          onSave={handleSave} 
          editorRef={richTextRef}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
  },
  editedText: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    flex: 1,
    minHeight: height / 2.5,
  },
  contentInputContainer: {
    flex: 1,
    minHeight: height / 2.5,
  },
});
