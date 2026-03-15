import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "@/theme/colors";
import { CustomSwitch } from "../button/CustomSwitch";

type Props = {
  title: string;
  value?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  colors: ThemeColors;
  danger?: boolean;
};

export const SettingItem: React.FC<Props> = ({
  title,
  value,
  leftIcon,
  rightIcon,
  onPress,
  switchValue,
  onSwitchChange,
  colors,
  danger = false,
}) => {
  const isSwitchMode = typeof switchValue === "boolean";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={isSwitchMode ? undefined : onPress}
      disabled={isSwitchMode && !onPress}
      style={styles.container}
    >
      <View style={styles.leftContent}>
        {leftIcon && (
          <View style={[styles.iconContainer, { backgroundColor: danger ? colors.danger + "15" : colors.settingsIcon + "15" }]}>
            <Ionicons
              name={leftIcon}
              size={18}
              color={danger ? colors.danger : colors.settingsIcon}
            />
          </View>
        )}
        <Text
          style={[
            styles.title,
            { color: danger ? colors.danger : colors.textMain },
          ]}
        >
          {title}
        </Text>
      </View>

      <View style={styles.rightContent}>
        {value && (
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {value}
          </Text>
        )}

        {isSwitchMode ? (
          <CustomSwitch
            value={switchValue!}
            onValueChange={onSwitchChange!}
            colors={colors}
          />
        ) : (
          (rightIcon || onPress) && (
            <Ionicons
              name={rightIcon || "chevron-forward"}
              size={18}
              color={colors.textSecondary}
              style={styles.chevron}
            />
          )
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 60,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 14,
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
});
