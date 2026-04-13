import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";
import type { ThemeColors } from "@/theme/colors";

interface PrimaryButtonProps {
  readonly title?: string;
  readonly onPress: () => void;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly style?: ViewStyle;
  readonly textStyle?: TextStyle;
  readonly loadingColor?: string;
  readonly testID?: string;
  readonly colors: ThemeColors;
}

export default function PrimaryButton({
  title = "Button",
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  loadingColor,
  testID,
  colors,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        isDisabled && styles.buttonDisabled,
        { backgroundColor: colors.primary },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={title}
      testID={testID}
    >
      {/* Keep text in the layout even when loading to maintain height */}
      <Text
        style={[
          styles.buttonText,
          textStyle,
          loading && styles.textHidden,
        ]}
      >
        {title}
      </Text>

      {/* Position loader absolutely over the text */}
      {loading && (
        <ActivityIndicator
          size="small"
          color={loadingColor || "#fff"}
          style={styles.loader}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56, // Ensures consistent minimum height
  },
  textHidden: {
    opacity: 0, // Hide text but keep it in layout
  },
  loader: {
    position: "absolute", // Overlay on top of hidden text
  },
});
