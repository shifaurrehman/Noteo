import React, { useEffect, useRef } from "react";
import { Pressable, View, Animated, StyleSheet, ColorValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeColors } from "@/theme/colors";

type Props = {
  value: boolean;
  onValueChange: (v: boolean) => void;
  colors: ThemeColors;
};

export const CustomSwitch: React.FC<Props> = ({ value, onValueChange, colors }) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 250,
      useNativeDriver: false, // transform/translateX can be native, but background colors/positioning often need JS driver for interpolation if not using specific native props
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 23], // Distance the head moves
  });

  const toggleSwitch = () => {
    onValueChange(!value);
  };

  const bgGradient = (value 
    ? [colors.settingsIcon, colors.accentBlue] 
    : [colors.settingsIcon + "30", colors.settingsIcon + "10"]) as [ColorValue, ColorValue];
    
  const headGradient = (value 
    ? ["#FFFFFF", "#F1F5F9"] 
    : ["#94A3B8", "#64748B"]) as [ColorValue, ColorValue];

  return (
    <Pressable onPress={toggleSwitch} style={styles.pressable}>
      <LinearGradient
        colors={bgGradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <View style={styles.innerContainer}>
          <Animated.View
            style={[
              styles.headWrapper,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={headGradient}
              style={styles.headGradient}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: 50,
    height: 28,
    borderRadius: 14,
  },
  backgroundGradient: {
    borderRadius: 14,
    flex: 1,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  headWrapper: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 1,
      elevation: 2,
  },
  headGradient: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});
