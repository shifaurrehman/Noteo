import React, { useCallback, useMemo, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeColors } from "@/theme/colors";

interface Props {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  colors: ThemeColors;
  type?: "danger" | "warning" | "info";
}

export const ConfirmationBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, colors, type = "danger" }, ref) => {
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ["50%", "60%"], []);

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

    const handleConfirm = () => {
      onConfirm();
      (ref as any)?.current?.dismiss();
    };

    const handleCancel = () => {
      (ref as any)?.current?.dismiss();
    };

    const getIconName = () => {
      switch (type) {
        case "danger": return "alert-circle-outline";
        case "warning": return "warning-outline";
        case "info": return "information-circle-outline";
        default: return "alert-circle-outline";
      }
    };

    const getAccentColor = () => {
      switch (type) {
        case "danger": return colors.danger || "#FF4444";
        case "warning": return colors.warning || "#FFBB33";
        case "info": return colors.primary;
        default: return colors.danger || "#FF4444";
      }
    };

    const accentColor = getAccentColor();

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        enableDynamicSizing={true}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={[
          styles.handle,
          { backgroundColor: colors.settingsIcon + "40" },
        ]}
        backgroundStyle={{
          backgroundColor:
            colors.background === "#101122" ? "#0F1121" : colors.background,
          borderRadius: 32,
        }}
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { paddingBottom: insets.bottom + 24 },
          ]}
        >
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: accentColor + "15" }]}>
              <Ionicons name={getIconName()} size={28} color={accentColor} />
            </View>
            <Text style={[styles.title, { color: colors.textMain }]}>{title}</Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {message}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCancel}
              style={[
                styles.button,
                styles.cancelButton,
                { borderColor: colors.settingsBorder + "60", backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.cancelText, { color: colors.textMain }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConfirm}
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: type === "danger" ? accentColor : colors.primary },
              ]}
            >
              <Text style={styles.confirmText}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

ConfirmationBottomSheet.displayName = 'ConfirmationBottomSheet';

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 45,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
