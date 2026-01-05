import React, { useEffect, useState, memo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "@/store/hooks";
import { selectColors } from "@/store/selectors";
import { IconPressable } from "../button/IconPressable";
import { Colors } from "@/constants/theme";

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialValue?: string;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = memo(({
  visible,
  onClose,
  onSave,
  initialValue,
}) => {
  const colors = useAppSelector(selectColors);
  const [name, setName] = useState("");

  useEffect(() => {
    if (visible) {
      setName(initialValue || "");
    }
  }, [visible, initialValue]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      onSave(trimmedName);
      setName("");
      onClose();
    }
  };

  const isInvalid = name.trim().length === 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide" // Slide feels more "native" for bottom sheets
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={[styles.sheet, { backgroundColor: colors.cardBg }]}>
                {/* Handle Bar for Visual Polish */}
                <View style={[styles.handle, { backgroundColor: colors.border }]} />

                <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.text }]}>
                    {initialValue ? "Edit Category" : "New Category"}
                  </Text>
                  <IconPressable
                    onPress={onClose}
                    size={25}
                    haptic="heavy"
                    pressedColor={colors.iconBgPressed}
                    backgroundColor={colors.iconBg}
                  >
                    <Ionicons name="close" size={25} color={colors.textSecondary} />
                  </IconPressable>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>NAME</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        backgroundColor: colors.background,
                        borderColor: name.length > 0 ? colors.primary : colors.border
                      }
                    ]}
                    placeholder="e.g. Personal, Work, Ideas..."
                    placeholderTextColor={colors.textSecondary + '70'}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    maxLength={25}
                    onSubmitEditing={handleSave}
                  />
                  <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                    {name.length}/25
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    { backgroundColor: isInvalid ? colors.border : colors.primary }
                  ]}
                  onPress={handleSave}
                  disabled={isInvalid}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>
                    {initialValue ? "Update Category" : "Create Category"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Darker for better focus
    justifyContent: "flex-end",
  },
  keyboardView: {
    width: "100%",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24, // Extra padding for iOS home indicator
    width: "100%",
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    // marginBottom: 20,
    opacity: 0.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    // backgroundColor: "red",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    fontWeight: '500',
  },
  charCount: {
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
    marginRight: 4,
  },
  saveButton: {
    height: 56,
    borderRadius: 56 / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});