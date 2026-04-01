import React, { useCallback, useEffect, useMemo, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { IconPressable } from "../button/IconPressable";
import { showInfoToast } from "@/utilities/toast/message-toast";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialValue?: string;
}

export const AddCategoryBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ visible, onClose, onSave, initialValue }, ref) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ["45%", "90%"], []);

    const [name, setName] = React.useState("");
    const inputRef = React.useRef<any>(null);

    console.log("=== AddCategoryBottomSheet rendered ===");
    console.log("Props - visible:", visible, "initialValue:", initialValue);
    console.log("Bottom sheet ref:", ref);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    const handleClose = useCallback(() => {
      setName("");
      onClose();
      (ref as any)?.current?.dismiss();
    }, [onClose, ref]);

    const handleSave = useCallback(() => {
      const trimmedName = name.trim();
      if (trimmedName) {
        onSave(trimmedName);
        setName("");
        handleClose();
      } else {
        showInfoToast({ message: "Category name is required" });
      }
    }, [name, onSave, handleClose]);

    useEffect(() => {
      const keyboardHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        if (visible) {
          (ref as any)?.current?.snapToIndex(0);
        }
      });

      return () => {
        keyboardHideSubscription.remove();
      };
    }, [visible, ref]);

    useEffect(() => {
      console.log("=== useEffect triggered - visible:", visible, "initialValue:", initialValue);
      if (visible) {
        console.log("Setting name to initial value:", initialValue || "");
        setName(initialValue || "");
      } else {
        console.log("Sheet hidden, clearing name");
        setName("");
      }
    }, [visible, initialValue]);

    return (
      <BottomSheetModal
        ref={ref}
        index={visible ? 0 : -1}
        enableDynamicSizing={true}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        handleIndicatorStyle={[
          styles.handle,
          { backgroundColor: colors.border },
        ]}
        backgroundStyle={[
          styles.background,
          {
            backgroundColor:
              colors.background === "#101122" ? "#0F1121" : colors.background,
          }
        ]}
        onChange={(index) => {
          console.log("=== BottomSheet onChange - index:", index, "visible:", visible);
        }}
      >
        <BottomSheetView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textMain }]}>
              {initialValue ? "Edit Category" : "New Category"}
            </Text>
            <IconPressable
              onPress={handleClose}
              size={25}
              haptic="heavy"
              pressedColor={colors.iconBgPressed}
              backgroundColor={colors.iconBg}
            >
              <Ionicons name="close" size={25} color={colors.textSecondary} />
            </IconPressable>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>NAME</Text>
            <BottomSheetTextInput
              ref={inputRef}
              style={[
                styles.input,
                {
                  color: colors.textMain,
                  backgroundColor: colors.surface,
                  borderColor: name.length > 0 ? colors.primary : colors.border,
                }
              ]}
              placeholder="e.g. Personal, Work, Ideas..."
              placeholderTextColor={colors.textSecondary + '70'}
              value={name}
              onChangeText={setName}
              maxLength={25}
            />
            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {name.length}/25
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.primary }
            ]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {initialValue ? "Update Category" : "Create Category"}
            </Text>
          </TouchableOpacity>

          {/* Bottom padding for safe area */}
          <View style={{ height: insets.bottom }} />
        </BottomSheetView>
      </BottomSheetModal>
    );
  });

AddCategoryBottomSheet.displayName = 'AddCategoryBottomSheet';

const styles = StyleSheet.create({
  background: {
    borderRadius: 32,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
