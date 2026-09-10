import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  noteCount?: number;
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
  noteCount,
  style,
}) => {
  const { colors } = useTheme();
  const isDarkMode = colors.background === "#101122";
  
  const categoryColor = category.color || colors.primary;
  const categoryIcon = category.icon || "folder";

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.settingsBorder,
      padding: 16,
      width: width,
      height: height,
      position: "relative",
      overflow: "visible",
      justifyContent: "space-between",
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: categoryColor + "15",
    },
    text: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textMain,
      marginTop: 8,
    },
    menuIconContainer: {
      position: "absolute",
      top: 12,
      right: 12,
      padding: 4,
      zIndex: 20,
    },
    popupContainer: {
      position: "absolute",
      top: 32,
      right: 18,
      backgroundColor: isDarkMode ? "#0F1121" : colors.background, // Match theme background
      paddingVertical: 3,
      borderRadius: 12,
      elevation: 10,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      zIndex: 999,
      width: width * 0.6,
      minWidth: 100,
      maxWidth: 120,
      borderWidth: 1,
      borderColor: isDarkMode ? colors.border + "30" : colors.border + "40",
    },
    menuItem: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    menuText: {
      color: colors.textMain,
      fontSize: 12.5,
      fontWeight: "600",
    },
    separator: {
      height: 1,
      backgroundColor: colors.border + "20",
      marginVertical: 1,
      marginHorizontal: 8,
    },
    noteTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.textMain,
      marginTop: "auto",
      marginBottom: 6,
    },
    noteCount: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      width: "100%",
    },
  });

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        onLongPress={onToggleMenu}
        activeOpacity={0.7}
      >
        <View style={styles.topRow}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={categoryIcon as any} size={24} color={categoryColor} />
          </View>

          <TouchableOpacity
            onPress={onToggleMenu}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.noteTitle} numberOfLines={1}>{category.name}</Text>
          <Text style={styles.noteCount}>{noteCount || 0} notes</Text>
        </View>
      </TouchableOpacity>

      {/* Popup Menu */}
      {isMenuVisible && (
        <View style={styles.popupContainer}>
          {onFavorite && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onToggleMenu?.();
                  onFavorite();
                }}
              >
                <Ionicons
                  name={category.isFavorite ? "heart" : "heart-outline"}
                  size={18}
                  color={category.isFavorite ? "#ff3b30" : colors.textMain}
                />
                <Text style={styles.menuText}>Favorite</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
            </>
          )}

          {onEdit && (
            <>
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
              <View style={styles.separator} />
            </>
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
              <Text style={[styles.menuText, { color: colors.danger }]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
