import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../store/hooks"; 
import { selectColors } from "../../store/selectors";
import { CARD_HEIGHT,  CARD_WIDTH, CARD_MARGIN } from "@/constants/categories";
import { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onFavorite?: () => void;
  isMenuVisible?: boolean;
  onToggleMenu?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  onEdit,
  onDelete,
  onFavorite,
  isMenuVisible,
  onToggleMenu,
}) => {
  const colors = useAppSelector(selectColors);


  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
      margin: CARD_MARGIN,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      position: "relative",
      overflow: "visible", // IMPORTANT
    },
    text: {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
      color: colors.text,
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
      color: colors.text,
      fontSize: 14,
    },
  });

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        {/* 3-dot Menu Button */}
        <TouchableOpacity
          style={styles.menuIconContainer}
          onPress={onToggleMenu}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
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
              <Ionicons name="create-outline" size={18} color={colors.text} />
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
              <Ionicons name={category.isFavorite ? "star" : "star-outline"} size={18} color={category.isFavorite ? colors.primary : colors.text} />
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
              <Ionicons name="trash-outline" size={18} color="red" />
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
