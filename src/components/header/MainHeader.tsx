import React from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle, Pressable } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface MainHeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  showBorder?: boolean;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  title,
  rightComponent,
  leftComponent,
  containerStyle,
  titleStyle,
  showBorder = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.mainHeader,
      showBorder && { borderBottomWidth: 1, borderBottomColor: colors.border },
      containerStyle
    ]}>
      {leftComponent && (<Pressable style={[styles.leftComponentStyle]}>{leftComponent}</Pressable>)}
      <Text style={[styles.mainTitle, { color: colors.primary }, titleStyle]}>
        {title}
      </Text>
      {rightComponent && <View style={styles.headerRight}>{rightComponent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -1.0,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leftComponentStyle:{
    padding: 10,
    marginLeft: 16,
  }
});
