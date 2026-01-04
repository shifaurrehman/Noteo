import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { selectColors } from '@/store/selectors';

const AddNoteScreen = () => {
  const colors = useAppSelector(selectColors);
  const { categoryId, noteId } = useLocalSearchParams<{ categoryId: string; noteId?: string }>();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (noteId) {
      // load note data for editing
    }
  }, [noteId]);

  const handleSave = () => {
    // dispatch redux actions
    router.back(); // closes modal
  };

  const handleCancel = () => router.back();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{noteId ? 'Edit Note' : 'New Note'}</Text>
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16 }}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Note title..."
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
        />
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Note content..."
          placeholderTextColor={colors.textSecondary}
          multiline
          textAlignVertical="top"
          style={[styles.textArea, { backgroundColor: colors.background, color: colors.text }]}
        />
      </ScrollView>

      {/* FOOTER */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.border }]} onPress={handleCancel}>
            <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSave}>
            <Text style={[styles.buttonText, { color: 'white' }]}>{noteId ? 'Confirm' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddNoteScreen;

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  body: { flex: 1 },
  input: { padding: 14, borderRadius: 10, fontSize: 17, marginBottom: 16 },
  textArea: { minHeight: 160, padding: 14, borderRadius: 10, fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#ddd' },
  button: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginHorizontal: 6 },
  buttonText: { fontSize: 16, fontWeight: '700' },
});
