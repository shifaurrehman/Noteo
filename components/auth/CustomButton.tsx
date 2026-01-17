// components/GradientButton.tsx
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
import { LinearGradient } from "expo-linear-gradient";

interface GradientButtonProps {
  readonly title?: string;
  readonly onPress: () => void;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly gradientColors?: readonly [string, string, ...string[]];
  readonly style?: ViewStyle;
  readonly textStyle?: TextStyle;
  readonly loadingColor?: string;
  readonly testID?: string;
}

export default function GradientButton({
  title = "Button",
  onPress,
  loading = false,
  disabled = false,
  gradientColors = ["#667eea", "#764ba2"] as const,
  style,
  textStyle,
  loadingColor = "#fff",
  testID,
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={title}
      testID={testID}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.buttonGradient}
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
            color={loadingColor}
            style={styles.loader}
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#667eea",
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
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56, // Ensures consistent minimum height
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  textHidden: {
    opacity: 0, // Hide text but keep it in layout
  },
  loader: {
    position: "absolute", // Overlay on top of hidden text
  },
});