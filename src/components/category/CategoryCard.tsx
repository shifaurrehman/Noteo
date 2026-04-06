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
      borderColor: isDarkMode ? colors.border + "33" : colors.border + "80",
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
      top: 40,
      right: 12,
      backgroundColor: isDarkMode ? colors.surface : "#FFFFFF",
      paddingVertical: 6,
      borderRadius: 12,
      elevation: 8,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      zIndex: 999,
      width: 120,
      borderWidth: 1,
      borderColor: colors.border + "33",
    },
    menuItem: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    menuText: {
      color: colors.textMain,
      fontSize: 14,
      fontWeight: "500",
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
            onPress={onFavorite}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons 
              name="heart" 
              size={18} 
              color={category.isFavorite ? "#ff3b30" : colors.border} 
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
              <Ionicons 
                name={category.isFavorite ? "star" : "star-outline"} 
                size={18} 
                color={category.isFavorite ? colors.primary : colors.textMain} 
              />
              <Text style={styles.menuText}>Favorite</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 1, backgroundColor: colors.border + "33", marginVertical: 4 }} />

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
