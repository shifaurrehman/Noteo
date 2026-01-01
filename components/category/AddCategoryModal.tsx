import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "@/store/hooks";
import { selectColors } from "@/store/selectors";

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialValue?: string;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  visible,
  onClose,
  onSave,
  initialValue,
}) => {
  console.log("initialvaalue: ", initialValue);

  const colors = useAppSelector(selectColors);
  const [name, setName] = useState("");

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      onSave(trimmedName);
      setName("");
      onClose();
    }
  };

  useEffect(() => {
    if (visible) {
      setName(initialValue || "");
    }
  }, [visible, initialValue]);

  const handleCancel = () => {
    setName("");
    onClose();
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.21)",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      width: "85%",
      padding: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
    },
    button: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    cancelButton: {
      backgroundColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    cancelButtonText: {
      color: colors.text,
    },
    saveButtonText: {
      color: "#FFFFFF",
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleCancel}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>New Category</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                  <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Category name..."
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoFocus
                onSubmitEditing={handleSave}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                  <Text style={[styles.buttonText, styles.saveButtonText]}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};
