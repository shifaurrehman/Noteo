import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "@/store/hooks";
import { selectColors } from "@/store/selectors";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  initialTitle?: string;
  initialContent?: string;
  isEdit?: boolean;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTitle = "",
  initialContent = "",
  isEdit = false,
}) => {
  const colors = useAppSelector(selectColors);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setContent(initialContent);
    }
  }, [visible, initialTitle, initialContent]);

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave(title, content);
      setTitle("");
      setContent("");
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* DARK OVERLAY */}
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* ACTUAL SHEET */}
      <SafeAreaView style={[styles.sheet, { backgroundColor: colors.surface }]}>
        {/* HEADER */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isEdit ? "Edit Note" : "New Note"}
          </Text>

          <TouchableOpacity onPress={handleCancel}>
            <Ionicons name="close" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* SCROLLING CONTENT – RESIZES AUTO WITH KEYBOARD */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Note title…"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
          />

          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Note content…"
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
            style={[styles.textArea, { backgroundColor: colors.background, color: colors.text }]}
          />
        </ScrollView>

        {/* FIXED FOOTER — NEVER MOVES */}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleCancel}
              style={[styles.button, { backgroundColor: colors.border }]}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.buttonText, { color: "white" }]}>{isEdit ? "Confirm" : "Save"}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "92%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },

  body: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    fontSize: 17,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 160,
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "transparent",
  },

  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
