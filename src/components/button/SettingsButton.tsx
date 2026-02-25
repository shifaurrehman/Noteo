import React from "react";
import { TouchableOpacity, View, Text, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  description?: string;
  leftIcon?: string;
  rightIcon?: string;
  active?: boolean;
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  colors: any;
};

export const SettingsButton: React.FC<Props> = ({
  title,
  description,
  leftIcon,
  rightIcon,
  active = false,
  onPress,
  switchValue,
  onSwitchChange,
  colors,
}) => {
  const isSwitchMode = typeof switchValue === "boolean";

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={!isSwitchMode ? onPress : () =>{}}
      style={[
        styles.container,
        {
          backgroundColor: active ? colors.primary + "10" : colors.surface,
          borderColor: active ? colors.primary : colors.border,
          borderWidth: leftIcon ? 2 : 1,
        },
      ]}
    >
      {/* Left Icon */}
      {leftIcon && (
        <Ionicons
          name={leftIcon as any}
          size={24}
          color={active ? colors.primary : colors.textSecondary}
          style={{ marginRight: 12 }}
        />
      )}

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {description && (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {description}
          </Text>
        )}
      </View>

      {/* Switch Mode */}
      {isSwitchMode && onSwitchChange ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary + "80" }}
          thumbColor={switchValue ? colors.primary : colors.textSecondary}
        />
      ) : (
        // Right icon if available
        rightIcon && (
          <Ionicons
            name={rightIcon as any}
            size={22}
            color={colors.primary}
          />
        )
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
  },
});
