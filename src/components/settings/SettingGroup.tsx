import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeColors } from "@/theme/colors";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  title?: string;
  children: React.ReactNode;
  colors: ThemeColors;
};

export const SettingGroup: React.FC<Props> = ({ title, children, colors }) => {
  const { typography } = useTheme();

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.sectionTitle, { color: colors.lableText, fontSize: typography.bodySmall }]}>
          {title}
        </Text>
      )}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.settingsBorder,
          },
        ]}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;

          const isLast = index === React.Children.count(children) - 1;
          const childProps = child.props as { title?: string };

          return (
            <View key={childProps?.title || index}>
              {child}
              {!isLast && (
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: colors.settingsBorder },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    marginLeft: 6,
    letterSpacing: 1,
    opacity: 0.8,
  },
  card: {
    borderRadius: 27,
    borderWidth: 1,
    overflow: "hidden",
  },
  separator: {
    height: 1,
    marginLeft: 0,
    opacity: 0.5,
  },
});
