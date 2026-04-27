import React, { ReactNode, useEffect } from "react";
import { Pressable, StyleSheet, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface IconPressableProps {
  children: ReactNode;
  onPress?: () => void;
  size?: number;
  backgroundColor?: string;
  pressedColor?: string;
  style?: StyleProp<ViewStyle>;
  haptic?: "light" | "medium" | "heavy";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const IconPressable = ({
  children,
  onPress,
  size = 44,
  backgroundColor,
  pressedColor,
  style,
  haptic = "light",
}: IconPressableProps) => {
  // Default to transparent if no backgroundColor is provided
  const bgColor = backgroundColor ?? "transparent";
  const scale = useSharedValue(1);
  const bg = useSharedValue(bgColor);
  const containerSize = size + 12;

  // keep bg in sync if theme changes
  useEffect(() => {
    bg.value = bgColor;
  }, [bgColor, bg]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: bg.value,
  }));

  const triggerHaptic = () => {
    if (haptic === "light") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (haptic === "medium") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (haptic === "heavy") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 15 });
        if (pressedColor) bg.value = pressedColor;
        triggerHaptic();
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
        bg.value = bgColor;
      }}
      onPress={onPress}
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
});
