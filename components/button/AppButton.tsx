import React from "react";
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

type ButtonVariant = "primary" | "secondary";

interface AppButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: "light" | "medium" | "heavy";
  colors?: {
    primary?: string;
    secondary?: string;
    textPrimary?: string;
    textSecondary?: string;
    disabled?: string;
  };
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AppButton = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
  haptic = "light",
  colors = {},
}: AppButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const triggerHaptic = () => {
    if (disabled) return;

    if (haptic === "light")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (haptic === "medium")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (haptic === "heavy")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  // Background color based on variant and disabled state
  const backgroundColor = disabled
    ? colors.disabled || "#ccc"
    : variant === "primary"
    ? colors.primary || "#ff008c"
    : colors.secondary || "#E5E5EA";

  // Text color based on variant and disabled state
  const color = disabled
    ? "#999"
    : variant === "primary"
    ? colors.textPrimary || "#fff"
    : colors.textSecondary || "#000";

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.91, {
          damping: 15,
          stiffness: 200,
        });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, {
          damping: 14,
          stiffness: 160,
        });
      }}
      onPress={() => {
        triggerHaptic();
        onPress?.();
      }}
      style={[styles.base, { backgroundColor }, animatedStyle, style]}
    >
      <Text style={[styles.text, { color }, textStyle]}>{title}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
