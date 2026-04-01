import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { Category } from "@/types/category/category.types";

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onFavorite?: () => void;
  isMenuVisible?: boolean;
  onToggleMenu?: () => void;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  onEdit,
  onDelete,
  onFavorite,
  isMenuVisible,
  onToggleMenu,
  width,
  height,
  style,
}) => {
  const { colors } = useTheme();


  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      borderWidth: 0.5,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      width: width,
      height: height,
      position: "relative",
      overflow: "visible",
    },
    text: {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
      color: colors.textMain,
      paddingHorizontal: 12,
    },
    menuIconContainer: {
      position: "absolute",
      top: 8,
      right: 8,
      padding: 6,
      zIndex: 20,
    },
    popupContainer: {
      position: "absolute",
      top: 35,
      right: 40,
      backgroundColor: colors.cardBg,
      paddingVertical: 4,
      borderRadius: 10,
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 6,
      zIndex: 999,
      width: 100,
    },
    menuItem: {
      paddingVertical: 4,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    menuText: {
      color: colors.textMain,
      fontSize: 14,
    },
  });

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={1}
        onPressIn={() => {}}
        onPressOut={() => {}}
      >
        {/* 3-dot Menu Button */}
        <TouchableOpacity
          style={styles.menuIconContainer}
          onPress={onToggleMenu}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textMain} />
        </TouchableOpacity>

        <Text style={styles.text}>{category.name}</Text>
      </TouchableOpacity>

      {/* Popup Menu — Now Attached to Card Itself */}
      {isMenuVisible && (
        <View style={styles.popupContainer}>
          {onEdit && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onToggleMenu?.();
                onEdit();
              }}
            >
              <Ionicons name="create-outline" size={18} color={colors.textMain} />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>
          )}

          {onFavorite && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onToggleMenu?.();
                onFavorite();
              }}
            >
              <Ionicons name={category.isFavorite ? "star" : "star-outline"} size={18} color={category.isFavorite ? colors.primary : colors.textMain} />
              <Text style={styles.menuText}>Favorite</Text>
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                onToggleMenu?.();
                onDelete();
              }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
