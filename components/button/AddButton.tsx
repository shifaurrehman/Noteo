import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface AddButtonProps {
  onPress: () => void;
  size?: number;
  colors: {
    primary: string;
    shadow: string;
    textOnPrimary?: string;
  };
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AddButton: React.FC<AddButtonProps> = ({
  onPress,
  size = 60,
  colors,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.addButtonContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
          shadowColor: colors.shadow,
        },
        style,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text
        style={[
          styles.addButtonText,
          {
            color: colors.textOnPrimary ?? "#fff",
            fontSize: size * 0.6,
          },
          textStyle,
        ]}
      >
        +
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "absolute",
    bottom: 25,
    right: 25,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
});
